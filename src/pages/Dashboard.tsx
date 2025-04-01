import { Grid, Paper, Typography, Box } from '@mui/material';
import { ShoppingCart, AttachMoney, People, TrendingUp } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      bgcolor: color,
      color: 'white',
    }}
  >
    <Box sx={{ p: 1 }}>{icon}</Box>
    <Box sx={{ ml: 2 }}>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="body2">{title}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Orders',
      value: '150',
      icon: <ShoppingCart />,
      color: '#1976d2',
    },
    {
      title: 'Revenue',
      value: '$15,000',
      icon: <AttachMoney />,
      color: '#2e7d32',
    },
    {
      title: 'Customers',
      value: '120',
      icon: <People />,
      color: '#ed6c02',
    },
    {
      title: 'Growth',
      value: '+15%',
      icon: <TrendingUp />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;