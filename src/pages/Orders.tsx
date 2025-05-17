





import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Menu,
  Divider,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OrderDetails from './OrderDetails';
import { getOrders, bulkUpdateOrders, exportOrders } from '../features/orders/ordersSlice';
import { RootState } from '../store';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Order, OrderStatus, OrderSummary } from '../types/order';
import { format } from 'date-fns';

const Orders = () => {
  const { orders, loading, error, summary } = useSelector((state: RootState) => state.orders);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: null,
    endDate: null,
    search: '',
  });

  useEffect(() => {
    dispatch(getOrders(filters));
  }, [dispatch, filters]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setActionsAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleActionsClose = () => {
    setActionsAnchorEl(null);
  };

  const handleExport = (format: 'csv' | 'excel') => {
    dispatch(exportOrders({ format, ...filters }));
    handleActionsClose();
  };

  const handleBulkStatusUpdate = (status: OrderStatus) => {
    if (selectedRows.length > 0) {
      dispatch(bulkUpdateOrders(selectedRows, { status }));
    }
    handleActionsClose();
  };

  const handlePrint = () => {
    window.print();
    handleActionsClose();
  };

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'error',
      refunded: 'error'
    };
    return colors[status] || 'default';
  };

  const handleRowClick = (params: any) => {
    setSelectedOrder(params.row.id);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const columns: GridColDef[] = [
    { field: 'orderNumber', headerName: 'Order Number', width: 150 },
    { field: 'customerName', headerName: 'Customer Name', width: 200 },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      width: 150,
      valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={params.value === 'paid' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: 'shipping',
      headerName: 'Tracking #',
      width: 150,
      valueGetter: (params) => params.row.shipping?.trackingNumber || 'N/A',
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          ${params.value.toFixed(2)}
        </Typography>
      ),
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
                <Typography variant="h4">{summary.totalOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                <Typography variant="h4">${summary.totalRevenue.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Avg. Order Value</Typography>
                <Typography variant="h4">${summary.averageOrderValue.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>Pending Orders</Typography>
                <Typography variant="h4">{summary.ordersByStatus.pending || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Typography variant="h4">Orders</Typography>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            sx={{ width: 250 }}
          />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<MoreVertIcon />}
            onClick={handleActionsClick}
            disabled={selectedRows.length === 0}
          >
            Actions
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSelectedOrder('new')}
          >
            Add Order
          </Button>
        </Stack>
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
        PaperProps={{ sx: { width: 300, p: 2 } }}
      >
        <Stack spacing={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="processing">Processing</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Stack>
      </Menu>

      {/* Actions Menu */}
      <Menu
        anchorEl={actionsAnchorEl}
        open={Boolean(actionsAnchorEl)}
        onClose={handleActionsClose}
      >
        <MenuItem onClick={() => handleBulkStatusUpdate('processing')}>
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusUpdate('shipped')}>
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => handleBulkStatusUpdate('delivered')}>
          Mark as Delivered
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </MenuItem>
        <MenuItem onClick={handlePrint}>
          Print Orders
        </MenuItem>
      </Menu>

      {/* Data Grid */}
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        checkboxSelection
        onRowClick={handleRowClick}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection as string[]);
        }}
        components={{
          Toolbar: GridToolbar,
        }}
        autoHeight
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
          },
        }}
      />

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetails
          orderId={selectedOrder}
          open={true}
          onClose={handleCloseDetails}
        />
      )}
    </Box>
  );
};

export default Orders;