import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
const admin = ["phamgianguyen.qn@gmail.com"]
export default function CheckAuth({children}) {
  const {isAuthenticated, user} = useSelector(state => state.auth)
  const location = useLocation()
  if(isAuthenticated && location.pathname.includes("/auth")) {
    if(admin.includes(user.email)) {
      return <Navigate to="/admin" />
    }
    return <Navigate to="/" />
  }
  if(!isAuthenticated && location.pathname.includes("/user")) {
    return <Navigate to="/auth/sign-in" />
  }
  if(!admin.includes(user.email) && location.pathname.includes("/admin")) {
    return <Navigate to="/" />
  }
  if(admin.includes(user.email) && !location.pathname.includes("/admin")) {
    return <Navigate to="/admin" />
  }
  return (
    <>
      {children}
    </>
  )
}
