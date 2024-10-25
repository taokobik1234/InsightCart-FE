import { Box, Typography, useMediaQuery, TextField, Button } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authslice";
const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesLogin = {
  email: "",
  password: "",
};
const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobileScreens = useMediaQuery("(min-width: 600px)");

  const handleSignIn = async (values, onSubmitProps) => {
    try {
      const API_URL = "http://tancatest.me/api/v1/users/sign-in"
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      }).then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      dispatch(loginSuccess(response.data));
      onSubmitProps.resetForm();

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box>
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={"#F0F0F0"}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "20px" }}>
          Welcome to InsightCart, the Shopping Media for every one!
        </Typography>
        {/* <Form /> */}
        <Box>

          <Formik
            onSubmit={handleSignIn}
            initialValues={initialValuesLogin}
            validationSchema={loginSchema}
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
                    "& > div": { gridColumn: isNonMobileScreens ? undefined : "span 4" },
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
                    LOGIN
                  </Button>
                  <Typography
                    align="center"
                    onClick={() => {
                      navigate("/auth/forgot-password");
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
                    "Forgot Password?"
                  </Typography>

                  <Typography mt={"10px"} mb={"10px"} align="center">
                    Or
                  </Typography>
                  <Typography
                    align="center"
                    onClick={() => {
                      navigate("/auth/sign-up");
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
                    "Don't have an account? Sign Up here."
                  </Typography>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;