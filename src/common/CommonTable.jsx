import React from 'react';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import DataRenderer from './DataRenderer';
import DataGridBase from './DataGridBase';
import Text from './Text';
import Button from './Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Textfield from './Textfield';
import { debounce } from '../utils/helper';

export default function CommonTable({
  title,
  isLoading = false,
  isCalled = true,
  data = [],
  message = 'No data found',
  totalData = 0,
  columnsx = {},
  tablePagination = { page: 0, pageSize: 10, search: '' },
  setTablePagination = () => {},
  columnsConfig = [],
  onRowClick,
  handleAddClick = () => {},
  addButton,
  search = true,
}) {
  const theme = useTheme();

  const columns = columnsConfig.map(
    ({ label, field, component, minWidth = 140, sortable = false, renderHeader }) => ({
      field,
      minWidth,
      sortable,
      headerName: label,
      ...(renderHeader ? { renderHeader } : {}),
      renderCell: ({ row }) => {
        return component ? (
          component(row)
        ) : (
          <Tooltip title={row?.[field] ?? '-'}>
            <Typography
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
                color: theme.palette.text.primary,
              }}
            >
              {row?.[field] ?? '-'}
            </Typography>
          </Tooltip>
        );
      },
    })
  );

  const rowsData = Array.isArray(data)
    ? data.map((item, index) => {
        const pageSize = tablePagination?.pageSize || 10;
        const currentPage = tablePagination?.page || 0;
        return {
          ...item,
          rowId: currentPage * pageSize + index + 1,
          id: item?._id || item?.id || currentPage * pageSize + index + 1,
        };
      })
    : [];

  const handleOnChangeTablePagination = ({ page, pageSize }) => {
    setTablePagination((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
  };

  const debouncedSearch = debounce((e) => {
    setTablePagination((prev) => ({
      ...prev,
      search: e.target.value,
      page: 0,
    }));
  }, 300);

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 2.5,
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {title && <Text type="heading">{title}</Text>}

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {search && (
            <Textfield
              sx={{
                height: 42,
                width: { xs: '100%', sm: 260 },
              }}
              placeholder="Search..."
              startIcon={<SearchIcon sx={{ color: theme.palette.text.secondary }} />}
              onChange={debouncedSearch}
            />
          )}

          {addButton && (
            <Button
              icon={<AddIcon sx={{ color: '#fff' }} />}
              sx={{ height: 42, minWidth: { xs: '100%', sm: 'auto' } }}
              variant="contained"
              onClick={handleAddClick}
            >
              {addButton}
            </Button>
          )}
        </Box>
      </Box>

      <DataRenderer
        isLoading={isLoading}
        isCalled={isCalled}
        hasData={!!rowsData.length}
        message={message}
        dataComponent={
          <DataGridBase
            rows={rowsData}
            columns={columns}
            rowCount={totalData ?? data?.length ?? 0}
            paginationModel={{
              page: tablePagination?.page || 0,
              pageSize: tablePagination?.pageSize || 10,
            }}
            onPaginationModelChange={handleOnChangeTablePagination}
            onRowClick={onRowClick}
            sx={columnsx}
          />
        }
      />
    </Box>
  );
}
