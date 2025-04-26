import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
  Product,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../features/inventory/inventorySlice";

function Products() {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stockLevel: '',
    quantity: '',
    lastRestocked: '',
    category: '',
    supplier: '',
    reorderPoint: 0
  });

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.inventory);
  const { loading, error } = useSelector((state: RootState) => state.inventory);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        sku: selectedProduct.sku,
        price: selectedProduct.price.toString(),
        stockLevel: selectedProduct.stockLevel.toString(),
        quantity: selectedProduct.quantity.toString(),
        lastRestocked: selectedProduct.lastRestocked,
        category: selectedProduct.category,
        supplier: selectedProduct.supplier,
        reorderPoint: selectedProduct.reorderPoint
      });
    }
  }, [selectedProduct]);

  const handleClickOpen = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        sku: '',
        price: '',
        stockLevel: '',
        quantity: '',
        lastRestocked: '',
        category: '',
        supplier: '',
        reorderPoint: 0
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      sku: formData.sku.toString(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      stockLevel: parseInt(formData.stockLevel),
      category: formData.category,
      supplier: formData.supplier,
      reorderPoint: formData.reorderPoint,
      lastRestocked: formData.lastRestocked,
    };

    if (selectedProduct) {
      await dispatch(updateProduct({ id: selectedProduct.id.toString(), productData }));
    } else {
      await dispatch(addProduct(productData));
    }

    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id.toString() as string));
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Product
        </Button>
      </Box>

      <Grid container spacing={3}>
        {products.map((product:Product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Typography variant="h6" color="primary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Stock: {product.stockLevel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {product.quantity}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last Restocked: {product.lastRestocked}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleClickOpen(product)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small" color="error"
                  onClick={() => handleDelete(product.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="sku"
            label="SKU"
            fullWidth
            variant="outlined"
            value={formData.sku}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="stockLevel"
            label="Stock Level"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.stockLevel}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="quantity"
            label="quantity"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.quantity}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="lastRestocked"
            label="Last restocked"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.lastRestocked}
            onChange={handleInputChange}
          />


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
