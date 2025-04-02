import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, IconButton, Chip, Divider } from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
  ShoppingCart as OrderIcon,
  Delete as DeleteIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useState } from 'react';

interface Notification {
  id: number;
  type: 'inventory' | 'order' | 'shipping' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'inventory',
    title: 'Low Stock Alert',
    message: 'Product A is running low on stock. Current quantity: 5',
    timestamp: '2024-01-20T10:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'order',
    title: 'New Order Received',
    message: 'Order #1234 has been placed and is awaiting processing',
    timestamp: '2024-01-20T09:45:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'shipping',
    title: 'Order Shipped',
    message: 'Order #1230 has been shipped to the customer',
    timestamp: '2024-01-20T08:15:00Z',
    read: true,
    priority: 'low'
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'inventory':
        return <InventoryIcon color="primary" />;
      case 'order':
        return <OrderIcon color="info" />;
      case 'shipping':
        return <ShippingIcon color="success" />;
      case 'alert':
        return <WarningIcon color="error" />;
      default:
        return <WarningIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Notifications</Typography>
        <Chip
          label={`${notifications.filter(n => !n.read).length} Unread`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <List>
        {notifications.map((notification, index) => (
          <Box key={notification.id}>
            <ListItem
              sx={{
                bgcolor: notification.read ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemIcon>
                {getIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {notification.title}
                    <Chip
                      label={notification.priority}
                      size="small"
                      color={getPriorityColor(notification.priority) as any}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!notification.read && (
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleMarkAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <CheckIcon />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(notification.id)}
                  title="Delete notification"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
            {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;