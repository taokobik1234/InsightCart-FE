import { Box, Typography, useMediaQuery,TextField ,Button} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useState } from "react";

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  const initialValuesLogin = {
    email: "",
    password: "",
  };
const LoginScreen = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [pageType, setPageType] = useState("login");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  return (
    <Box>
      <Box
        backgroundColor={"#F0F0F0"}
        p="1rem 6%"
      >
        <Typography fontWeight="bold" fontSize="32px" color="#00D5FA">
             InsightCart
        </Typography>
      </Box>

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
        onSubmit={()=>{
            console.log("hello")}}
        initialValues={ initialValuesLogin }
        validationSchema={ loginSchema }
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
                "&:hover": { color: "#00D5FA" },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
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
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
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