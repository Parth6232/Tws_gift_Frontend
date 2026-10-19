import React, { useState, useEffect, useRef } from 'react';
import { Box, Tooltip, Typography, IconButton, useTheme } from '@mui/material';
import DataRenderer from './DataRenderer';
import DataGridBase from './DataGridBase';
import Text from './Text';
import Button from './Button';
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddIcon from '@mui/icons-material/Add';
import Textfield from './Textfield';

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
  clientSidePagination = false,
}) {
  const theme = useTheme();

  const [searchText, setSearchText] = useState(tablePagination?.search || '');
  const lastEmittedRef = useRef(tablePagination?.search || '');

  // Keep searchText in sync if tablePagination.search changes externally
  useEffect(() => {
    const externalSearch = tablePagination?.search ?? '';
    if (externalSearch !== lastEmittedRef.current) {
      lastEmittedRef.current = externalSearch;
      setSearchText(externalSearch);
    }
  }, [tablePagination?.search]);

  // Debounced search update: 350ms
  useEffect(() => {
    const trimmed = searchText.trim();
    if ((tablePagination?.search ?? '') === trimmed) return;

    const timer = setTimeout(() => {
      lastEmittedRef.current = trimmed;
      setTablePagination((prev) => {
        if ((prev?.search ?? '') === trimmed) return prev;
        return {
          ...prev,
          search: trimmed,
          page: 0,
        };
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleClearSearch = () => {
    setSearchText('');
    lastEmittedRef.current = '';
    setTablePagination((prev) => ({
      ...prev,
      search: '',
      page: 0,
    }));
  };

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

  const pageSize = tablePagination?.pageSize || 10;
  const page = tablePagination?.page || 0;
  const totalCount = totalData ?? (Array.isArray(data) ? data.length : 0);

  // If the current page becomes out of range (e.g. after filtering), reset page to 0.
  useEffect(() => {
    if (clientSidePagination) {
      const dataLen = Array.isArray(data) ? data.length : 0;
      if (page > 0 && page * pageSize >= dataLen) {
        setTablePagination((prev) => ({ ...prev, page: 0 }));
      }
    }
  }, [clientSidePagination, data, page, pageSize, setTablePagination]);

  const safePage =
    clientSidePagination && page > 0 && page * pageSize >= (Array.isArray(data) ? data.length : 0)
      ? 0
      : page;

  const displayData =
    clientSidePagination && Array.isArray(data)
      ? data.slice(safePage * pageSize, safePage * pageSize + pageSize)
      : data;

  const rowsData = Array.isArray(displayData)
    ? displayData.map((item, index) => {
        return {
          ...item,
          rowId: safePage * pageSize + index + 1,
          id: item?._id || item?.id || safePage * pageSize + index + 1,
        };
      })
    : [];

  const handleOnChangeTablePagination = ({ page: newPage, pageSize: newPageSize }) => {
    setTablePagination((prev) => ({
      ...prev,
      page: newPage,
      pageSize: newPageSize,
    }));
  };

  const emptyStateMessage =
    searchText.trim() && rowsData.length === 0
      ? `No results for "${searchText.trim()}"`
      : message;

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
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              startIcon={<SearchIcon sx={{ color: theme.palette.text.secondary }} />}
              endIcon={
                searchText ? (
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                    sx={{ p: 0.5, color: theme.palette.text.secondary }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                ) : null
              }
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
        message={emptyStateMessage}
        dataComponent={
          <DataGridBase
            rows={rowsData}
            columns={columns}
            rowCount={totalCount}
            paginationModel={{
              page: safePage,
              pageSize,
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
