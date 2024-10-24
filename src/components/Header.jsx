import React from 'react'
import { Box, Typography } from '@mui/material'
import UserMenu from './user/UserMenu'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
export default function Header() {
  const {isAuthenticated} = useSelector(state => state.auth)
  return (
    <Box
      backgroundColor={"#F0F0F0"}
      p="1rem 6%"
      display={"flex"}
      justifyContent={"space-between"}
      alignContent={"center"}
    >
      <Typography fontWeight="bold" fontSize="32px" color="#00D5FA" sx={{ "&:hover": { cursor: "pointer" }}}>
        InsightCart
      </Typography>
      <div className='flex items-center justify-center'>
        {isAuthenticated ? <UserMenu /> : <Link to="/auth/sign-in">Sign In</Link>}
      </div>
    </Box>
  )
}
