export function validateField(type, value) {
  switch (type) {
    case 'required':
      if (value === undefined || value === null || value.toString().trim() === '') {
        return 'This field is required.';
      }
      return null;

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value?.length > 0 && !emailRegex.test(value)) {
        return 'Please enter a valid email address.';
      }
      return null;
    }

    case 'phone':
    case 'mobile': {
      const phoneRegex = /^[0-9]{10}$/;
      if (value?.length > 0 && !phoneRegex.test(value)) {
        return 'Please enter a valid 10-digit phone number.';
      }
      return null;
    }

    case 'number':
    case 'price':
    case 'stock':
      if (value !== '' && value !== null && value !== undefined && isNaN(Number(value))) {
        return 'Please enter a valid number.';
      }
      return null;

    default:
      return null;
  }
}

export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    const error = validateField('required', formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  Object.entries(formData).forEach(([key, value]) => {
    if (!errors[key]) {
      const error = validateField(key, value);
      if (error) {
        errors[key] = error;
      }
    }
  });

  return errors;
};
