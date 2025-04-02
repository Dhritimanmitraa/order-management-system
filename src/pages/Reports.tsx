import { Box, Typography, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';


import { Download as DownloadIcon, DateRange } from '@mui/icons-material';
import { useState } from 'react';

interface ReportMetrics {
  totalSales: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    revenue: number;
    quantity: number;
  }>;
  inventoryValue: number;
  lowStockItems: number;
  supplierPerformance: number;
}

const mockMetrics: ReportMetrics = {
  totalSales: 125000,
  averageOrderValue: 250,
  topProducts: [
    { name: 'Product A', revenue: 25000, quantity: 100 },
    { name: 'Product B', revenue: 20000, quantity: 80 },
    { name: 'Product C', revenue: 15000, quantity: 60 }
  ],
  inventoryValue: 500000,
  lowStockItems: 5,
  supplierPerformance: 92
};

const Reports = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [reportType, setReportType] = useState('sales');

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              label="Report Type"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="sales">Sales Report</MenuItem>
              <MenuItem value="inventory">Inventory Report</MenuItem>
              <MenuItem value="suppliers">Supplier Report</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => console.log('Export report')}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Total Sales</Typography>
              <Typography variant="h4">${mockMetrics.totalSales.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Average Order Value</Typography>
              <Typography variant="h4">${mockMetrics.averageOrderValue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Inventory Value</Typography>
              <Typography variant="h4">${mockMetrics.inventoryValue.toLocaleString()}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Revenue</TableCell>
              <TableCell align="right">Quantity Sold</TableCell>
              <TableCell align="right">Average Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockMetrics.topProducts.map((product) => (
              <TableRow key={product.name}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">${product.revenue.toLocaleString()}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">
                  ${(product.revenue / product.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<DateRange />}
          onClick={() => console.log('Custom date range')}
        >
          Custom Date Range
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => console.log('Download CSV')}
        >
          Download CSV
        </Button>
      </Box>
    </Box>
  );
};

export default Reports;