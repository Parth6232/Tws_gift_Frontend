import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Switch,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CommonTable from '../../common/CommonTable';
import Button from '../../common/Button';
import AddUserModal from './component/AddUserModal';
import PermissionModal from './component/PermissionModal';
import UserDrawer from './component/UserDrawer';
import { dashboardApiAction } from '../dashboard/dashboardApiSlice';
import { userAndPermissionApiAction } from './userAndPermissionApiSlice';
import { formatDateTime, formatRelativeTime } from '../../utils/DateTimeFormat';

export default function TeamContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { data: team = [], isLoading, isFetching } = dashboardApiAction.useGetTeamQuery();
  const [setStatusMutation] = userAndPermissionApiAction.useSetStatusMutation();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);
  const [selectedUserForPerm, setSelectedUserForPerm] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerUser, setDrawerUser] = useState(null);

  const [tablePagination, setTablePagination] = useState({
    page: 0,
    pageSize: 10,
    search: '',
  });

  const handleStatusToggle = async (e, row) => {
    e.stopPropagation();
    if (row.role === 'admin') return;
    try {
      await setStatusMutation({
        id: row.id || row._id,
        isActive: !row.isActive,
      }).unwrap();
    } catch {
      // Handled in interceptor
    }
  };

  const handleRowClick = ({ row }) => {
    setDrawerUser(row);
    setDrawerOpen(true);
  };

  const filteredTeam = team.filter((member) => {
    if (!tablePagination.search) return true;
    const q = tablePagination.search.toLowerCase();
    return (
      member.name?.toLowerCase().includes(q) ||
      member.email?.toLowerCase().includes(q) ||
      member.role?.toLowerCase().includes(q)
    );
  });

  const columnsConfig = [
    {
      label: 'Staff Member',
      field: 'name',
      minWidth: 190,
      component: (row) => (
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {row.email}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Role',
      field: 'role',
      minWidth: 110,
      component: (row) => (
        <Chip
          label={row.role === 'admin' ? 'Administrator' : 'Manager'}
          size="small"
          sx={{
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            backgroundColor:
              row.role === 'admin'
                ? isDark
                  ? 'rgba(201, 162, 75, 0.2)'
                  : '#FFF3D6'
                : isDark
                ? 'rgba(242, 117, 143, 0.2)'
                : '#FDF0F3',
            color: row.role === 'admin' ? '#C9A24B' : theme.palette.primary.main,
          }}
        />
      ),
    },
    {
      label: 'Access Keys',
      field: 'permissions',
      minWidth: 150,
      component: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.role === 'admin' ? (
            <Chip label="Full Access" size="small" sx={{ fontSize: '0.6875rem', fontWeight: 600 }} />
          ) : row.permissions?.length > 0 ? (
            row.permissions.map((p) => (
              <Chip
                key={p}
                label={p}
                size="small"
                sx={{
                  fontSize: '0.6875rem',
                  backgroundColor: isDark ? 'rgba(242, 117, 143, 0.15)' : '#FDF0F3',
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }}
              />
            ))
          ) : (
            <Typography variant="caption" color="text.secondary">
              No permissions
            </Typography>
          )}
        </Box>
      ),
    },
    {
      label: 'Access Granted By',
      field: 'permissionsUpdatedBy',
      minWidth: 170,
      component: (row) => (
        <Box>
          <Typography variant="caption" fontWeight={600} display="block">
            {row.role === 'admin' ? 'System' : row.permissionsUpdatedBy?.name || 'Admin'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.permissionsUpdatedAt ? formatDateTime(row.permissionsUpdatedAt) : '—'}
          </Typography>
        </Box>
      ),
    },
    {
      label: 'Created By',
      field: 'createdBy',
      minWidth: 120,
      component: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.createdBy?.name || 'System'}
        </Typography>
      ),
    },
    {
      label: 'Last Login',
      field: 'lastLoginAt',
      minWidth: 140,
      component: (row) => (
        <Typography variant="caption" color="text.secondary">
          {row.lastLoginAt ? formatDateTime(row.lastLoginAt) : 'Never'}
        </Typography>
      ),
    },
    {
      label: 'Products Added',
      field: 'productCount',
      minWidth: 120,
      component: (row) => (
        <Box>
          <Typography variant="body2" fontWeight={700} color="primary">
            {row.productCount || 0}
          </Typography>
          {row.lastProductAt && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
              Last: {formatRelativeTime(row.lastProductAt)}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      label: 'Status',
      field: 'isActive',
      minWidth: 100,
      component: (row) => (
        <Switch
          checked={Boolean(row.isActive)}
          onChange={(e) => handleStatusToggle(e, row)}
          disabled={row.role === 'admin'}
          size="small"
          color="primary"
        />
      ),
    },
    {
      label: 'Access Edit',
      field: 'actions',
      minWidth: 90,
      component: (row) => (
        <Tooltip title={row.role === 'admin' ? 'Admin has permanent full access' : 'Edit Permissions'}>
          <span>
            <IconButton
              size="small"
              disabled={row.role === 'admin'}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUserForPerm(row);
                setPermModalOpen(true);
              }}
              sx={{ color: theme.palette.text.secondary, '&:hover': { color: theme.palette.primary.main } }}
            >
              <KeyRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
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
            Team & Access Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage staff accounts, assign granular permissions, inspect products added, and audit who granted access.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setAddModalOpen(true)}
          icon={<AddRoundedIcon sx={{ color: '#fff' }} />}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          Add Manager
        </Button>
      </Box>

      {/* Main Table */}
      <CommonTable
        isLoading={isLoading || isFetching}
        data={filteredTeam}
        totalData={filteredTeam.length}
        columnsConfig={columnsConfig}
        tablePagination={tablePagination}
        setTablePagination={setTablePagination}
        onRowClick={handleRowClick}
        search={true}
      />

      {/* Add User Modal */}
      <AddUserModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />

      {/* Edit Permissions Modal */}
      <PermissionModal
        open={permModalOpen}
        onClose={() => setPermModalOpen(false)}
        user={selectedUserForPerm}
      />

      {/* Right User Drawer */}
      <UserDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={drawerUser}
      />
    </Box>
  );
}
