import { useState } from 'react';


import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Card, CardContent, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ordersSlice from '../features/orders/ordersSlice';
import  {updateProduct, Product} from '../features/inventory/inventorySlice';
import type { Product } from '../features/inventory/inventorySlice';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const AddOrder = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: any) => state.inventory.products);

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

  const handleSubmit = () => {
    const newOrder = {
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      customerEmail,
      orderDate: new Date().toISOString(),
      status: 'Pending' as const,
      items,
      total: calculateTotal(),
      lastUpdated: new Date().toISOString()
    };

    dispatch(ordersSlice.actions.addOrder(newOrder));

    // Update inventory stock levels
    items.forEach(item => {
      dispatch(updateProduct({
        id: item.productId.toString(),
        productData: {quantity: -item.quantity} // Decrease stock
      }));
    })

    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setItems([]);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Add New Order</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Customer Information */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
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
              />
            </Grid>

            {/* Order Items */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Order Items</Typography>
              {items.map((item, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <FormControl sx={{ minWidth: 200 }}>
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

            {/* Order Total */}
            <Grid item xs={12}>
              <Typography variant="h6" align="right">
                Total: ${calculateTotal().toFixed(2)}
              </Typography>
            </Grid>

            {/* Submit Button */}
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