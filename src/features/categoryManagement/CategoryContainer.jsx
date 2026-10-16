import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Alert,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import Button from '../../common/Button';
import Textfield from '../../common/Textfield';
import ConfirmDialog from '../../common/ConfirmDialog';
import { categoryApiAction } from './categoryApiSlice';

export default function CategoryContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { data: categories = [], isLoading } = categoryApiAction.useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    categoryApiAction.useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    categoryApiAction.useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    categoryApiAction.useDeleteCategoryMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [modalError, setModalError] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName('');
    setModalError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setModalError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setModalError('Category name is required.');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, name: categoryName.trim() }).unwrap();
      } else {
        await createCategory({ name: categoryName.trim() }).unwrap();
      }
      setModalOpen(false);
    } catch (err) {
      setModalError(err?.data?.message || err?.message || 'Failed to save category.');
    }
  };

  const handleDeleteClick = (cat) => {
    setCategoryToDelete(cat);
    setDeleteError('');
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete?._id) return;
    try {
      await deleteCategory(categoryToDelete._id).unwrap();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      setDeleteError(
        err?.data?.message ||
          'This category contains active products and cannot be deleted until those products are moved or deleted.'
      );
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto' }}>
      {/* Top Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
          flexWrap: 'wrap',
          gap: 2,
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
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize store categories that populate the public mega-menu and storefront navigation.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={handleOpenAdd}
          icon={<AddRoundedIcon sx={{ color: '#fff' }} />}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add Category
        </Button>
      </Box>

      {/* Categories List */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '24px',
          border: `1.5px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          overflow: 'hidden',
          boxShadow: theme.shadows[1],
        }}
      >
        {categories.length === 0 && !isLoading ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No categories created yet. Click above to add your first category!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {categories.map((cat, idx) => (
              <Box
                key={cat._id || cat.slug}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: { xs: 2, sm: 2.5 },
                  px: 3,
                  borderBottom:
                    idx < categories.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CategoryRoundedIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Typography variant="body1" fontWeight={600} color="text.primary">
                      {cat.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Slug: /{cat.slug}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Rename Category">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenEdit(cat)}
                      sx={{ color: theme.palette.text.secondary, '&:hover': { color: theme.palette.primary.main } }}
                    >
                      <EditRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete Category">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(cat)}
                      sx={{ color: theme.palette.text.secondary, '&:hover': { color: '#D32F2F' } }}
                    >
                      <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Add / Edit Category Dialog */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 1.5,
            maxWidth: 440,
            width: '100%',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
          {editingCategory ? 'Rename Category' : 'Create Category'}
        </DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          {modalError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
              {modalError}
            </Alert>
          )}
          <Textfield
            label="Category Name"
            placeholder="e.g. Acrylic Lamps"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
          <Button variant="outline" size="small" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            loading={isCreating || isUpdating}
          >
            {editingCategory ? 'Save Changes' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Category"
        message={
          deleteError ||
          `Are you sure you want to delete category "${categoryToDelete?.name}"? If there are products in this category, delete will be prevented.`
        }
        confirmText="Delete Category"
      />
    </Box>
  );
}
