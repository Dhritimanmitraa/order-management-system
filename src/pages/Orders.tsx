import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  status: string;
  total: number;
}

const Orders = () => {
  const [orders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      orderDate: '2024-01-04',
      status: 'Pending',
      total: 150.00,
    },
    {
      id: 2,
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      orderDate: '2024-01-04',
      status: 'Completed',
      total: 250.00,
    },
  ]);

  const columns: GridColDef[] = [
    { field: 'orderNumber', headerName: 'Order Number', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 200 },
    { field: 'orderDate', headerName: 'Order Date', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
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
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
      />
    </Box>
  );
};

export default Orders;