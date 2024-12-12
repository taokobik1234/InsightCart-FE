import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
export default function CheckAuth({children}) {
  const admin = ["phamgianguyen.qn@gmail.com", "ducduy19012310@gmail.com"]
  const {isAuthenticated, user} = useSelector(state => state.auth)
  const location = useLocation()
  if(isAuthenticated && location.pathname.includes("/auth")) {
    if(admin.includes(user.email)) {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/" />
  }
  if(!isAuthenticated && (location.pathname.includes("/user") || location.pathname.includes("/admin"))) {
    console.log(location.pathname, isAuthenticated);
    return <Navigate to="/auth/sign-in" />
  }
  if(isAuthenticated && !admin.includes(user.email) && location.pathname.includes("/admin")) {
    return <Navigate to="/" />
  }
  if(isAuthenticated && admin.includes(user.email) && !location.pathname.includes("/admin")) {
    return <Navigate to="/admin" />
  }
  return (
    <>
      {children}
    </>
  )
}
