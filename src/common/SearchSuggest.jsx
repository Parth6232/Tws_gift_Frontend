import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  InputBase,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { productApiAction } from '../features/product/productApiSlice';
import { useDebouncedValue } from '../utils/useDebounce';
import { optimizeImage } from '../utils/imageUrl';
import { formatCurrency } from '../utils/helper';

/**
 * SearchSuggest - reusable typeahead search component with suggestions dropdown
 *
 * Props:
 *   placeholder   - input placeholder text
 *   onClose       - called when user navigates or clears (parent should close/collapse search UI)
 *   autoFocus     - whether the input auto-focuses on mount
 *   inputSx       - extra sx for the input wrapper Box
 */
export default function SearchSuggest({
  placeholder = 'Search gifts, polos, bags...',
  onClose = () => {},
  autoFocus = false,
  inputSx = {},
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const skipFetch = debouncedQuery.trim().length < 2;

  const { data: suggestData, isFetching: isSuggesting } =
    productApiAction.useGetProductsQuery(
      { search: debouncedQuery.trim(), limit: 5 },
      { skip: skipFetch }
    );

  const suggestions = suggestData?.items || [];

  // Open dropdown when we have a debounced query of ≥ 2 chars
  useEffect(() => {
    if (!skipFetch) {
      setDropdownOpen(true);
      setActiveIndex(-1);
    } else {
      setDropdownOpen(false);
    }
  }, [debouncedQuery, skipFetch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const submitSearch = (q) => {
    const text = (q ?? query).trim();
    if (!text) return;
    navigate(`/shop?search=${encodeURIComponent(text)}`);
    setQuery('');
    setDropdownOpen(false);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (!dropdownOpen) {
      if (e.key === 'Enter') submitSearch();
      return;
    }

    const total = suggestions.length + 1; // +1 for "see all" row
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % total);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + total) % total);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const prod = suggestions[activeIndex];
        navigate(`/product/${prod.slug}`);
        setQuery('');
        setDropdownOpen(false);
        onClose();
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const handleSuggestionClick = (prod) => {
    navigate(`/product/${prod.slug}`);
    setQuery('');
    setDropdownOpen(false);
    onClose();
  };

  const handleSeeAll = () => {
    submitSearch(query);
  };

  return (
    <Box ref={containerRef} sx={{ position: 'relative', ...inputSx }}>
      {/* Search input */}
      <Box
        component="form"
        onSubmit={(e) => { e.preventDefault(); submitSearch(); }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.75,
          borderRadius: '12px',
          backgroundColor: theme.palette.background.paper,
          border: `1.5px solid ${dropdownOpen ? theme.palette.primary.main : theme.palette.divider}`,
          boxShadow: dropdownOpen ? '0 4px 16px rgba(217, 69, 107, 0.1)' : 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          gap: 1,
        }}
      >
        <SearchRoundedIcon sx={{ color: theme.palette.primary.main, fontSize: 20, flexShrink: 0 }} />
        <InputBase
          inputRef={inputRef}
          autoFocus={autoFocus}
          fullWidth
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (debouncedQuery.length >= 2) setDropdownOpen(true);
          }}
          sx={{ fontSize: '0.9375rem', color: theme.palette.text.primary }}
        />
        {isSuggesting ? (
          <CircularProgress size={16} color="primary" sx={{ flexShrink: 0 }} />
        ) : query ? (
          <IconButton
            size="small"
            onClick={() => { setQuery(''); setDropdownOpen(false); }}
            aria-label="Clear search"
            sx={{ p: 0.25, flexShrink: 0, color: theme.palette.text.secondary }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        ) : null}
      </Box>

      {/* Suggestions Dropdown */}
      {dropdownOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            width: '100%',
            maxHeight: '60vh',
            overflowY: 'auto',
            borderRadius: '14px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[8],
            zIndex: 2000,
          }}
        >
          {/* Suggestions list */}
          {suggestions.length === 0 && !isSuggesting ? (
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No matches found
              </Typography>
            </Box>
          ) : (
            suggestions.map((prod, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Box
                  key={prod._id || prod.slug}
                  onClick={() => handleSuggestionClick(prod)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    cursor: 'pointer',
                    backgroundColor: isActive
                      ? isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(217,69,107,0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(217,69,107,0.05)',
                    },
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:last-of-type': { borderBottom: 'none' },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: isDark ? '#231613' : '#FDF7EE',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <img
                      src={optimizeImage(prod.images?.[0]?.url, 80)}
                      alt={prod.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </Box>
                  {/* Title + Price */}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {prod.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                      {formatCurrency(prod.price)}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}

          {/* See all results row */}
          {query.trim().length >= 2 && (
            <Box
              onClick={handleSeeAll}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                px: 2,
                py: 1.25,
                cursor: 'pointer',
                borderTop: `1px solid ${theme.palette.divider}`,
                backgroundColor:
                  activeIndex === suggestions.length
                    ? isDark
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(217,69,107,0.05)'
                    : 'transparent',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(217,69,107,0.05)',
                },
                transition: 'background-color 0.15s ease',
              }}
            >
              <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                See all results for &ldquo;{query.trim()}&rdquo;
              </Typography>
              <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: theme.palette.primary.main }} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
