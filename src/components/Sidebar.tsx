import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { 
  Dashboard as DashboardIcon,
  ShoppingCart,
  People,
  Payment,
  Inventory,
  Analytics as AnalyticsIcon,
  LocalShipping,
  Assessment,
  Notifications,
  Settings
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const theme = useTheme();
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
    { text: 'Inventory', icon: <Inventory />, path: '/inventory' },
    { text: 'Customers', icon: <People />, path: '/customers' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Suppliers', icon: <LocalShipping />, path: '/suppliers' },
    { text: 'Reports', icon: <Assessment />, path: '/reports' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Payments', icon: <Payment />, path: '/payments' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          mt: 8,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            button
            sx={{
              margin: '4px 8px',
              borderRadius: 2,
              color: theme.palette.primary.main,
              transition: 'all 0.3s ease',
              '& .MuiListItemIcon-root': {
                color: theme.palette.primary.main,
                transition: 'all 0.3s ease',
              },
              '&:hover': {
                backgroundColor: 'rgba(44, 62, 80, 0.1)',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.dark,
                  transform: 'scale(1.1)',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;