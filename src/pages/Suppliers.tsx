import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Rating } from '@mui/material';

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  activeOrders: number;
  totalOrders: number;
  lastDelivery: string;
  onTimeDeliveryRate: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Tech Solutions Inc',
    contactPerson: 'John Smith',
    email: 'john.smith@techsolutions.com',
    phone: '(555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA',
    rating: 4.5,
    activeOrders: 3,
    totalOrders: 150,
    lastDelivery: '2024-01-15',
    onTimeDeliveryRate: 95
  },
  {
    id: 2,
    name: 'Global Electronics',
    contactPerson: 'Sarah Johnson',
    email: 'sarah.j@globalelectronics.com',
    phone: '(555) 987-6543',
    address: '456 Electronics Ave, New York, NY',
    rating: 4.0,
    activeOrders: 2,
    totalOrders: 98,
    lastDelivery: '2024-01-12',
    onTimeDeliveryRate: 88
  }
];

const Suppliers = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Supplier Management</Typography>
        <Button variant="contained" color="primary">
          Add New Supplier
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Suppliers</Typography>
              <Typography variant="h4">{mockSuppliers.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Orders</Typography>
              <Typography variant="h4">
                {mockSuppliers.reduce((total, supplier) => total + supplier.activeOrders, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Avg. Delivery Rate</Typography>
              <Typography variant="h4">
                {(mockSuppliers.reduce((total, supplier) => total + supplier.onTimeDeliveryRate, 0) / mockSuppliers.length).toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Active Orders</TableCell>
              <TableCell align="right">Total Orders</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell align="right">On-Time Delivery</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell align="right">{supplier.activeOrders}</TableCell>
                <TableCell align="right">{supplier.totalOrders}</TableCell>
                <TableCell align="center">
                  <Rating value={supplier.rating} precision={0.5} readOnly />
                </TableCell>
                <TableCell align="right">{supplier.onTimeDeliveryRate}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Suppliers;