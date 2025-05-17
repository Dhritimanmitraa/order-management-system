import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  useTheme,
  Paper
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SortConfig {
  column: string;
  direction: 'asc' | 'desc';
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
  sortable?: boolean;
  filterable?: boolean;
}

interface AdvancedTableProps {
  columns: Column[];
  data: any[];
  defaultSort?: SortConfig;
  rowsPerPageOptions?: number[];
  onRowClick?: (row: any) => void;
}

const AdvancedTable = ({
  columns,
  data,
  defaultSort,
  rowsPerPageOptions = [5, 10, 25, 50],
  onRowClick
}: AdvancedTableProps) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort || { column: '', direction: 'asc' });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (columnId: string) => {
    setSortConfig({
      column: columnId,
      direction: sortConfig.column === columnId && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(0);
  };

  const filteredData = data.filter(row => {
    return Object.entries(filters).every(([columnId, value]) => {
      if (!value) return true;
      const cellValue = row[columnId]?.toString().toLowerCase() || '';
      return cellValue.includes(value.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.column) return 0;
    
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Toggle Filters">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterList />
            </IconButton>
          </Tooltip>
          {Object.keys(filters).length > 0 && (
            <Tooltip title="Clear Filters">
              <IconButton onClick={clearFilters}>
                <Clear />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {columns.filter(col => col.filterable !== false).map(column => (
                <TextField
                  key={column.id}
                  size="small"
                  label={`Filter ${column.label}`}
                  value={filters[column.id] || ''}
                  onChange={(e) => handleFilterChange(column.id, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortConfig.column === column.id}
                      direction={sortConfig.column === column.id ? sortConfig.direction : undefined}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdvancedTable; 