import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UserMenu from './user/UserMenu';

export default function Header() {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#F0F0F0" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignContent: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: "32px",
            color: "#00D5FA",
            "&:hover": { cursor: "pointer" },
          }}
        >
          InsightCart
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated ? <UserMenu /> : <Link to="/auth/sign-in" style={{ textDecoration: 'none', color: 'inherit' }}>Sign In</Link>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
