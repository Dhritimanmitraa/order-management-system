import { Box, Grid, CardContent, Typography, LinearProgress, IconButton, Tooltip, useTheme } from '@mui/material';
import { 
  TrendingUp, 
  ShoppingCart, 
  People, 
  Inventory, 
  AttachMoney, 
  LocalShipping,
  Warning,
  MoreVert,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Order, Product } from '../types';
import AnimatedCard from '../components/AnimatedCard';
import AdvancedChart from '../components/AdvancedChart';
import AdvancedTable from '../components/AdvancedTable';
import { motion } from 'framer-motion';
import DashboardSkeleton from '../components/DashboardSkeleton';
import AdvancedAlerts from '../components/AdvancedAlerts';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  value: number;
}

const Dashboard = () => {
  const theme = useTheme();
  const { orders, loading } = useSelector((state: RootState) => state.orders);
  const { products } = useSelector((state: RootState) => state.inventory);
  const { customers } = useSelector((state: RootState) => state.customers);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = orders.filter((order: Order) => order.status === 'Pending').length;
  const lowStockProducts = products.filter((product: Product) => product.stockLevel <= product.reorderPoint).length;

  // Prepare chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const salesData: SalesData[] = last7Days.map(date => {
    const sales = orders
      .filter((order: Order) => order.orderDate.startsWith(date))
      .reduce((sum: number, order: Order) => sum + order.total, 0);
    return {
      date,
      sales,
      orders: orders.filter((order: Order) => order.orderDate.startsWith(date)).length,
      value: sales
    };
  });

  // Calculate growth rates
  const calculateGrowthRate = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowthRate(
    salesData[6].sales,
    salesData[5].sales
  );

  const ordersGrowth = calculateGrowthRate(
    salesData[6].orders,
    salesData[5].orders
  );

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    growth, 
    subtitle 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string; 
    growth?: number; 
    subtitle?: string;
  }) => (
    <AnimatedCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}15`, 
            borderRadius: 2, 
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
          {title}
        </Typography>
        {growth !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {growth >= 0 ? (
              <ArrowUpward color="success" fontSize="small" />
            ) : (
              <ArrowDownward color="error" fontSize="small" />
            )}
            <Typography 
              variant="body2" 
              color={growth >= 0 ? 'success.main' : 'error.main'}
            >
              {Math.abs(growth).toFixed(1)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </AnimatedCard>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const orderColumns = [
    { id: 'orderNumber', label: 'Order #', sortable: true, format: (value: any) => String(value) },
    { id: 'customerName', label: 'Customer', sortable: true, format: (value: any) => String(value) },
    { id: 'orderDate', label: 'Date', sortable: true, format: (value: string) => new Date(value).toLocaleDateString() },
    { 
      id: 'status', 
      label: 'Status', 
      sortable: true,
      format: (value: string) => {
        const statusBox = (
          <Box
            sx={{
              display: 'inline-block',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: 
                value === 'Delivered' ? `${theme.palette.success.main}15` :
                value === 'Processing' ? `${theme.palette.info.main}15` :
                value === 'Shipped' ? `${theme.palette.primary.main}15` :
                value === 'Cancelled' ? `${theme.palette.error.main}15` :
                `${theme.palette.warning.main}15`,
              color: 
                value === 'Delivered' ? theme.palette.success.main :
                value === 'Processing' ? theme.palette.info.main :
                value === 'Shipped' ? theme.palette.primary.main :
                value === 'Cancelled' ? theme.palette.error.main :
                theme.palette.warning.main,
            }}
          >
            {value}
          </Box>
        );
        return statusBox as unknown as string;
      }
    },
    { 
      id: 'total', 
      label: 'Total', 
      align: 'right' as const,
      sortable: true,
      format: (value: number) => `$${value.toFixed(2)}`
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Revenue"
                value={`$${totalRevenue.toLocaleString()}`}
                icon={<AttachMoney sx={{ color: theme.palette.primary.main }} />}
                color={theme.palette.primary.main}
                growth={revenueGrowth}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Orders"
                value={totalOrders}
                icon={<ShoppingCart sx={{ color: theme.palette.secondary.main }} />}
                color={theme.palette.secondary.main}
                growth={ordersGrowth}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Average Order Value"
                value={`$${averageOrderValue.toFixed(2)}`}
                icon={<TrendingUp sx={{ color: theme.palette.success.main }} />}
                color={theme.palette.success.main}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <motion.div variants={itemVariants}>
              <StatCard
                title="Total Customers"
                value={customers.length}
                icon={<People sx={{ color: theme.palette.info.main }} />}
                color={theme.palette.info.main}
              />
            </motion.div>
          </Grid>

          {/* Sales Chart */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <AdvancedChart
                title="Sales Overview"
                data={salesData}
                dataKey="sales"
                color={theme.palette.primary.main}
                height={400}
              />
            </motion.div>
          </Grid>

          {/* Alerts and Notifications */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              <AdvancedAlerts
                title="Alerts"
                alerts={[
                  {
                    id: 'pending-orders',
                    title: 'Pending Orders',
                    message: `${pendingOrders} orders are pending processing`,
                    type: 'warning',
                    value: pendingOrders,
                    total: totalOrders,
                    icon: <LocalShipping />,
                    action: {
                      label: 'View Orders',
                      onClick: () => console.log('View pending orders')
                    }
                  },
                  {
                    id: 'low-stock',
                    title: 'Low Stock Items',
                    message: `${lowStockProducts} products are running low on stock`,
                    type: 'error',
                    value: lowStockProducts,
                    total: products.length,
                    icon: <Warning />,
                    action: {
                      label: 'View Products',
                      onClick: () => console.log('View low stock products')
                    }
                  }
                ]}
                onRefresh={() => console.log('Refresh alerts')}
              />
            </motion.div>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12}>
            <motion.div variants={itemVariants}>
              <AdvancedTable
                columns={orderColumns}
                data={orders}
                defaultSort={{ column: 'orderDate', direction: 'desc' }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Dashboard;