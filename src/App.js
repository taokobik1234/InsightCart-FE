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
import { checkAuth } from "./store/userslice";
import { fetchAllProducts } from "./store/productslice";
import CheckAuth from "./components/auth/CheckAuth";
import UserLayout from "./components/user/UserLayout";
import Profile from "./pages/user/profile";
import CreateShop from "./pages/user/create-shop";
import ViewYourShop from "./pages/user/view-shop";
import ViewShop from "./pages/shop/view-shop";
import Notification from "./pages/user/notification";
import Footer from "./components/Footer";
import About from "./pages/about";
import AdminScreen from "./pages/admin";
import AdminLayout from "./components/admin/AdminLayout";
import ShopVerify from "./pages/admin/shop-verify";
import Contact from "./pages/contact";
import Category from "./pages/admin/category";
import ProductList from "./pages/product/productList";
import ProductDetailPage from "./pages/product/productDetail";
import CartScreen from "./pages/product/cart";
import CheckoutPage from "./pages/product/checkout";
import OrderSuccessPage from "./pages/product/order-success";
import OrderHistory from "./pages/user/order-history";

function App() {
  const persistAuth = localStorage.getItem("persist:root");
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!persistAuth) return;
    const auth = JSON.parse(persistAuth).auth;
    const user = JSON.parse(auth).user;
    if (!user) return;
  }, [persistAuth, dispatch, isAuthenticated, checkAuth]);
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <div>
      <CheckAuth>
        <Header />
        <div className="min-h-screen">
          <Routes>
            <Route path="/user" element={<UserLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="create-shop" element={<CreateShop />} />
              <Route path="view-shop" element={<ViewYourShop />} />
              <Route path="notification" element={<Notification />} />
              <Route path="order-history" element={<OrderHistory />} />
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="sign-in" element={<LoginScreen />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="verify-request/:email" element={<VerifyRequest />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminScreen />} />
              <Route path="shop-verify" element={<ShopVerify />} />
              <Route path="category" element={<Category />} />
            </Route>
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/products/:categoryId" element={<ProductList />} />
            <Route
              path="/products/details/:productId"
              element={<ProductDetailPage />}
            />
            <Route path="/shop/:shopId" element={<ViewShop />} />
          </Routes>
        </div>
        <Footer />
      </CheckAuth>
    </div>
  );
}

export default App;
