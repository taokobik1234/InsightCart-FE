import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import useMediaQuery from '@mui/material/useMediaQuery';
const Sidebar = () => {
    const isTablet = useMediaQuery('(max-width: 950px)');
    const isNonMobile = useMediaQuery('(max-width: 600px)');
    const drawerWidth = isNonMobile ? '0' : isTablet ? '200px' : '240px';
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <List>
                {[
                    { text: "11.11 Sale Khủng Nhất Năm", icon: <CardGiftcardIcon />, path: "/" },
                    { text: "Tài Khoản Của Tôi", icon: <AccountCircleIcon />, path: "/user/profile" },
                    { text: "Đơn Mua", icon: <ShoppingCartIcon />, path: "/orders" },
                    { text: "Thông Báo", icon: <NotificationsIcon />, path: "/user/notification" },
                    { text: "Kho Voucher", icon: <AttachMoneyIcon />, path: "/vouchers" }
                ].map((item, index) => (
                    <ListItem button key={item.text} component={Link} to={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
