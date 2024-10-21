import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import HeaderTitle from "../../components/HeaderTitle";
import { useState } from "react";

const SignUpSchema = yup.object().shape({
  name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesSignUp = {
  name: "",
  email: "",
  password: "",
};
export default function SignUp() {
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [errorText, setErrorText] = useState("");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleSignUp = async (values, onSubmitProps) => {
    try {
      const API_URL = "http://tancatest.me/api/v1/users/sign-up"
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      }).then(response => response.json());
      if (response.message !== "Success") {
        console.log(response);
        setErrorText(response.message);
      } else {
        onSubmitProps.resetForm();
        navigate(`/auth/verify-request/${values.email}`);
      }

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box>
      <HeaderTitle />

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={"#F0F0F0"}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "20px" }}>
          Sign Up
        </Typography>
        {/* <Form /> */}
        <Box>

          <Formik
            onSubmit={handleSignUp}
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
                    label="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    error={Boolean(touched.name) && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{ gridColumn: "span 4" }}
                  />
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
                  <TextField
                    label="Password"
                    type="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={Boolean(touched.password) && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
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
                    Sign Up
                  </Button>
                  <Typography
                    onClick={() => {
                      navigate("/auth/sign-in");
                    }}
                    sx={{
                      textDecoration: "underline",
                      color: "#00D5FA",
                      "&:hover": {
                        cursor: "pointer",
                        color: "#E6FBFF",
                      },
                    }}
                  >
                    "Already has an account? Sign In here."
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>

    </Box>
  )
}
