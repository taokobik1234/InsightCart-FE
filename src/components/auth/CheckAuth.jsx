import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
export default function CheckAuth({children}) {
  const {isAuthenticated} = useSelector(state => state.auth)
  const location = useLocation()
  console.log(isAuthenticated, location.pathname.includes("/auth"))
  if(isAuthenticated && location.pathname.includes("/auth")) {
    return <Navigate to="/" />
  }
  return (
    <>
      {children}
    </>
  )
}
