import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  useTheme,
  CircularProgress,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import TabSection from '../../../common/TabSection';
import { dashboardApiAction } from '../../dashboard/dashboardApiSlice';
import { formatDateTime } from '../../../utils/DateTimeFormat';
import { formatCurrency } from '../../../utils/helper';
import { optimizeImage } from '../../../utils/imageUrl';

export default function UserDrawer({ open, onClose, user }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState('Overview');

  const userId = user?.id || user?._id;

  // Tab 2: User Products query
  const { data: userProductsData, isLoading: loadingProducts } =
    dashboardApiAction.useGetUserProductsQuery(
      { id: userId, limit: 50 },
      { skip: !open || !userId || activeTab !== 'Products added' }
    );

  // Tab 3: Access History query
  const { data: activityData, isLoading: loadingActivity } =
    dashboardApiAction.useGetActivityQuery(
      { entityId: userId, limit: 50 },
      { skip: !open || !userId || activeTab !== 'Access history' }
    );

  const userProducts = userProductsData?.items || [];
  const activityItems = (activityData?.items || []).filter((act) =>
    ['user.permissions', 'user.status', 'user.create'].includes(act.action)
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
          maxWidth: '100%',
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: theme.shadows[4],
          borderLeft: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || <PersonOutlineRoundedIcon />}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email} • {user?.role === 'admin' ? 'Administrator' : 'Manager'}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ px: 3 }}>
        <TabSection
          tabList={['Overview', 'Products added', 'Access history']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Box>

      {/* Content Area */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {/* Tab 1: Overview */}
        {activeTab === 'Overview' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Profile & Access Details
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Role
                  </Typography>
                  <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                    {user?.role}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ color: user?.isActive ? '#2E7D32' : '#D32F2F' }}
                  >
                    {user?.isActive ? 'Active' : 'Deactivated'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {user?.createdBy?.name || 'Admin'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateTime(user?.createdAt)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Last Login
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDateTime(user?.lastLoginAt)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Products Added
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="primary">
                    {user?.productCount || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Current Permissions */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Assigned Permissions
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user?.permissions?.length > 0 ? (
                  user.permissions.map((perm) => (
                    <Chip
                      key={perm}
                      label={perm}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(242, 117, 143, 0.2)' : '#FDF0F3',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      }}
                    />
                  ))
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    No active permissions granted.
                  </Typography>
                )}
              </Box>

              {user?.permissionsUpdatedBy && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  Last modified by <strong>{user.permissionsUpdatedBy?.name || 'Admin'}</strong> on{' '}
                  {formatDateTime(user.permissionsUpdatedAt)}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Tab 2: Products Added */}
        {activeTab === 'Products added' && (
          <Box>
            {loadingProducts ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={32} />
              </Box>
            ) : userProducts.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                This user has not created any products yet.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {userProducts.map((p) => (
                  <Box
                    key={p._id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.75,
                      borderRadius: '14px',
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.paper,
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundColor: isDark ? '#231613' : '#FDF7EE',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={optimizeImage(p.images?.[0]?.url, 120)}
                        alt={p.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {p.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.category?.name || 'General'} • Added: {formatDateTime(p.createdAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: '"Fraunces", serif',
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          fontSize: '0.9375rem',
                        }}
                      >
                        {formatCurrency(p.price)}
                      </Typography>
                      <Chip
                        label={p.isActive ? 'Active' : 'Draft'}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.6875rem',
                          backgroundColor: p.isActive ? 'rgba(46, 125, 50, 0.15)' : 'rgba(0,0,0,0.08)',
                          color: p.isActive ? '#2E7D32' : theme.palette.text.secondary,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Tab 3: Access History */}
        {activeTab === 'Access history' && (
          <Box>
            {loadingActivity ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={32} />
              </Box>
            ) : activityItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                No permission or status change history recorded for this user.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activityItems.map((act) => {
                  let actionText = '';
                  if (act.action === 'user.create') {
                    actionText = `${act.actor?.name || 'Admin'} created manager account with ${
                      act.meta?.permissions?.join(', ') || 'no permissions'
                    }`;
                  } else if (act.action === 'user.permissions') {
                    const added = act.meta?.added?.join(', ');
                    const removed = act.meta?.removed?.join(', ');
                    actionText = `${act.actor?.name || 'Admin'} updated access: ${
                      added ? `granted [${added}]` : ''
                    } ${removed ? `removed [${removed}]` : ''}`;
                  } else if (act.action === 'user.status') {
                    actionText = `${act.actor?.name || 'Admin'} changed status to ${
                      act.meta?.isActive ? 'Active' : 'Deactivated'
                    }`;
                  }

                  return (
                    <Box
                      key={act._id}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
                      }}
                    >
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                        {actionText}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDateTime(act.createdAt)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
