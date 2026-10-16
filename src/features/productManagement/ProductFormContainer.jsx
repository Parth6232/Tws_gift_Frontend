import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
  TextField,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Textfield from '../../common/Textfield';
import Dropdown from '../../common/Dropdown';
import Button from '../../common/Button';
import ImageUploader from '../../common/ImageUploader';
import { productManagementApiAction } from './productManagementApiSlice';
import { commonApiAction } from '../../store/redux/slices/commonApiSlice';

// Zod validation schema
const productSchema = z
  .object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Please select a category'),
    price: z.coerce.number().min(1, 'Price must be greater than 0'),
    comparePrice: z.coerce.number().optional().nullable(),
    stock: z.coerce.number().min(0, 'Stock cannot be negative'),
    freeShipping: z.boolean().default(false),
    isNewArrival: z.boolean().default(false),
    isBestSeller: z.boolean().default(false),
    isPremium: z.boolean().default(false),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.comparePrice && data.comparePrice > 0) {
        return data.comparePrice >= data.price;
      }
      return true;
    },
    {
      message: 'Compare price (MRP) must be greater than or equal to sale price',
      path: ['comparePrice'],
    }
  );

export default function ProductFormContainer() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isEditing = Boolean(id);

  const existingProduct = location.state?.product;

  const { data: categories = [] } = commonApiAction.useGetCategoriesQuery();
  const [createProductMutation, { isLoading: isCreating }] =
    productManagementApiAction.useCreateProductMutation();
  const [updateProductMutation, { isLoading: isUpdating }] =
    productManagementApiAction.useUpdateProductMutation();

  const [existingImages, setExistingImages] = useState(existingProduct?.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [tags, setTags] = useState(existingProduct?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: existingProduct?.title || '',
      description: existingProduct?.description || '',
      category: existingProduct?.category?._id || existingProduct?.category || '',
      price: existingProduct?.price || '',
      comparePrice: existingProduct?.comparePrice || '',
      stock: existingProduct?.stock ?? 10,
      freeShipping: existingProduct?.freeShipping || false,
      isNewArrival: existingProduct?.isNewArrival || false,
      isBestSeller: existingProduct?.isBestSeller || false,
      isPremium: existingProduct?.isPremium || false,
      isActive: existingProduct?.isActive ?? true,
    },
  });

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: c._id,
  }));

  const handleAddFiles = (files) => {
    setNewFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveNewFile = (index) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages((prev) => prev.filter((img) => img.publicId !== publicId));
    setRemovedImageIds((prev) => [...prev, publicId]);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^#/, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const onSubmit = async (values) => {
    if (existingImages.length === 0 && newFiles.length === 0) {
      setFormError('Please upload at least one product image.');
      return;
    }

    setFormError('');

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price);
    if (values.comparePrice) {
      formData.append('comparePrice', values.comparePrice);
    }
    formData.append('stock', values.stock);
    formData.append('freeShipping', values.freeShipping);
    formData.append('isNewArrival', values.isNewArrival);
    formData.append('isBestSeller', values.isBestSeller);
    formData.append('isPremium', values.isPremium);
    formData.append('isActive', values.isActive);

    // Tags
    formData.append('tags', JSON.stringify(tags));

    // Existing images to remove
    if (isEditing && removedImageIds.length > 0) {
      formData.append('removeImages', JSON.stringify(removedImageIds));
    }

    // New image files
    newFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      if (isEditing) {
        await updateProductMutation({ id, formData }).unwrap();
      } else {
        await createProductMutation(formData).unwrap();
      }
      navigate('/admin/products');
    } catch (err) {
      setFormError(err?.data?.message || err?.message || 'Failed to save product.');
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', pb: 8 }}>
      {/* Top Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            {isEditing ? 'Edit Keepsake' : 'Add New Keepsake'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the product specifications, upload artisan photos, and set catalog flags.
          </Typography>
        </Box>

        <Button component={Link} to="/admin/products" variant="outline" size="small">
          Cancel & Return
        </Button>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {formError}
        </Alert>
      )}

      {/* Form Container */}
      <Paper
        elevation={0}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '24px',
          border: `1.5px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
        }}
      >
        {/* Section 1: Basic Information */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            1. Basic Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Textfield
                  label="Product Title"
                  placeholder="e.g. Personalized Wooden Love Box"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  showError={Boolean(errors.title)}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Category"
                    options={categoryOptions}
                    required
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    showError={Boolean(errors.category)}
                  />
                )}
              />

              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Textfield
                    label="Available Stock Inventory"
                    type="number"
                    placeholder="e.g. 25"
                    required
                    value={field.value}
                    onChange={field.onChange}
                    showError={Boolean(errors.stock)}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Box>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textfield
                  label="Product Description"
                  placeholder="Describe materials (e.g. solid teak wood, acrylic), dimensions, and personalization process..."
                  multiline
                  rows={4}
                  required
                  value={field.value}
                  onChange={field.onChange}
                  showError={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* Section 2: Pricing */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            2. Pricing (INR)
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Textfield
                  label="Selling Price (₹)"
                  type="number"
                  placeholder="e.g. 1499"
                  required
                  value={field.value}
                  onChange={field.onChange}
                  showError={Boolean(errors.price)}
                  helperText={errors.price?.message}
                />
              )}
            />

            <Controller
              name="comparePrice"
              control={control}
              render={({ field }) => (
                <Textfield
                  label="Compare Price / MRP (₹)"
                  type="number"
                  placeholder="e.g. 2199 (optional, must be ≥ selling price)"
                  value={field.value}
                  onChange={field.onChange}
                  showError={Boolean(errors.comparePrice)}
                  helperText={errors.comparePrice?.message}
                />
              )}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* Section 3: Product Imagery (ImageUploader) */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            3. Product Imagery
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Upload up to 8 high-resolution photos. First image will act as the primary card cover.
          </Typography>

          <ImageUploader
            images={existingImages}
            newFiles={newFiles}
            onAddFiles={handleAddFiles}
            onRemoveNewFile={handleRemoveNewFile}
            onRemoveExistingImage={handleRemoveExistingImage}
            maxImages={8}
          />
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* Section 4: Tags */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            4. Tags & Keywords
          </Typography>

          <TextField
            fullWidth
            size="small"
            placeholder="Type tag (e.g. anniversary, romantic, giftbox) and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            sx={{
              mb: 1.5,
              '& .MuiOutlinedInput-root': { borderRadius: '12px' },
            }}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* Section 5: Switches & Flags */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            5. Storefront Badges & Visibility
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={<Typography variant="body2">Active (Visible in Store)</Typography>}
                />
              )}
            />

            <Controller
              name="freeShipping"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={<Typography variant="body2">Free Shipping Badge</Typography>}
                />
              )}
            />

            <Controller
              name="isBestSeller"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={<Typography variant="body2">Best Seller Shelf & Badge</Typography>}
                />
              )}
            />

            <Controller
              name="isNewArrival"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={<Typography variant="body2">New Arrival Shelf & Badge</Typography>}
                />
              )}
            />

            <Controller
              name="isPremium"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={<Typography variant="body2">Premium Collection Band</Typography>}
                />
              )}
            />
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider }} />

        {/* Actions Submit - Sticky at bottom on xs */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
            gap: 2,
            position: { xs: 'sticky', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            backgroundColor: { xs: theme.palette.background.paper, sm: 'transparent' },
            p: { xs: 2, sm: 0 },
            mx: { xs: -3, sm: 0 },
            mb: { xs: -3, sm: 0 },
            borderTop: { xs: `1px solid ${theme.palette.divider}`, sm: 'none' },
            zIndex: { xs: 10, sm: 'auto' },
          }}
        >
          <Button
            component={Link}
            to="/admin/products"
            variant="outline"
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ flex: { xs: 2, sm: 'none' }, minWidth: { sm: 160 } }}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
