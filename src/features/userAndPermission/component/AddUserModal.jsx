import React, { useState } from 'react';
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
import Textfield from '../../../common/Textfield';
import Button from '../../../common/Button';
import { userAndPermissionApiAction } from '../userAndPermissionApiSlice';
import { appConstants } from '../../../constant/appConstants';

export default function AddUserModal({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [createUser, { isLoading }] = userAndPermissionApiAction.useCreateUserMutation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState([appConstants.permissions.PRODUCT_CREATE]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTogglePermission = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    setErrorMsg('');

    try {
      await createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        permissions,
      }).unwrap();

      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setPermissions([appConstants.permissions.PRODUCT_CREATE]);
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.message || 'Failed to create manager.');
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
          maxWidth: 480,
          width: isMobile ? '100%' : 'calc(100% - 32px)',
          margin: isMobile ? 0 : '16px',
          backgroundColor: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
        Add New Manager
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Textfield
            label="Full Name"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textfield
            label="Staff Email"
            placeholder="e.g. priya@twsgifts.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Textfield
            label="Initial Password"
            placeholder="At least 6 characters"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: theme.palette.text.secondary, mb: 1, display: 'block' }}>
              Assign Access Permissions
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.includes(appConstants.permissions.PRODUCT_CREATE)}
                    onChange={() => handleTogglePermission(appConstants.permissions.PRODUCT_CREATE)}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      product:create
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Allows manager to create, edit, upload images, and manage their own products.
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2, px: 3, pb: 2 }}>
        <Button variant="outline" size="small" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="contained" size="small" onClick={handleSubmit} loading={isLoading}>
          Create Manager
        </Button>
      </DialogActions>
    </Dialog>
  );
}
