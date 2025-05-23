import { Box, Typography, Grid, Card, CardContent, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Warning as WarningIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Product } from '../types';
import { deleteProduct } from '../features/inventory/inventorySlice';
import { useEffect } from 'react';

export default function Inventory() {
    const dispatch = useDispatch();
    const { products = [], loading, error } = useSelector((state: RootState) => state.inventory);

    useEffect(() => {
        // Add any initialization logic here
    }, [dispatch]);

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

    const lowStockProducts = products?.filter(product => product.stockLevel <= product.reorderPoint) || [];

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(id.toString()));
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Inventory Management</Typography>
                <Button variant="contained" color="primary">
                    Add New Product
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Total Products</Typography>
                            <Typography variant="h4">{products?.length || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Low Stock Items</Typography>
                            <Typography variant="h4" color="error">{lowStockProducts.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Total Stock Value</Typography>
                            <Typography variant="h4">
                                ${(products?.reduce((total, product) => total + (product.price * product.stockLevel), 0) || 0).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {lowStockProducts.length > 0 && (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WarningIcon sx={{ mr: 1 }} />
                        {lowStockProducts.length} products are running low on stock
                    </Box>
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>SKU</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Stock Level</TableCell>
                            <TableCell align="right">Reorder Point</TableCell>
                            <TableCell>Last Restocked</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products?.map((product: Product) => (
                            <TableRow
                                key={product.id}
                                sx={{
                                    backgroundColor: product.stockLevel <= product.reorderPoint ? 'rgba(255, 0, 0, 0.1)' : 'inherit'
                                }}
                            >
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                                <TableCell align="right">{product.stockLevel}</TableCell>
                                <TableCell align="right">{product.reorderPoint}</TableCell>
                                <TableCell>{product.lastRestocked ? new Date(product.lastRestocked).toLocaleDateString() : "N/A"}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        size="small" 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
