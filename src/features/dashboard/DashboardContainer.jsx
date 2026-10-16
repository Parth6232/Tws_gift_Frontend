import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CommonKpiCard from '../../common/CommonKpiCard';
import Button from '../../common/Button';
import { dashboardApiAction } from './dashboardApiSlice';
import { formatDateTime, formatRelativeTime } from '../../utils/DateTimeFormat';
import { formatCurrency } from '../../utils/helper';

export default function DashboardContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { data: statsData, isLoading: loadingStats } = dashboardApiAction.useGetStatsQuery();
  const { data: teamData = [], isLoading: loadingTeam } = dashboardApiAction.useGetTeamQuery();
  const { data: activityData, isLoading: loadingActivity } = dashboardApiAction.useGetActivityQuery({
    limit: 8,
  });

  const totals = statsData?.totals || {};
  const productsPerDay = statsData?.productsPerDay || [];
  const recentProducts = statsData?.recentProducts || [];
  const recentActivity = activityData?.items || [];

  // Sort top contributors by productCount
  const topContributors = [...teamData]
    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 5);

  const maxProductCount = Math.max(1, ...teamData.map((m) => m.productCount || 0));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Page Title & Quick Actions */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
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
            Dashboard Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time catalog metrics, team contributions, and product additions.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button
            component={Link}
            to="/admin/products/new"
            variant="contained"
            size="small"
            sx={{ flex: { xs: '1 1 100%', sm: 'none' } }}
          >
            + Add New Product
          </Button>
          <Button
            component={Link}
            to="/admin/team"
            variant="white"
            size="small"
            sx={{ flex: { xs: '1 1 100%', sm: 'none' } }}
          >
            Manage Team
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 2.5,
        }}
      >
        <CommonKpiCard
          label="Total Products"
          value={totals.products ?? 0}
          icon={<Inventory2RoundedIcon />}
        />
        <CommonKpiCard
          label="Active In Store"
          value={totals.activeProducts ?? 0}
          icon={<CheckCircleRoundedIcon />}
          valuecolor="#2E7D32"
        />
        <CommonKpiCard
          label="Sold Out"
          value={totals.soldOut ?? 0}
          icon={<RemoveCircleOutlineRoundedIcon />}
          valuecolor="#D9456B"
        />
        <CommonKpiCard
          label="Categories"
          value={totals.categories ?? 0}
          icon={<CategoryRoundedIcon />}
          valuecolor="#C9A24B"
        />
        <CommonKpiCard
          label="Team Managers"
          value={`${totals.activeManagers ?? 0}/${totals.managers ?? 0}`}
          subtitle="Active / Total"
          icon={<GroupRoundedIcon />}
        />
      </Box>

      {/* Charts & Top Contributors Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* Products Added per Day Chart */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            minWidth: 0,
          }}
        >
          <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
                Products Added Per Day
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Last 30 days activity volume
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 260, width: '100%' }}>
            {productsPerDay.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={productsPerDay}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke={theme.palette.text.secondary}
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke={theme.palette.text.secondary}
                    fontSize={11}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: theme.palette.background.paper,
                      borderColor: theme.palette.divider,
                      borderRadius: '12px',
                      color: theme.palette.text.primary,
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.secondary,
                }}
              >
                <Typography variant="body2">No products added in the last 30 days yet.</Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Top Contributors Bar List */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
              Top Contributors
            </Typography>
            <Typography
              component={Link}
              to="/admin/team"
              variant="caption"
              sx={{ color: theme.palette.primary.main, fontWeight: 600, textDecoration: 'none' }}
            >
              View Team →
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
            {topContributors.length > 0 ? (
              topContributors.map((user) => (
                <Box key={user.id || user._id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" fontWeight={700} color="primary">
                      {user.productCount || 0} products
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.round(((user.productCount || 0) / maxProductCount) * 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(74,33,24,0.06)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Last added: {formatRelativeTime(user.lastProductAt)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No contributors data yet.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Recent Products & Activity Feed Row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {/* Recent Products */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
              Recently Added Products
            </Typography>
            <Button
              component={Link}
              to="/admin/products"
              size="small"
              variant="white"
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              View All Products
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {recentProducts.length > 0 ? (
              recentProducts.map((p) => (
                <Box
                  key={p._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(74,33,24,0.02)',
                  }}
                >
                  <Box sx={{ minWidth: 0, pr: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {p.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Added by <strong>{p.createdBy?.name || 'Staff'}</strong> • {formatRelativeTime(p.createdAt)}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: '"Fraunces", serif',
                      fontWeight: 700,
                      color: theme.palette.primary.main,
                      flexShrink: 0,
                    }}
                  >
                    {formatCurrency(p.price)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent products to display.
              </Typography>
            )}
          </Box>
        </Paper>

        {/* Recent Activity Log Feed */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '20px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            minWidth: 0,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
              Recent Activity Feed
            </Typography>
            <Button
              component={Link}
              to="/admin/activity"
              size="small"
              variant="white"
              sx={{ minWidth: 'auto', px: 1.5 }}
            >
              Full Activity Log
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {recentActivity.length > 0 ? (
              recentActivity.map((act) => (
                <Box
                  key={act._id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: isDark ? 'rgba(242, 117, 143, 0.12)' : '#FDF0F3',
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    ✦
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      <strong>{act.actor?.name || 'User'}</strong> {act.action?.replace('.', ' ')}{' '}
                      <strong>{act.entityName || ''}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDateTime(act.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No activity records yet.
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
