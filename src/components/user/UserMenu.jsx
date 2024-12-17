
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import { CiMenuBurger } from "react-icons/ci";
import { logout } from '../../store/authslice';
import { setUser, setUserMedia } from '../../store/userslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setUser(null));
    dispatch(setUserMedia(null));
    navigate('/');
  };

  return (
    <div className='bg-white'>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <CiMenuBurger size={20} color='black' />
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => {
            navigate('/user/profile')
            handleClose()
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/user/create-shop')
            handleClose()
          }}
        >
          Create your shop
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}