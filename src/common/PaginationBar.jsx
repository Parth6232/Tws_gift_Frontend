import React from 'react';
import {
  Box,
  Pagination,
  PaginationItem,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';

/**
 * PaginationBar — reusable pagination component styled to TWS Gifts design system.
 *
 * Props:
 *  - page: current page number (1-indexed)
 *  - count: total pages count
 *  - total: total number of items
 *  - limit: items per page (default 12)
 *  - onChange: callback(newPage)
 *  - disabled: boolean (e.g. during isFetching)
 *  - sx: additional styles
 */
export default function PaginationBar({
  page = 1,
  count = 1,
  total = 0,
  limit = 12,
  onChange,
  disabled = false,
  sx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (count <= 1 && total <= limit) {
    return null;
  }

  const start = total > 0 ? (page - 1) * limit + 1 : 0;
  const end = total > 0 ? Math.min(page * limit, total) : 0;

  const handlePageChange = (event, value) => {
    if (value !== page && onChange) {
      onChange(value);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        mt: 6,
        mb: 2,
        width: '100%',
        ...sx,
      }}
    >
      <Pagination
        page={page}
        count={count}
        onChange={handlePageChange}
        disabled={disabled}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={1}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            sx={{
              borderRadius: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: item.selected ? 700 : 500,
              fontSize: '0.875rem',
              minWidth: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              transition: 'all 0.2s ease',
              border: `1px solid ${
                item.selected
                  ? theme.palette.primary.main
                  : isDark
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'rgba(74, 33, 24, 0.12)'
              }`,
              backgroundColor: item.selected
                ? `${theme.palette.primary.main} !important`
                : 'transparent',
              color: item.selected
                ? '#FFFFFF !important'
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: item.selected
                  ? theme.palette.primary.main
                  : isDark
                  ? 'rgba(242, 117, 143, 0.15)'
                  : 'rgba(217, 69, 107, 0.08)',
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-disabled': {
                opacity: 0.45,
              },
            }}
          />
        )}
      />

      {total > 0 && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          Showing <strong>{start}–{end}</strong> of <strong>{total}</strong> gifts
        </Typography>
      )}
    </Box>
  );
}
