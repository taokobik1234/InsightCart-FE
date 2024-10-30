import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'
export default function UserLayout() {
  const { isAuthenticated } = useSelector(state => state.auth)
  return (
    <div>
      <Outlet />
      {isAuthenticated ? <Sidebar /> : null}
    </div>
  )
}

