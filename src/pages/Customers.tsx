import { Box, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add as AddIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { Customer, addCustomer, deleteCustomer } from '../features/customers/customersSlice';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

const Customers = () => {
  const dispatch = useDispatch();
  const customers = useSelector((state: RootState) => state.customers.customers);


  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'totalOrders', headerName: 'Total Orders', width: 120 },
    {
      field: 'totalSpent',
      headerName: 'Total Spent',
      width: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`,
    },
  ];

  const handleAddCustomer = () => {
    const newCustomer = {
      name: 'New Customer',
      email: 'new.customer@example.com',
      phone: '(555) 000-0000',
      totalOrders: 0,
      totalSpent: 0,
    };
    dispatch(addCustomer(newCustomer));
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCustomer}
        >
          Add Customer
        </Button>
      </Box>
      <DataGrid
        rows={customers}
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

export default Customers;