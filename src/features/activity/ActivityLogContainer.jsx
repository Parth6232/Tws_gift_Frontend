import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  Chip,
  useTheme,
  CircularProgress,
} from '@mui/material';
import SectionHeading from '../../common/SectionHeading';
import Button from '../../common/Button';
import EmptyState from '../../common/EmptyState';
import { dashboardApiAction } from '../dashboard/dashboardApiSlice';
import { formatDateTime, formatRelativeTime } from '../../utils/DateTimeFormat';
import { formatCurrency } from '../../utils/helper';

export default function ActivityLogContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [actorFilter, setActorFilter] = useState('');

  const { data: team = [] } = dashboardApiAction.useGetTeamQuery();
  const { data: activityData, isLoading, isFetching } =
    dashboardApiAction.useGetActivityQuery({
      page,
      limit: 20,
      action: actionFilter || undefined,
      actor: actorFilter || undefined,
    });

  const items = activityData?.items || [];
  const total = activityData?.total || 0;
  const pages = activityData?.pages || 1;

  // Format human-readable event description from action & meta
  const renderActivityText = (act) => {
    const actorName = act.actor?.name || 'Staff Member';
    const entity = act.entityName || 'item';

    switch (act.action) {
      case 'product.create':
        return (
          <>
            <strong>{actorName}</strong> added product <strong>&ldquo;{entity}&rdquo;</strong>{' '}
            {act.meta?.price && `(priced at ${formatCurrency(act.meta.price)})`}
          </>
        );
      case 'product.update':
        return (
          <>
            <strong>{actorName}</strong> edited product <strong>&ldquo;{entity}&rdquo;</strong>{' '}
            {act.meta?.fields && (
              <span style={{ opacity: 0.8 }}>[fields: {act.meta.fields.join(', ')}]</span>
            )}
          </>
        );
      case 'product.delete':
        return (
          <>
            <strong>{actorName}</strong> deleted product <strong>&ldquo;{entity}&rdquo;</strong>
          </>
        );
      case 'user.create':
        return (
          <>
            <strong>{actorName}</strong> created manager <strong>{entity}</strong>{' '}
            with permissions [{act.meta?.permissions?.join(', ') || 'none'}]
          </>
        );
      case 'user.permissions': {
        const added = act.meta?.added?.join(', ');
        const removed = act.meta?.removed?.join(', ');
        return (
          <>
            <strong>{actorName}</strong> changed access of <strong>{entity}</strong>:{' '}
            {added ? `gave [${added}]` : ''} {removed ? `removed [${removed}]` : ''}
          </>
        );
      }
      case 'user.status':
        return (
          <>
            <strong>{actorName}</strong> {act.meta?.isActive ? 'activated' : 'deactivated'} manager{' '}
            <strong>{entity}</strong>
          </>
        );
      default:
        return (
          <>
            <strong>{actorName}</strong> performed <strong>{act.action}</strong> on{' '}
            <strong>{entity}</strong>
          </>
        );
    }
  };

  const getActionColor = (action = '') => {
    if (action.includes('create')) return '#2E7D32';
    if (action.includes('delete')) return '#D32F2F';
    if (action.includes('permissions')) return '#C9A24B';
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Fraunces", serif',
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Audit & Activity Log
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chronological timeline of all product creations, edits, permission modifications, and user statuses.
        </Typography>
      </Box>

      {/* Filters Toolbar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Action Filter */}
          <Select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            displayEmpty
            size="small"
            sx={{
              borderRadius: '10px',
              fontSize: '0.8125rem',
              height: 38,
              minWidth: 170,
            }}
          >
            <MenuItem value="">All Actions</MenuItem>
            <MenuItem value="product.create">Product Additions</MenuItem>
            <MenuItem value="product.update">Product Updates</MenuItem>
            <MenuItem value="product.delete">Product Deletions</MenuItem>
            <MenuItem value="user.permissions">Access Key Changes</MenuItem>
            <MenuItem value="user.status">Status Toggles</MenuItem>
            <MenuItem value="user.create">Manager Creations</MenuItem>
          </Select>

          {/* Actor Filter */}
          <Select
            value={actorFilter}
            onChange={(e) => {
              setActorFilter(e.target.value);
              setPage(1);
            }}
            displayEmpty
            size="small"
            sx={{
              borderRadius: '10px',
              fontSize: '0.8125rem',
              height: 38,
              minWidth: 160,
            }}
          >
            <MenuItem value="">All Staff</MenuItem>
            {team.map((m) => (
              <MenuItem key={m.id || m._id} value={m.id || m._id}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Total <strong>{total}</strong> audit events recorded
        </Typography>
      </Paper>

      {/* Timeline Stream */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={36} />
        </Box>
      ) : items.length === 0 ? (
        <EmptyState
          title="No activity recorded"
          description="There are no audit logs matching your selected action and staff filters."
        />
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            border: `1.5px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden',
            p: 3,
            boxShadow: theme.shadows[1],
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((act) => (
              <Box
                key={act._id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: '16px',
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(74,33,24,0.04)',
                  },
                }}
              >
                {/* Dot / Indicator */}
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: getActionColor(act.action),
                    mt: 0.75,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${getActionColor(act.action)}`,
                  }}
                />

                {/* Event Description */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontSize: '0.9375rem', lineHeight: 1.5, mb: 0.5 }}>
                    {renderActivityText(act)}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                      label={act.action}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(74,33,24,0.06)',
                      }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(act.createdAt)} ({formatRelativeTime(act.createdAt)})
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Pagination */}
          {pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 1 }}>
              {Array.from({ length: pages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = page === pageNum;
                return (
                  <Button
                    key={pageNum}
                    variant={isCurrent ? 'contained' : 'white'}
                    size="small"
                    onClick={() => {
                      setPage(pageNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    sx={{ minWidth: 40, width: 40, height: 40, p: 0 }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
