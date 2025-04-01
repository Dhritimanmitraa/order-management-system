import { Box, Card, CardContent, Grid, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { setTimeRange } from '../features/analytics/analyticsSlice';

const Analytics = () => {
  const dispatch = useDispatch();
  const { salesMetrics, inventoryMetrics, customerMetrics, timeRange } = useSelector(
    (state: any) => state.analytics
  );

  const handleTimeRangeChange = (event: any) => {
    dispatch(setTimeRange(event.target.value));
  };

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const topProducts = [
    { name: 'Product A', sales: 3500 },
    { name: 'Product B', sales: 3000 },
    { name: 'Product C', sales: 2500 },
    { name: 'Product D', sales: 2000 },
    { name: 'Product E', sales: 1500 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Sales Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Overview</Typography>
              <LineChart width={500} height={300} data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Selling Products */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
              <BarChart width={500} height={300} data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Metrics */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Sales</Typography>
                  <Typography variant="h4">${salesMetrics.totalSales.toFixed(2)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
                  <Typography variant="h4">{salesMetrics.orderCount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Low Stock Items</Typography>
                  <Typography variant="h4">{inventoryMetrics.lowStockItems.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>New Customers</Typography>
                  <Typography variant="h4">{customerMetrics.newCustomers}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;