import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

export default function DataGridBase(props) {
  const {
    rows = [],
    columns = [],
    rowCount = 0,
    paginationModel = { page: 0, pageSize: 10 },
    onPaginationModelChange = () => {},
    onRowClick = () => {},
    hideFooterPagination = false,
    sx = {},
  } = props;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';

  const handleChangePage = (event, newPage) => {
    onPaginationModelChange({
      page: newPage,
      pageSize: paginationModel.pageSize,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    onPaginationModelChange({
      page: 0,
      pageSize: parseInt(event.target.value, 10),
    });
  };

  // Mobile card view per section 4 requirement
  if (isMobile) {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {rows.map((row, idx) => (
          <Card
            key={row.id || row._id || idx}
            onClick={() => onRowClick({ row })}
            sx={{
              borderRadius: '14px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              cursor: onRowClick ? 'pointer' : 'default',
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {columns.map((col) => {
                if (col.field === 'id' || col.field === 'rowId') return null;
                return (
                  <Box
                    key={col.field}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.75,
                      borderBottom: `1px dashed ${theme.palette.divider}`,
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
                    >
                      {col.headerName || col.label}
                    </Typography>
                    <Box sx={{ maxWidth: '65%', textAlign: 'right' }}>
                      {col.renderCell ? col.renderCell({ row }) : row[col.field] ?? '-'}
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {!hideFooterPagination && (
          <TablePagination
            component="div"
            count={rowCount || rows.length}
            page={paginationModel.page || 0}
            onPageChange={handleChangePage}
            rowsPerPage={paginationModel.pageSize || 10}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              borderTop: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
            }}
          />
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ overflowX: 'auto', width: '100%' }}>
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        ...sx,
      }}
    >
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="medium">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  style={{ minWidth: col.minWidth || 120, width: col.width }}
                  sx={{
                    backgroundColor: isDark ? '#231613' : '#FDF7EE',
                    color: theme.palette.text.primary,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    letterSpacing: '0.02em',
                    borderBottom: `1.5px solid ${theme.palette.divider}`,
                    py: 1.75,
                  }}
                >
                  {col.headerName || col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                hover
                key={row.id || row._id || index}
                onClick={() => onRowClick({ row })}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(74, 33, 24, 0.02)',
                  },
                  '&:last-child td': {
                    borderBottom: 'none',
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.field}
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: '0.875rem',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      py: 1.5,
                    }}
                  >
                    {col.renderCell ? col.renderCell({ row }) : row[col.field] ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!hideFooterPagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rowCount || rows.length}
          rowsPerPage={paginationModel.pageSize || 10}
          page={paginationModel.page || 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
            },
          }}
        />
      )}
    </Paper>
    </Box>
  );
}
