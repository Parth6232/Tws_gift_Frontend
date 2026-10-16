import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { optimizeImage } from '../utils/imageUrl';

export default function ImageUploader({
  images = [],
  newFiles = [],
  onAddFiles = () => {},
  onRemoveNewFile = () => {},
  onRemoveExistingImage = () => {},
  maxImages = 8,
  disabled = false,
  error,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const totalCount = images.length + newFiles.length;
  const isFull = totalCount >= maxImages;

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (disabled || isFull) return;

      const remainingSlots = maxImages - totalCount;
      const validFiles = acceptedFiles.slice(0, remainingSlots);

      if (validFiles.length) {
        onAddFiles(validFiles);
      }
    },
    [disabled, isFull, maxImages, totalCount, onAddFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || isFull,
  });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Drop Area */}
      {!isFull && (
        <Box
          {...getRootProps()}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: `2px dashed ${
              isDragActive
                ? theme.palette.primary.main
                : error
                ? '#D32F2F'
                : theme.palette.divider
            }`,
            backgroundColor: isDragActive
              ? isDark
                ? 'rgba(242, 117, 143, 0.1)'
                : '#FDF0F3'
              : theme.palette.background.paper,
            cursor: disabled ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s ease',
            mb: totalCount > 0 ? 2 : 0,
            '&:hover': {
              borderColor: disabled ? theme.palette.divider : theme.palette.primary.main,
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#FFFDF9',
            },
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadRoundedIcon
            sx={{
              fontSize: 42,
              color: isDragActive ? theme.palette.primary.main : theme.palette.text.secondary,
              mb: 1,
            }}
          />
          <Typography variant="body1" fontWeight={600} color="text.primary">
            {isDragActive
              ? 'Drop images here...'
              : 'Drag & drop product images, or click to browse'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            PNG, JPG, WEBP up to 5 MB each. Max {maxImages} images ({totalCount}/{maxImages} used).
          </Typography>
        </Box>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}

      {/* Previews Grid */}
      {totalCount > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
            gap: 1.5,
            mt: 1,
          }}
        >
          {/* Existing uploaded images */}
          {images.map((img, idx) => (
            <Box
              key={img.publicId || idx}
              sx={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '1 / 1',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.shadows[1],
                group: 'preview-item',
              }}
            >
              <img
                src={optimizeImage(img.url, 200)}
                alt="Product Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {idx === 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 6,
                    left: 6,
                    px: 0.75,
                    py: 0.25,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFD700',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.25,
                    fontWeight: 600,
                  }}
                >
                  <StarRoundedIcon sx={{ fontSize: 12 }} /> Primary
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => onRemoveExistingImage(img.publicId || img._id || idx)}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: '#FFFFFF',
                  width: 26,
                  height: 26,
                  '&:hover': {
                    backgroundColor: '#D32F2F',
                  },
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}

          {/* New files to upload */}
          {newFiles.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            const isPrimary = images.length === 0 && idx === 0;

            return (
              <Box
                key={file.name + idx}
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  border: `2px solid ${theme.palette.primary.main}`,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                }}
              >
                <img
                  src={previewUrl}
                  alt="New File Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  onLoad={() => URL.revokeObjectURL(previewUrl)}
                />
                {isPrimary && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      px: 0.75,
                      py: 0.25,
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 0, 0, 0.65)',
                      color: '#FFD700',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                      fontWeight: 600,
                    }}
                  >
                    <StarRoundedIcon sx={{ fontSize: 12 }} /> Primary
                  </Box>
                )}
                <IconButton
                  size="small"
                  onClick={() => onRemoveNewFile(idx)}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    width: 26,
                    height: 26,
                    '&:hover': {
                      backgroundColor: '#D32F2F',
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
