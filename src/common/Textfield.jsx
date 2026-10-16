import React, { useEffect } from 'react';
import {
  FormControl,
  InputAdornment,
  TextField as MuiTextField,
  useTheme,
  Box,
} from '@mui/material';
import Text from './Text';
import { validateField } from '../utils/validation';

export default function Textfield({
  label,
  placeholder = 'Enter text',
  startIcon,
  endIcon,
  value,
  onChange = () => {},
  showError,
  sx = {},
  required = false,
  name,
  setError = () => {},
  type = 'text',
  multiline = false,
  rows = 1,
  disabled = false,
  helperText,
  ...props
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    if (required || name) {
      const error =
        value === '' && required
          ? validateField('required', value)
          : validateField(name, value);

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

  const handleChange = (e) => {
    const { name: fieldName, value: rawVal } = e.target;
    let val = rawVal;

    if (type === 'number') {
      if (!/^\d*\.?\d*$/.test(val)) return;
    }

    onChange({
      target: {
        name: fieldName,
        value: val,
        type,
      },
    });
  };

  return (
    <FormControl
      sx={{
        minWidth: sx?.minWidth ?? 200,
        width: sx?.width ?? '100%',
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
      <MuiTextField
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        variant="standard"
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        InputProps={{
          disableUnderline: true,
          startAdornment: startIcon && (
            <InputAdornment position="start" sx={{ color: theme.palette.text.secondary }}>
              {typeof startIcon === 'string' ? (
                <img src={startIcon} alt="" style={{ width: 20, height: 20 }} />
              ) : (
                startIcon
              )}
            </InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end" sx={{ color: theme.palette.text.secondary }}>
              {typeof endIcon === 'string' ? (
                <img src={endIcon} alt="" style={{ width: 20, height: 20 }} />
              ) : (
                endIcon
              )}
            </InputAdornment>
          ),
          sx: {
            minHeight: multiline ? 'auto' : '44px',
            py: multiline ? 1.5 : 0,
            borderRadius: '12px',
            border: `1.5px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: '14px',
            px: 2,
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
            '& input': {
              padding: 0,
              height: multiline ? 'auto' : '100%',
              color: theme.palette.text.primary,
            },
            ...sx,
          },
        }}
        sx={{
          width: sx?.width ?? '100%',
          '& input::placeholder, & textarea::placeholder': {
            color: theme.palette.text.secondary,
            opacity: 0.7,
          },
          '& input:-webkit-autofill': {
            boxShadow: `0 0 0 1000px ${theme.palette.background.paper} inset !important`,
            WebkitTextFillColor: `${theme.palette.text.primary} !important`,
          },
        }}
        name={name}
        type={type}
        {...props}
      />
      {helperText && !showError && (
        <Box sx={{ mt: 0.5 }}>
          <Text type="caption">{helperText}</Text>
        </Box>
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
