import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './SideBar'

export default function AdminLayout() {
  return (
    <div className="w-screen min-h-screen flex flex-row h-max">
      <Sidebar />
      <Outlet />
    </div>
  )
}
