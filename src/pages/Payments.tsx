import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';

interface Payment {
  id: number;
  transactionId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: string;
  date: string;
}

const Payments = () => {
  const [payments] = useState<Payment[]>([
    {
      id: 1,
      transactionId: 'TRX-001',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      amount: 150.00,
      status: 'Completed',
      date: '2024-01-04',
    },
    {
      id: 2,
      transactionId: 'TRX-002',
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      amount: 250.00,
      status: 'Pending',
      date: '2024-01-04',
    },
  ]);

  const columns: GridColDef[] = [
    { field: 'transactionId', headerName: 'Transaction ID', width: 150 },
    { field: 'orderNumber', headerName: 'Order Number', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 200 },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'date', headerName: 'Date', width: 150 },
  ];

  const handleAddPayment = () => {
    // Implement add payment functionality
    console.log('Add payment clicked');
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Payments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPayment}
        >
          Add Payment
        </Button>
      </Box>
      <DataGrid
        rows={payments}
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

export default Payments;