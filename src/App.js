import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginScreen from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import HomeScreen from "./pages/HomeScreen";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyRequest from "./pages/auth/verify-request";
import ForgotPassword from "./pages/auth/forgot-password";
import VerifyEmail from "./pages/auth/verify-email";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} >
            <Route path="sign-in" element={<LoginScreen />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="verify-request/:email" element={<VerifyRequest />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
          </Route>
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/home" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
