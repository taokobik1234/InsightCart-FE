import { Routes, Route } from "react-router-dom";
import LoginScreen from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import HomeScreen from "./pages";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyRequest from "./pages/auth/verify-request";
import ForgotPassword from "./pages/auth/forgot-password";
import VerifyEmail from "./pages/auth/verify-email";
import ResetPassword from "./pages/auth/reset-password";
import Header from "./components/Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./store/authslice";
import CheckAuth from "./components/auth/CheckAuth";
import UserLayout from "./components/user/UserLayout";
import Profile from "./pages/user/profile";
import CreateShop from "./pages/user/create-shop";
function App() {
  const persistAuth = localStorage.getItem("persist:auth");
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector(state => state.auth)
  useEffect(() => {
    if(!persistAuth) return
    const auth = JSON.parse(persistAuth).auth;
    const user = JSON.parse(auth).user;
    if (!user) return;
    dispatch(checkAuth({userId: user.id, sessionId: user.session_id, token: user.token.AccessToken, clientId : user.id}));
  }, [persistAuth, dispatch, isAuthenticated]);
  return (
    <div>

      <Header />
        <CheckAuth>
        <Routes>
          <Route path='/user' element={<UserLayout />} >
            <Route path="profile" element={<Profile />} />
            <Route path="create-shop" element={<CreateShop />} />
          </Route>
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
        </CheckAuth>
    </div>
  );
}

export default App;
