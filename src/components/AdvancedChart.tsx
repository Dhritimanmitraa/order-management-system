import { Box, Card, CardContent, Typography, useTheme, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

interface ChartData {
  date: string;
  value: number;
  [key: string]: any;
}

interface AdvancedChartProps {
  title: string;
  data: ChartData[];
  dataKey: string;
  color?: string;
  height?: number;
  showLegend?: boolean;
}

const AdvancedChart = ({ 
  title, 
  data, 
  dataKey, 
  color,
  height = 300,
  showLegend = true 
}: AdvancedChartProps) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'bar' | 'area' | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const chartColor = color || theme.palette.primary.main;

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius
              }}
            />
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor}
              strokeWidth={2}
              dot={{ fill: chartColor, strokeWidth: 2 }}
              activeDot={{ r: 8, fill: chartColor }}
            />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius
              }}
            />
            {showLegend && <Legend />}
            <Bar 
              dataKey={dataKey} 
              fill={chartColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis 
              dataKey="date" 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              tick={{ fill: theme.palette.text.secondary }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.shape.borderRadius
              }}
            />
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={chartColor}
              fill={chartColor}
              fillOpacity={0.2}
            />
          </AreaChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">{title}</Typography>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  border: `1px solid ${theme.palette.divider}`,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark,
                    },
                  },
                },
              }}
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="area">Area</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedChart; 