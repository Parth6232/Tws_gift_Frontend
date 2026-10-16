import React, { useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Checkbox,
  useTheme,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Text from './Text';
import { validateField } from '../utils/validation';

export default function Dropdown({
  type = 'select',
  icon = false,
  value = '',
  onChange,
  options = [],
  placeholder = 'Select an option',
  label,
  sx,
  required,
  name,
  setError = () => {},
  showError,
  checkbox = false,
  getOptionLabel = (option) => option?.label || '',
  isOptionEqualToValue = (option, val) => option?.value === val?.value,
  disabled = false,
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const hasOptions = options.length > 0;

  useEffect(() => {
    if (required && name) {
      const error = required && validateField('required', value);
      if (error) {
        setError((prev) => ({
          ...prev,
          [name]: error,
        }));
      } else {
        setError((prev) => {
          const tempErr = { ...prev };
          delete tempErr[name];
          return tempErr;
        });
      }
    }
  }, [value, required, name]);

  return (
    <FormControl
      sx={{
        minWidth: sx?.minWidth ?? 200,
        width: '100%',
        maxWidth: sx?.maxWidth ?? 'auto',
      }}
    >
      {label && (
        <Text type="label">
          {label}
          {required && (
            <span
              style={{
                color: theme.palette.primary.main,
                marginLeft: '4px',
                fontWeight: 700,
              }}
            >
              *
            </span>
          )}
        </Text>
      )}

      {type === 'autocomplete' ? (
        <Autocomplete
          options={options}
          value={value}
          disabled={disabled}
          onChange={(e, newValue) => onChange(newValue)}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={isOptionEqualToValue}
          popupIcon={<ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />}
          noOptionsText={
            <em style={{ color: theme.palette.text.secondary }}>No options found</em>
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="standard"
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,
                sx: {
                  height: '44px',
                  borderRadius: '12px',
                  border: `1.5px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontSize: '14px',
                  px: 2,
                  width: '100%',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: isDark
                      ? '0 0 0 3px rgba(242, 117, 143, 0.2)'
                      : '0 0 0 3px rgba(217, 69, 107, 0.15)',
                  },
                  ...sx,
                },
              }}
            />
          )}
          renderOption={(optionProps, option) => (
            <li
              {...optionProps}
              style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                fontSize: '14px',
              }}
            >
              {icon && option.icon && (
                <img
                  src={option.icon}
                  alt=""
                  style={{ marginRight: 8, width: 20, height: 20, objectFit: 'contain' }}
                />
              )}
              {option.label}
            </li>
          )}
          fullWidth
          {...props}
        />
      ) : (
        <Select
          value={value ?? ''}
          onChange={onChange}
          name={name}
          disabled={disabled}
          displayEmpty
          variant="standard"
          disableUnderline
          IconComponent={(iconProps) => (
            <ExpandMoreIcon
              {...iconProps}
              sx={{ color: theme.palette.text.secondary, mr: 1 }}
            />
          )}
          renderValue={(selected) => {
            if (!selected && selected !== 0) {
              return (
                <span style={{ color: theme.palette.text.secondary, opacity: 0.7 }}>
                  {placeholder}
                </span>
              );
            }

            const selectedOption = options.find((opt) => opt.value === selected);
            if (!selectedOption) return selected;

            return (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {icon && selectedOption.icon && (
                  <img
                    src={selectedOption.icon}
                    alt=""
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 8,
                      objectFit: 'contain',
                    }}
                  />
                )}
                <span>{selectedOption.label}</span>
              </Box>
            );
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '12px',
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[3],
                maxHeight: 300,
              },
            },
          }}
          sx={{
            height: '44px',
            borderRadius: '12px',
            border: `1.5px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: '14px',
            px: 2,
            width: '100%',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused': {
              borderColor: theme.palette.primary.main,
              boxShadow: isDark
                ? '0 0 0 3px rgba(242, 117, 143, 0.2)'
                : '0 0 0 3px rgba(217, 69, 107, 0.15)',
            },
            '& .MuiSelect-select': {
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            },
            ...sx,
          }}
          {...props}
        >
          {hasOptions ? (
            options.map((item, index) => (
              <MenuItem
                key={index}
                value={item.value}
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(74, 33, 24, 0.04)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: isDark ? 'rgba(242, 117, 143, 0.15)' : 'rgba(217, 69, 107, 0.08)',
                    fontWeight: 600,
                  },
                }}
              >
                {checkbox && (
                  <Checkbox
                    checked={Array.isArray(value) && value.indexOf(item.value) > -1}
                    size="small"
                  />
                )}
                {icon && item.icon && (
                  <img
                    src={item.icon}
                    alt=""
                    style={{ marginRight: 8, width: 20, height: 20, objectFit: 'contain' }}
                  />
                )}
                {item.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled sx={{ color: theme.palette.text.secondary }}>
              <em>No options available</em>
            </MenuItem>
          )}
        </Select>
      )}

      {showError && (
        <Text type="caption" sx={{ color: '#D9456B', mt: 0.5, fontWeight: 500 }}>
          {value === '' && required
            ? validateField('required', value)
            : validateField(name, value)}
        </Text>
      )}
    </FormControl>
  );
}
