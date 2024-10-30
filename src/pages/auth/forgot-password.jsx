import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
});

const initialValuesSignUp = {
    email: "",
};
export default function ForgotPassword() {
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [errorText, setErrorText] = useState("");
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const handleSendEmail = async (values, onSubmitProps) => {
        try {
            const API_URL = "http://tancatest.me/api/v1/users/forget-password"
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: values.email,
                }),
            }).then(response => response.json());
            if (response.message !== "Success") {
                console.log(response);
                setErrorText(response.message);
            } else {
                onSubmitProps.resetForm();
                navigate(`/auth/verify-request/${values.email}?type=forget-password`);
            }

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Box mt={"100px"}>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor={"#F0F0F0"}
            >
                <Typography fontWeight="800" variant="h5" sx={{ mb: "20px" }}>
                    Verify your email
                </Typography>
                <Typography variant="h6" sx={{ mb: "30px" }}>
                    Enter your email and we will send you a link to reset your password
                </Typography>
                {/* <Form /> */}
                <Box>

                    <Formik
                        onSubmit={handleSendEmail}
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
                                        label="Email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={Boolean(touched.email) && Boolean(errors.email)}
                                        helperText={touched.email && errors.email}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                    {errorText && <Box sx={{ gridColumn: "span 4" }}>
                                        <Typography color="red" >{errorText}</Typography>
                                    </Box>}
                                </Box>
                                <Box>
                                    <Button
                                        fullWidth
                                        type="submit"
                                        sx={{
                                            m: "2rem 0",
                                            p: "1rem",
                                            backgroundColor: "#00D5FA",
                                            color: "#FFFFFF",
                                            "&:hover": { Opacity: 0.5 },
                                        }}
                                    >
                                        Send Email
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
