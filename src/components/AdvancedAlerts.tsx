import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Tooltip,
  useTheme,
  Collapse,
  Alert,
  AlertTitle,
  Button
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Refresh
} from '@mui/icons-material';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info' | 'success';
  value?: number;
  total?: number;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AdvancedAlertsProps {
  title: string;
  alerts: AlertItem[];
  onRefresh?: () => void;
  collapsible?: boolean;
}

const AdvancedAlerts = ({
  title,
  alerts,
  onRefresh,
  collapsible = true
}: AdvancedAlertsProps) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  const getAlertColor = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return theme.palette.warning;
      case 'error':
        return theme.palette.error;
      case 'info':
        return theme.palette.info;
      case 'success':
        return theme.palette.success;
    }
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return <Warning />;
      case 'error':
        return <Error />;
      case 'info':
        return <Info />;
      case 'success':
        return <CheckCircle />;
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onRefresh && (
                <Tooltip title="Refresh">
                  <IconButton onClick={onRefresh} size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
              )}
              {collapsible && (
                <Tooltip title={expanded ? 'Collapse' : 'Expand'}>
                  <IconButton onClick={() => setExpanded(!expanded)} size="small">
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Collapse in={expanded}>
            <AnimatePresence>
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Alert
                    severity={alert.type}
                    icon={alert.icon || getAlertIcon(alert.type)}
                    sx={{ mb: 2 }}
                    action={
                      alert.action && (
                        <Button
                          color="inherit"
                          size="small"
                          onClick={alert.action.onClick}
                        >
                          {alert.action.label}
                        </Button>
                      )
                    }
                  >
                    <AlertTitle>{alert.title}</AlertTitle>
                    {alert.message}
                    {alert.value !== undefined && alert.total !== undefined && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="text.secondary">
                            {alert.value} of {alert.total}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round((alert.value / alert.total) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(alert.value / alert.total) * 100}
                          color={alert.type}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: `${getAlertColor(alert.type).main}15`,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Alert>
                </motion.div>
              ))}
            </AnimatePresence>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvancedAlerts; 