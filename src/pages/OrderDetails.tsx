import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TextField,
  IconButton,
  Timeline,
  TimelineItem,
  TimelineContent,
  TimelineDot,
  TimelineSeparator,
  TimelineConnector,
  Divider,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Print as PrintIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as PaymentIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateOrder, updateOrderStatus, generateInvoice, addOrderNote } from '../features/orders/ordersSlice';
import { Order, OrderStatus } from '../types/order';
import { format } from 'date-fns';

interface OrderDetailsProps {
  orderId: string;
  open: boolean;
  onClose: () => void;
}

const OrderDetails = ({ orderId, open, onClose }: OrderDetailsProps) => {
  const dispatch = useDispatch();
  const order = useSelector((state: RootState) => 
    state.orders.orders.find(o => o.id === orderId)
  );
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});

  if (!order) {
    return null;
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    await dispatch(updateOrderStatus(order.id, newStatus));
  };

  const handleAddNote = async () => {
    if (note.trim()) {
      await dispatch(addOrderNote(order.id, note));
      setNote('');
    }
  };

  const handleSaveEdit = async () => {
    await dispatch(updateOrder(order.id, editedOrder));
    setIsEditing(false);
    setEditedOrder({});
  };

  const handlePrintInvoice = async () => {
    const invoice = await dispatch(generateInvoice(order.id));
    // Handle invoice blob data
    const url = window.URL.createObjectURL(invoice);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
      refunded: 'error'
    };
    return colors[status];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Order #{order.orderNumber}
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={handlePrintInvoice} size="small">
            <PrintIcon />
          </IconButton>
          <IconButton onClick={() => setIsEditing(!isEditing)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Order Summary */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Customer Information
                    </Typography>
                    <Typography variant="body1">
                      {order.customerName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer ID: {order.customerId}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1} alignItems="flex-end">
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6">
                      Total: ${order.total.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {format(new Date(order.createdAt), 'PPP')}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Order Items
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell align="right">${item.totalPrice.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">${order.subtotal.toFixed(2)}</TableCell>
                </TableRow>
                {order.discount && (
                  <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">-${order.discount.toFixed(2)}</TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="right">Tax</TableCell>
                  <TableCell align="right">${order.tax.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="right">Shipping</TableCell>
                  <TableCell align="right">${order.shipping.shippingCost.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} />
                  <TableCell align="right"><strong>Total</strong></TableCell>
                  <TableCell align="right"><strong>${order.total.toFixed(2)}</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          {/* Shipping Information */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Details
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Delivery Address
                  </Typography>
                  <Typography variant="body1">
                    {order.shipping.address.street}
                  </Typography>
                  <Typography variant="body1">
                    {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postalCode}
                  </Typography>
                  <Typography variant="body1">
                    {order.shipping.address.country}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Shipping Method
                  </Typography>
                  <Typography variant="body1">
                    {order.shipping.method}
                  </Typography>
                  {order.shipping.trackingNumber && (
                    <Typography variant="body2">
                      Tracking: {order.shipping.trackingNumber}
                    </Typography>
                  )}
                </Box>
                {order.shipping.estimatedDeliveryDate && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Estimated Delivery
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(order.shipping.estimatedDeliveryDate), 'PPP')}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Order Timeline */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Order Timeline
            </Typography>
            <Paper sx={{ p: 2 }}>
              <Timeline>
                {order.statusHistory.map((history, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color={getStatusColor(history.status)} />
                      {index < order.statusHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">
                        {history.status}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(history.timestamp), 'PPp')}
                      </Typography>
                      {history.note && (
                        <Typography variant="body2" color="text.secondary">
                          {history.note}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          </Grid>

          {/* Notes Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Notes
            </Typography>
            <Stack spacing={2}>
              {order.notes.map((note) => (
                <Alert key={note.id} severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                  <Typography variant="body1">{note.content}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Added by {note.createdBy} on {format(new Date(note.createdAt), 'PPp')}
                  </Typography>
                </Alert>
              ))}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button variant="contained" onClick={handleAddNote}>
                  Add Note
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          startIcon={<EmailIcon />}
          onClick={() => {/* Implement email functionality */}}
        >
          Email Invoice
        </Button>
        <Button
          startIcon={<ShippingIcon />}
          onClick={() => handleStatusChange('shipped')}
          disabled={order.status === 'shipped' || order.status === 'delivered'}
        >
          Mark as Shipped
        </Button>
        <Button
          startIcon={<PaymentIcon />}
          color="primary"
          variant="contained"
          onClick={() => {/* Implement payment functionality */}}
          disabled={order.paymentStatus === 'paid'}
        >
          Process Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetails;