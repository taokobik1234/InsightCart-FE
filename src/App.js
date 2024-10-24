import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import HomeScreen from "./pages";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyRequest from "./pages/auth/verify-request";
import ForgotPassword from "./pages/auth/forgot-password";
import VerifyEmail from "./pages/auth/verify-email";
import ResetPassword from "./pages/auth/reset-password";
import Header from "./components/Header";
function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} >
            <Route path="sign-in" element={<LoginScreen />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="verify-request/:email" element={<VerifyRequest />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
