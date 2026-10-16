import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Button from '../../../common/Button';
import { userAndPermissionApiAction } from '../userAndPermissionApiSlice';
import { appConstants } from '../../../constant/appConstants';

export default function PermissionModal({ open, onClose, user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [updatePermissions, { isLoading }] =
    userAndPermissionApiAction.useUpdatePermissionsMutation();

  const [permissions, setPermissions] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
      setErrorMsg('');
    }
  }, [user]);

  const handleToggle = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSave = async () => {
    if (!user?._id && !user?.id) return;
    const userId = user._id || user.id;

    try {
      await updatePermissions({ id: userId, permissions }).unwrap();
      onClose();
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || 'Failed to update access.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isLoading ? undefined : onClose}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : '24px',
          p: 2,
          maxWidth: 460,
          width: isMobile ? '100%' : 'calc(100% - 32px)',
          margin: isMobile ? 0 : '16px',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
        Edit Access for {user?.name}
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
            {errorMsg}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Modify active permission keys granted to this manager.
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: '14px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={permissions.includes(appConstants.permissions.PRODUCT_CREATE)}
                onChange={() => handleToggle(appConstants.permissions.PRODUCT_CREATE)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  product:create
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Create, edit, and organize products in their workspace.
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
        <Button variant="outline" size="small" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" size="small" onClick={handleSave} loading={isLoading}>
          Save Access
        </Button>
      </DialogActions>
    </Dialog>
  );
}
