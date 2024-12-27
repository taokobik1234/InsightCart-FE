import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useSelector } from "react-redux";
import { logout } from '../../store/authslice';
import { setUser, setUserMedia } from '../../store/userslice';
import { setShop } from "../../store/shopSlice";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { shop } = useSelector(state => state.shop);
  const { user: authUser } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!authUser?.id) return;
      
      try {
        const response = await fetch(`http://tancatest.me/api/v1/users/${authUser.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'session-id': authUser.session_id,
            'Authorization': `Bearer ${authUser.token.AccessToken}`,
            'x-client-id': authUser.id
          }
        });
        const data = await response.json();
        if (data.data) {
          setUserName(data.data.name);
          setUserAvatar(data.data.avatar?.url || "");
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [authUser]);

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
    dispatch(setShop(null));
    navigate('/');
  };
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="flex items-center gap-2"
      >
        {userAvatar ? (
          <img 
            src={userAvatar} 
            alt="User avatar" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white">
            <span className="text-gray-600 text-sm">
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
        )}
        <span className="text-white">{userName || "Menu"}</span>
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
            shop ? navigate('/user/view-shop'):navigate('/user/create-shop');
            handleClose()
          }}
        >
          {shop ? "Seller panel" :"Create shop"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/user/order-history');
            handleClose()
          }}
        >
          Order History
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}