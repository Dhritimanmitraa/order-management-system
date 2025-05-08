import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, IconButton, Alert } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { Product } from '../types';
import { getProducts } from '../features/inventory/inventorySlice';
import { createOrder } from '../features/orders/ordersSlice';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const AddOrder = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state: RootState) => state.inventory);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  const handleAddItem = () => {
    setItems([...items, {
      productId: 0,
      productName: '',
      quantity: 1,
      price: 0,
      subtotal: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    const item = newItems[index];

    if (field === 'productId') {
      const product = products.find((p: Product) => p.id === value);
      if (product) {
        item.productId = product.id;
        item.productName = product.name;
        item.price = product.price;
        item.subtotal = product.price * item.quantity;
      }
    } else if (field === 'quantity') {
      item.quantity = value;
      item.subtotal = item.price * value;
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const validateForm = () => {
    if (!customerName.trim()) {
      return 'Customer name is required';
    }
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return 'Valid email is required';
    }
    if (items.length === 0) {
      return 'At least one item is required';
    }
    for (const item of items) {
      if (item.quantity <= 0) {
        return 'Quantity must be greater than 0';
      }
      if (item.productId === 0) {
        return 'Please select a product for all items';
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    try {
      const newOrder = {
        orderNumber: `ORD-${Date.now()}`,
        customerName,
        customerEmail,
        orderDate: new Date().toISOString(),
        status: 'Pending' as const,
        items,
        total: calculateTotal()
      };

      await dispatch(createOrder(newOrder));
      
      // Reset form
      setCustomerName('');
      setCustomerEmail('');
      setItems([]);
      setFormError(null);
    } catch (error) {
      setFormError('Failed to create order. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Add New Order</Typography>
      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                error={formError && !customerName.trim()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                error={formError && (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              {items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <FormControl sx={{ minWidth: 200 }} error={formError && item.productId === 0}>
                    <InputLabel>Product</InputLabel>
                    <Select
                      value={item.productId}
                      label="Product"
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    >
                      {products.map((product: Product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} - ${product.price} (Stock: {product.stockLevel})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    InputProps={{ inputProps: { min: 1 } }}
                    sx={{ width: 100 }}
                    error={formError && item.quantity <= 0}
                  />
                  <Typography sx={{ py: 2 }}>
                    Subtotal: ${item.subtotal.toFixed(2)}
                  </Typography>
                  <IconButton onClick={() => handleRemoveItem(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button variant="outlined" onClick={handleAddItem} sx={{ mt: 2 }}>
                Add Item
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" align="right">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!customerName || !customerEmail || items.length === 0}
              >
                Create Order
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddOrder;