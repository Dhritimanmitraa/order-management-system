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

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
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
      variant="persistent"
      anchor="left"
      open={open}
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
          position: 'relative',
          height: 'calc(100vh - 64px)',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateX(10px)',
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;