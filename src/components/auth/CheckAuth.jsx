import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
export default function CheckAuth({children}) {
  const {isAuthenticated} = useSelector(state => state.auth)
  if(isAuthenticated && window.location.pathname.includes("/auth")) {
    return <Navigate to="/" />
  }
  return (
    <>
      {children}
    </>
  )
}
