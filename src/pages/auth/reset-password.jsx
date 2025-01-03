
import React from 'react'
import { Box, Typography, useMediaQuery, TextField, Button, IconButton, InputAdornment, Alert } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
const SignUpSchema = yup.object().shape({
    password: yup.string().required("required"),
});

const initialValuesSignUp = {
    email: "",
};
export default function ResetPassword() {
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [errorText, setErrorText] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }
    const resetPassword = async (values, onSubmitProps) => {
        if (values.password !== values.confirmPassword) {
            setErrorText({ type: "error", message: "Passwords do not match" });
            setTimeout(() => setErrorText(""), 3000);
            return;
        }
        try {
            const response = await fetch(`http://tancatest.me/api/v1/users/reset-password?token=${encodeURIComponent(token)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    new_password: values.password
                })
            });
            const data = await response.json();
            if (data.message !== 'Success') {
                setErrorText({ type: "error", message: data.message || 'Failed to verify' });
                setTimeout(() => setErrorText(""), 3000);
            } else {
                setErrorText({ type: "success", message: "Reset Successful" });
                setTimeout(() => {
                    setErrorText("");
                    navigate("/auth/sign-in")
                }, 3000);
            }
        } catch (error) {
            setErrorText(error.message);
        }
    };
    return (
        <Box>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={"#F0F0F0"}
            >
                {errorText && (
                    <Box
                        sx={{
                            position: "fixed",
                            top: "100px",
                            right: "20px",
                            zIndex: 1000,
                            minWidth: "250px",
                        }}
                    >
                        <Alert severity={errorText.type} variant="filled">
                            {errorText.message}
                        </Alert>
                    </Box>
                )}
                <Typography fontWeight="800" variant="h5" sx={{ mb: "20px" }}>
                    Reset Password
                </Typography>
                <Typography variant="h6" sx={{ mb: "30px" }}>
                    Please enter your password and confirm password
                </Typography>
                {/* <Form /> */}
                <Box>

                    <Formik
                        onSubmit={resetPassword}
                        initialValues={initialValuesSignUp}
                        validationSchema={SignUpSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            setFieldValue,
                            resetForm,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <Box
                                    display="grid"
                                    gap="30px"
                                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                    sx={{
                                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                                    }}
                                >
                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        label="Password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        error={Boolean(touched.password && errors.password)}
                                        helperText={touched.password && errors.password}
                                        sx={{ gridColumn: "span 4" }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={togglePasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <TextField
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        label="Confirm Password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.confirmPassword}
                                        name="confirmPassword"
                                        error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                        sx={{ gridColumn: "span 4" }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={toggleConfirmPasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Button
                                        fullWidth
                                        type="submit"
                                        sx={{
                                            m: "2rem 0",
                                            p: "1rem",
                                            backgroundColor: "#3B82F6",
                                            color: "#FFFFFF",
                                            "&:hover": { Opacity: 0.5 },
                                        }}
                                    >
                                        Reset Password
                                    </Button>

                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </Box>
        </Box>
    )
}
