import { Box, Typography, Grid, Card, CardContent } from '@mui/material'

const Products = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">150</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Products