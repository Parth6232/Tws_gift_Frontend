import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  MenuItem,
  Select,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CommonTable from '../../common/CommonTable';
import ConfirmDialog from '../../common/ConfirmDialog';
import Button from '../../common/Button';
import { productManagementApiAction } from './productManagementApiSlice';
import { commonApiAction } from '../../store/redux/slices/commonApiSlice';
import { formatCurrency } from '../../utils/helper';
import { formatDateTime } from '../../utils/DateTimeFormat';
import { optimizeImage } from '../../utils/imageUrl';

export default function ProductListContainer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  const user = useSelector((state) => state.toast?.userProfile);
  const isAdmin = user?.role === 'admin';

  const { data: products = [], isLoading, isFetching } =
    productManagementApiAction.useGetMyProductsQuery();

  const { data: categories = [] } = commonApiAction.useGetCategoriesQuery();

  const [deleteMutation, { isLoading: isDeleting }] =
    productManagementApiAction.useDeleteProductMutation();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [tablePagination, setTablePagination] = useState({
    page: 0,
    pageSize: 10,
    search: '',
  });

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete?._id) return;
    try {
      await deleteMutation(productToDelete._id).unwrap();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch {
      // error handled in interceptor
    }
  };

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Filter products by search (multi-word match) and category
  const searchWords = (tablePagination.search || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory
      ? prod.category?._id === selectedCategory || prod.category?.slug === selectedCategory
      : true;

    if (!matchesCategory) return false;

    if (!searchWords.length) return true;

    const targetText = `${prod.title || ''} ${prod.slug || ''} ${prod.category?.name || ''} ${(prod.tags || []).join(' ')}`;

    return searchWords.every((word) => {
      const rx = new RegExp('(^|[^a-zA-Z0-9])' + escapeRegex(word), 'i');
      return rx.test(targetText);
    });
  });

  const columnsConfig = [
    {
      label: 'Photo',
      field: 'image',
      minWidth: 80,
      component: (row) => (
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: isDark ? '#231613' : '#FDF7EE',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <img
            src={optimizeImage(row.images?.[0]?.url, 100)}
            alt={row.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ),
    },
    {
      label: 'Title',
      field: 'title',
      minWidth: 200,
      component: (row) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            /{row.slug}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Category',
      field: 'category',
      minWidth: 140,
      component: (row) => (
        <Chip
          label={row.category?.name || 'General'}
          size="small"
          sx={{ fontSize: '0.75rem', fontWeight: 500 }}
        />
      ),
    },
    {
      label: 'Price',
      field: 'price',
      minWidth: 110,
      component: (row) => (
        <Typography sx={{ fontFamily: '"Fraunces", serif', fontWeight: 700, color: theme.palette.primary.main }}>
          {formatCurrency(row.price)}
        </Typography>
      ),
    },
    {
      label: 'Stock',
      field: 'stock',
      minWidth: 90,
      component: (row) => (
        <Chip
          label={row.stock || 0}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: '0.75rem',
            backgroundColor: row.stock === 0 ? 'rgba(211, 47, 47, 0.15)' : undefined,
            color: row.stock === 0 ? '#D32F2F' : undefined,
          }}
        />
      ),
    },
    {
      label: 'Status',
      field: 'isActive',
      minWidth: 100,
      component: (row) => (
        <Chip
          label={row.isActive ? 'Active' : 'Draft'}
          size="small"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: row.isActive ? 'rgba(46, 125, 50, 0.15)' : 'rgba(0,0,0,0.08)',
            color: row.isActive ? '#2E7D32' : theme.palette.text.secondary,
          }}
        />
      ),
    },
    ...(isAdmin
      ? [
          {
            label: 'Added By',
            field: 'createdBy',
            minWidth: 130,
            component: (row) => (
              <Typography variant="body2" color="text.secondary">
                {row.createdBy?.name || 'Admin'}
              </Typography>
            ),
          },
        ]
      : []),
    {
      label: 'Created Date',
      field: 'createdAt',
      minWidth: 150,
      component: (row) => (
        <Typography variant="caption" color="text.secondary">
          {formatDateTime(row.createdAt)}
        </Typography>
      ),
    },
    {
      label: 'Actions',
      field: 'actions',
      minWidth: 100,
      component: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit Product">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/products/edit/${row._id}`, { state: { product: row } });
              }}
              sx={{ color: theme.palette.text.secondary, '&:hover': { color: theme.palette.primary.main } }}
            >
              <EditRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Product">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick(row);
              }}
              sx={{ color: theme.palette.text.secondary, '&:hover': { color: '#D32F2F' } }}
            >
              <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Fraunces", serif',
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            {isAdmin ? 'Product Management' : 'My Products'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isAdmin
              ? 'View, edit, and organize all personalized gifts across TWS Gifts.'
              : 'Add and manage personalized gifts created by you.'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
            Showing {filteredProducts.length} of {products.length} products
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
          {/* Category Filter Dropdown */}
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setTablePagination((prev) => ({ ...prev, page: 0 }));
            }}
            displayEmpty
            size="small"
            sx={{
              borderRadius: '10px',
              fontSize: '0.8125rem',
              height: 40,
              minWidth: 160,
              width: { xs: '100%', sm: 'auto' },
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c._id || c.slug} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            component={Link}
            to="/admin/products/new"
            variant="contained"
            icon={<AddRoundedIcon sx={{ color: '#fff' }} />}
            sx={{ height: 40, width: { xs: '100%', sm: 'auto' } }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* CommonTable */}
      <CommonTable
        isLoading={isLoading || isFetching}
        data={filteredProducts}
        totalData={filteredProducts.length}
        columnsConfig={columnsConfig}
        tablePagination={tablePagination}
        setTablePagination={setTablePagination}
        search={true}
        clientSidePagination={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.title}"? All photos and customer links associated with this product will be removed.`}
        confirmText="Yes, Delete"
      />
    </Box>
  );
}
