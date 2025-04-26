import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../features/orders/ordersSlice';
import OrderDetails from './OrderDetails';
import { Order } from '../types/order';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  total: number;
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

const Orders = () => {
  const { orders, loading, error } = useSelector((state: any) => state.orders);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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

  const handleRowClick = (params: any) => {
    setSelectedOrder(params.row.id);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
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

  const columns: GridColDef[] = [
    { field: 'orderNumber', headerName: 'Order Number', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 200 },
    { field: 'orderDate', headerName: 'Order Date', width: 150 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'trackingNumber',
      headerName: 'Tracking #',
      width: 150,
      valueGetter: (params) => params.row.trackingNumber || 'N/A',
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    }
  ];

  const handleAddOrder = () => {
    // Implement add order functionality
    console.log('Add order clicked');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddOrder}
        >
          Add Order
        </Button>
      </Box>
      <DataGrid
        rows={orders}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={handleRowClick}
        autoHeight
      />
      {selectedOrder && (
        <OrderDetails
          orderId={selectedOrder}
          open={true}
          onClose={handleCloseDetails}
        />
      )}
    </Box>
  );
};

export default Orders;