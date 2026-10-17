import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import Button from '../../../common/Button';
import Textfield from '../../../common/Textfield';
import Dropdown from '../../../common/Dropdown';
import Badge from '../../../common/Badge';
import PriceTag from '../../../common/PriceTag';
import InfoAlert from '../../../common/InfoAlert';
import ThemeToggle from '../../../common/ThemeToggle';
import SectionHeading from '../../../common/SectionHeading';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function ThemedComponentsSheet() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [textVal, setTextVal] = useState('Personalized Wooden Frame');
  const [numVal, setNumVal] = useState('1499');
  const [dropdownVal, setDropdownVal] = useState('frames');
  const [showError, setShowError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const dropdownOptions = [
    { label: 'Photo Frames', value: 'frames' },
    { label: 'Acrylic Spotify Lamp', value: 'lamps' },
    { label: 'Engraved Wooden Box', value: 'boxes' },
    { label: 'Custom Ceramic Mug', value: 'mugs' },
  ];

  return (
    <Box
      sx={{
        py: { xs: 7, md: 10 },
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: isDark ? '#1C1210' : '#FFFDF9',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="Design System Showcase"
          title="Themed Components Sheet"
          description="Explore TWS Gifts UI components restyled to read directly from MUI theme palette tokens in both light and dark modes."
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: '16px',
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="body2" fontWeight={600} color="text.secondary">
              Theme Mode:
            </Typography>
            <ThemeToggle />
            <FormControlLabel
              control={
                <Switch
                  checked={showError}
                  onChange={(e) => setShowError(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography variant="caption">Show Form Errors</Typography>}
              sx={{ ml: 1 }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={btnLoading}
                  onChange={(e) => setBtnLoading(e.target.checked)}
                  color="primary"
                />
              }
              label={<Typography variant="caption">Simulate Button Loading</Typography>}
            />
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: '24px',
            border: `1.5px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
          }}
        >
          {/* Row 1: Buttons */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              1. Buttons (Restyled to read theme.palette)
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Button
                variant="contained"
                loading={btnLoading}
                icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
              >
                Contained (Primary Rose)
              </Button>

              <Button
                variant="white"
                loading={btnLoading}
                icon={<FavoriteRoundedIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />}
              >
                White / Surface
              </Button>

              <Button variant="outline" loading={btnLoading}>
                Outline Variant
              </Button>

              <Button variant="secondary" loading={btnLoading}>
                Secondary (Chocolate)
              </Button>

              <Button variant="contained" disabled>
                Disabled State
              </Button>

              <Button variant="contained" size="small">
                Small
              </Button>

              <Button variant="contained" size="large">
                Large Button
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

          {/* Row 2: Textfields */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              2. Textfield Inputs
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
              }}
            >
              <Textfield
                label="Product Title"
                placeholder="e.g. Personalized Frame"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                required
                showError={showError}
                name="required"
              />

              <Textfield
                label="Search Gifts"
                placeholder="Search gifts..."
                startIcon={<SearchRoundedIcon sx={{ color: theme.palette.text.secondary }} />}
                value=""
                onChange={() => {}}
              />

              <Textfield
                label="Price (INR)"
                type="number"
                placeholder="Enter price"
                value={numVal}
                onChange={(e) => setNumVal(e.target.value)}
                required
                showError={showError}
                name="number"
                helperText="Auto-validated for numeric input"
              />

              <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <Textfield
                  label="Special Personalization Instructions"
                  placeholder="Enter custom names, anniversary dates, or heartfelt messages..."
                  multiline
                  rows={2}
                  value=""
                  onChange={() => {}}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

          {/* Row 3: Dropdowns */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              3. Dropdown Menus
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 3,
              }}
            >
              <Dropdown
                label="Category Select"
                options={dropdownOptions}
                value={dropdownVal}
                onChange={(e) => setDropdownVal(e.target.value)}
                required
                showError={showError}
                name="category"
              />

              <Dropdown
                type="autocomplete"
                label="Autocomplete Searchable Dropdown"
                options={dropdownOptions}
                placeholder="Type to filter..."
                value={dropdownOptions.find((o) => o.value === dropdownVal)}
                onChange={(val) => setDropdownVal(val?.value || '')}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

          {/* Row 4: Badges & PriceTags */}
          <Box sx={{ mb: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              4. Badges & Price Tags
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <Badge label="Best Seller" variant="bestSeller" />
                <Badge label="New Arrival" variant="new" />
                <Badge label="Premium" variant="premium" />
                <Badge label="Free Shipping" variant="freeShipping" />
                <Badge label="Sold Out" variant="soldOut" />
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
                <PriceTag price={1299} comparePrice={1999} size="small" />
                <PriceTag price={1499} comparePrice={2299} size="medium" />
                <PriceTag price={2999} comparePrice={4499} size="large" />
                <PriceTag price={4999} comparePrice={6999} size="xlarge" />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 4, borderColor: theme.palette.divider }} />

          {/* Row 5: Info Alerts */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Fraunces", serif',
                fontWeight: 600,
                color: theme.palette.text.primary,
                mb: 2.5,
              }}
            >
              5. Themed Information Alerts
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InfoAlert
                type="info"
                title="Personalization Notice"
                messages={['Please ensure uploaded photos are clear and high resolution for engraving.']}
              />
              <InfoAlert
                type="warning"
                title="Delivery Cut-off Notice"
                messages={['Orders placed after 4 PM IST will be processed the next morning.']}
              />
              <InfoAlert
                type="success"
                title="Design System Active"
                messages={['All common components adhere to TWS Gifts typography, warm shadows, and palette tokens.']}
              />
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
