import { Box, Grid, Card, CardContent, Skeleton, useTheme } from '@mui/material';

const DashboardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Skeleton variant="text" width={200} height={40} sx={{ mb: 4 }} />
      
      <Grid container spacing={3}>
        {/* Stat Cards */}
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} md={6} lg={3} key={item}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="circular" width={24} height={24} />
                </Box>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" />
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={300} />
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={100} height={30} sx={{ mb: 3 }} />
              <Box sx={{ mb: 3 }}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={8} />
              </Box>
              <Box>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
                <Skeleton variant="rectangular" height={8} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width={150} height={30} sx={{ mb: 3 }} />
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Order #', 'Customer', 'Date', 'Status', 'Total'].map((header) => (
                        <th key={header} style={{ textAlign: 'left', padding: '8px' }}>
                          <Skeleton variant="text" width={100} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((row) => (
                      <tr key={row}>
                        {[1, 2, 3, 4, 5].map((cell) => (
                          <td key={cell} style={{ padding: '8px' }}>
                            <Skeleton variant="text" width={cell === 4 ? 80 : 120} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton; 