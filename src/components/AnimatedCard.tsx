import { Card, CardContent, Box, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  hover?: boolean;
}

const AnimatedCard = ({ children, sx, onClick, hover = true }: AnimatedCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: hover ? '0 8px 16px rgba(0,0,0,0.1)' : undefined,
          },
          ...sx,
        }}
        onClick={onClick}
      >
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard; 