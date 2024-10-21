import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import './App.css';
import LoginScreen from "./pages/auth/sign-in";
import SignUp from "./pages/auth/sign-up";
import HomeScreen from "./pages/HomeScreen";
import AuthLayout from "./components/auth/AuthLayout";
import VerifyRequest from "./pages/auth/verify-request";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} >
            <Route path="sign-in" element={<LoginScreen />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="verify-request/:email" element={<VerifyRequest />} />
          </Route>
          <Route path="/home" element={<HomeScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
