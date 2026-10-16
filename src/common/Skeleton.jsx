import React from 'react';
import { Box, Skeleton as MuiSkeleton, useTheme } from '@mui/material';

export const ProductCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderRadius: '20px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <MuiSkeleton
        variant="rounded"
        width="100%"
        height={240}
        sx={{ borderRadius: '14px', mb: 2 }}
      />
      <MuiSkeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
      <MuiSkeleton variant="text" width="85%" height={28} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto', pt: 1 }}>
        <MuiSkeleton variant="text" width="45%" height={32} />
        <MuiSkeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '10px' }} />
      </Box>
    </Box>
  );
};

export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 2.5, md: 3 },
      }}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </Box>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <MuiSkeleton variant="rounded" width="100%" height={46} sx={{ borderRadius: '12px' }} />
      {Array.from({ length: rows }).map((_, idx) => (
        <MuiSkeleton key={idx} variant="rounded" width="100%" height={56} sx={{ borderRadius: '8px' }} />
      ))}
    </Box>
  );
};

export const DetailSkeleton = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: { xs: 4, md: 6 },
        py: 4,
      }}
    >
      <MuiSkeleton variant="rounded" width="100%" height={480} sx={{ borderRadius: '20px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <MuiSkeleton variant="text" width="30%" height={24} />
        <MuiSkeleton variant="text" width="90%" height={48} />
        <MuiSkeleton variant="text" width="40%" height={38} />
        <MuiSkeleton variant="rounded" width="100%" height={100} sx={{ borderRadius: '12px' }} />
        <MuiSkeleton variant="rounded" width="100%" height={52} sx={{ borderRadius: '12px', mt: 2 }} />
      </Box>
    </Box>
  );
};

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  TableSkeleton,
  DetailSkeleton,
};
