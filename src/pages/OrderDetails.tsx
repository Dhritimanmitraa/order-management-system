import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Card, CardContent, Typography, Grid, Button, TextField, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { updateOrderStatus, updateTrackingNumber, updateOrderNotes, Order } from '../features/orders/ordersSlice';
import { RootState } from '../app/store';

interface OrderDetailsProps {
  orderId: number;
  onClose: () => void;
  open: boolean;
}

const OrderDetails = ({ orderId, onClose, open }: OrderDetailsProps) => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => 
    state.orders.orders.find((o: Order) => o.id === orderId)
  );

  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNumber || '');
  const [notes, setNotes] = useState(order?.notes || '');
  const [status, setStatus] = useState(order?.status || 'Pending');

  if (!order) {
    return (
      <Box p={3}>
        <Typography color="error">Order not found</Typography>
      </Box>
    );
  }

  const handleStatusChange = (newStatus: Order['status']) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
    setStatus(newStatus);
  };

  const handleTrackingUpdate = () => {
    dispatch(updateTrackingNumber({ orderId, trackingNumber }));
  };

  const handleNotesUpdate = () => {
    dispatch(updateOrderNotes({ orderId, notes }));
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      Pending: 'warning',
      Processing: 'info',
      Shipped: 'primary',
      Delivered: 'success',
      Cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Order Details - {order.orderNumber}</Typography>
          <Chip label={order.status} color={getStatusColor(order.status) as any} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Typography><strong>Name:</strong> {order.customerName}</Typography>
                <Typography><strong>Email:</strong> {order.customerEmail}</Typography>
                <Typography><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Status Management */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Status</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    label="Status"
                    onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Tracking Number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button variant="contained" onClick={handleTrackingUpdate}>
                    Update Tracking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Order Items</Typography>
                <Grid container spacing={2}>
                  {order.items.map((item: any) => (
                    <Grid item xs={12} key={item.productId}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>{item.productName}</Typography>
                        <Typography>
                          {item.quantity} x ${item.price.toFixed(2)} = ${item.subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Typography variant="h6">Total: ${order.total.toFixed(2)}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Order Notes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Notes</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="contained" onClick={handleNotesUpdate}>
                  Update Notes
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetails;