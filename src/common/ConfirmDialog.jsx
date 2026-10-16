import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import Button from './Button';

export default function ConfirmDialog({
  open = false,
  onClose = () => {},
  onConfirm = () => {},
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'contained',
  loading = false,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '20px',
          padding: 2,
          maxWidth: 440,
          width: isMobile ? '100%' : 'calc(100% - 32px)',
          margin: isMobile ? 0 : '16px',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(217, 69, 107, 0.2)' : '#FDF0F3',
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningAmberRoundedIcon />
        </Box>
        <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ pt: 2, gap: 1 }}>
        <Button
          variant="outline"
          size="small"
          onClick={onClose}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="small"
          onClick={onConfirm}
          loading={loading}
          sx={{
            minWidth: 100,
            background: confirmText.toLowerCase().includes('delete') ? '#D32F2F' : undefined,
            '&:hover': {
              background: confirmText.toLowerCase().includes('delete') ? '#B71C1C' : undefined,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
