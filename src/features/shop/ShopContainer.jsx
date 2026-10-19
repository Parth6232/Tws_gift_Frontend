import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Slider,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  useTheme,
  Drawer,
  IconButton,
  Chip,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import { useSearchParams, useParams } from 'react-router-dom';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SectionHeading from '../../common/SectionHeading';
import ProductCard from '../../common/ProductCard';
import EmptyState from '../../common/EmptyState';
import { ProductCardSkeleton } from '../../common/Skeleton';
import Button from '../../common/Button';
import Textfield from '../../common/Textfield';
import { productApiAction } from '../product/productApiSlice';
import { commonApiAction } from '../../store/redux/slices/commonApiSlice';
import { formatCurrency } from '../../utils/helper';
import { useDebouncedValue } from '../../utils/useDebounce';

export default function ShopContainer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams();

  // Filters state from URL query
  const activeCategory = categorySlug || searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeSort = searchParams.get('sort') || '-createdAt';
  const isBestSeller = searchParams.get('bestSeller') === 'true';
  const isNewArrival = searchParams.get('newArrival') === 'true';
  const isPremium = searchParams.get('premium') === 'true';
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : 0;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 10000;

  const [priceRange, setPriceRange] = useState([minPriceParam, maxPriceParam]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Search input state with debounce
  const [searchInput, setSearchInput] = useState(activeSearch);
  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // Keep searchInput in sync when URL search param changes externally
  useEffect(() => {
    setSearchInput(activeSearch);
  }, [activeSearch]);

  // Debounced URL update (only when length >= 2 or empty)
  useEffect(() => {
    const trimmed = debouncedSearch.trim();
    if (trimmed.length === 1) return;

    const currentUrlSearch = searchParams.get('search') || '';
    if (trimmed !== currentUrlSearch) {
      const next = new URLSearchParams(searchParams);
      if (trimmed) {
        next.set('search', trimmed);
      } else {
        next.delete('search');
      }
      setSearchParams(next, { replace: true });
    }
  }, [debouncedSearch]);

  // Bug fix: reset local page to 1 whenever search, category, sort or any filter in the URL changes
  const filterSignature = `${categorySlug || ''}_${searchParams.toString()}`;
  const prevFilterSigRef = useRef(filterSignature);

  useEffect(() => {
    if (prevFilterSigRef.current !== filterSignature) {
      prevFilterSigRef.current = filterSignature;
      setPage(1);
    }
  }, [filterSignature]);

  const handleClearSearch = () => {
    setSearchInput('');
    const currentUrlSearch = searchParams.get('search') || '';
    if (currentUrlSearch) {
      const next = new URLSearchParams(searchParams);
      next.delete('search');
      setSearchParams(next, { replace: true });
    }
  };

  const { data: categories = [] } = commonApiAction.useGetCategoriesQuery();

  const queryParams = {
    category: activeCategory,
    search: activeSearch,
    sort: activeSort,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000 ? priceRange[1] : undefined,
    bestSeller: isBestSeller ? 'true' : undefined,
    newArrival: isNewArrival ? 'true' : undefined,
    premium: isPremium ? 'true' : undefined,
    page,
    limit: 12,
  };

  const { data: productsData, isLoading, isFetching } =
    productApiAction.useGetProductsQuery(queryParams);

  // Keep showing previous results while a new query loads; show skeleton only on first load
  const prevDataRef = useRef(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  if (productsData) {
    prevDataRef.current = productsData;
  }

  useEffect(() => {
    if (productsData && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [productsData, hasLoadedOnce]);

  const effectiveData = productsData || prevDataRef.current;
  const items = effectiveData?.items || [];
  const total = effectiveData?.total || 0;
  const pages = effectiveData?.pages || 1;
  const isRelaxed = Boolean(effectiveData?.relaxed);
  const showInitialSkeleton = !hasLoadedOnce && isLoading;

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === null || value === '' || value === false) {
      next.delete(key);
    } else {
      next.set(key, value.toString());
    }
    setSearchParams(next);
    setPage(1);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setPriceRange([0, 10000]);
    setPage(1);
  };

  const FilterContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      {/* Category Filter */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!activeCategory}
                onChange={() => updateFilter('category', '')}
                size="small"
              />
            }
            label={<Typography variant="body2">All Categories</Typography>}
          />
          {categories.map((cat) => (
            <FormControlLabel
              key={cat._id || cat.slug}
              control={
                <Checkbox
                  checked={activeCategory === cat.slug}
                  onChange={(e) => updateFilter('category', e.target.checked ? cat.slug : '')}
                  size="small"
                />
              }
              label={<Typography variant="body2">{cat.name}</Typography>}
            />
          ))}
        </Box>
      </Box>

      {/* Price Range Slider */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Price Range ({formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])})
        </Typography>
        <Slider
          value={priceRange}
          onChange={(e, val) => setPriceRange(val)}
          onChangeCommitted={(e, val) => {
            updateFilter('minPrice', val[0] > 0 ? val[0] : '');
            updateFilter('maxPrice', val[1] < 10000 ? val[1] : '');
          }}
          min={0}
          max={10000}
          step={200}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `₹${v}`}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>

      {/* Flags / Badges */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Collection Tags
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isBestSeller}
                onChange={(e) => updateFilter('bestSeller', e.target.checked ? 'true' : '')}
                size="small"
              />
            }
            label={<Typography variant="body2">Best Sellers</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isNewArrival}
                onChange={(e) => updateFilter('newArrival', e.target.checked ? 'true' : '')}
                size="small"
              />
            }
            label={<Typography variant="body2">New Arrivals</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isPremium}
                onChange={(e) => updateFilter('premium', e.target.checked ? 'true' : '')}
                size="small"
              />
            }
            label={<Typography variant="body2">Premium Collection</Typography>}
          />
        </Box>
      </Box>

      <Button variant="outline" size="small" onClick={clearAllFilters}>
        Reset All Filters
      </Button>
    </Box>
  );

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading
          eyebrow="The Gift Collection"
          title={
            activeCategory
              ? categories.find((c) => c.slug === activeCategory)?.name || 'Our Collection'
              : activeSearch
              ? `Results for "${activeSearch}"`
              : 'Discover Our Gifts'
          }
          description="Browse personalized gifts, corporate gifting, apparel, bags and handicraft pieces."
          centered={false}
        />

        {/* Toolbar: Count, Mobile filter button, Sort */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            mb: 4,
            pb: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing <strong>{items.length}</strong> of <strong>{total}</strong> gifts
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            {/* Mobile Filter Button */}
            <Button
              variant="white"
              size="small"
              onClick={() => setMobileFilterOpen(true)}
              icon={<FilterListRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 'auto', px: 2, flex: { xs: 1, sm: 'none' } }}
            >
              Filters
            </Button>

            {/* Sort Select */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: { xs: 1, sm: 'none' }, width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: { xs: 'none', sm: 'block' } }}>
                Sort:
              </Typography>
              <Select
                value={activeSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                size="small"
                fullWidth
                sx={{
                  borderRadius: '10px',
                  fontSize: '0.8125rem',
                  height: 38,
                  backgroundColor: theme.palette.background.paper,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <MenuItem value="-createdAt">Newest First</MenuItem>
                <MenuItem value="price">Price: Low to High</MenuItem>
                <MenuItem value="-price">Price: High to Low</MenuItem>
              </Select>
            </Box>
          </Box>
        </Box>

        {/* Active Filters Chips */}
        {(activeCategory || activeSearch || isBestSeller || isNewArrival || isPremium) && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {activeCategory && (
              <Chip
                label={`Category: ${activeCategory}`}
                onDelete={() => updateFilter('category', '')}
                size="small"
              />
            )}
            {activeSearch && (
              <Chip
                label={`Search: "${activeSearch}"`}
                onDelete={() => updateFilter('search', '')}
                size="small"
              />
            )}
            {isBestSeller && (
              <Chip
                label="Best Seller"
                onDelete={() => updateFilter('bestSeller', '')}
                size="small"
              />
            )}
            {isNewArrival && (
              <Chip
                label="New Arrival"
                onDelete={() => updateFilter('newArrival', '')}
                size="small"
              />
            )}
            {isPremium && (
              <Chip
                label="Premium"
                onDelete={() => updateFilter('premium', '')}
                size="small"
              />
            )}
          </Box>
        )}

        {/* Layout: Sidebar Filter + Product Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' }, gap: { xs: 3, md: 5 } }}>
          {/* Desktop Filter Panel */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{FilterContent}</Box>

          {/* Product Grid Area */}
          <Box>
            {/* In-page Search Field */}
            <Box sx={{ mb: 3, position: 'relative' }}>
              <Textfield
                sx={{
                  width: { xs: '100%', sm: 420 },
                }}
                placeholder="Search gifts, polos, bags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                startIcon={<SearchRoundedIcon sx={{ color: theme.palette.text.secondary }} />}
                endIcon={
                  isFetching ? (
                    <CircularProgress size={16} color="primary" />
                  ) : searchInput ? (
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                      sx={{ p: 0.5, color: theme.palette.text.secondary }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  ) : null
                }
              />
            </Box>

            {/* Relaxed / close-match banner */}
            {isRelaxed && activeSearch && (
              <Box
                sx={{
                  mb: 2,
                  px: 2,
                  py: 1,
                  borderRadius: '10px',
                  backgroundColor: isDark ? 'rgba(201,162,75,0.12)' : '#FFF8E7',
                  border: `1px solid ${isDark ? 'rgba(201,162,75,0.3)' : '#FFECB3'}`,
                }}
              >
                <Typography variant="caption" sx={{ color: isDark ? '#C9A24B' : '#8A6A00', fontWeight: 500 }}>
                  No exact match for &ldquo;{activeSearch}&rdquo;. Showing close matches.
                </Typography>
              </Box>
            )}

            {showInitialSkeleton ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, minmax(140px, 1fr))', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                }}
              >
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </Box>
            ) : items.length === 0 ? (
              <EmptyState
                title="No gifts match your search"
                description="Try relaxing your filters, searching for a different keyword, or explore our best sellers."
                actionText="Reset Filters"
                onAction={clearAllFilters}
              />
            ) : (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, minmax(140px, 1fr))', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
                    gap: { xs: 2, sm: 2.5, md: 3 },
                    opacity: isFetching ? 0.6 : 1,
                    transition: 'opacity 0.25s ease',
                  }}
                >
                  {items.map((prod) => (
                    <Box key={prod._id || prod.slug} sx={{ minWidth: 0, height: '100%' }}>
                      <ProductCard product={prod} />
                    </Box>
                  ))}
                </Box>

                {/* Pagination / Load more */}
                {pages > 1 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 6, gap: 1 }}>
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
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Mobile Filter Bottom Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        PaperProps={{
          sx: {
            p: 3,
            maxHeight: '80vh',
            borderRadius: '24px 24px 0 0',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: '"Fraunces", serif', fontWeight: 600 }}>
            Filter Products
          </Typography>
          <IconButton onClick={() => setMobileFilterOpen(false)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        {FilterContent}
      </Drawer>
    </Box>
  );
}
