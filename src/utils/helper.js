import { appConstants } from '../constant/appConstants';

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format currency to Indian Rupee (INR)
 * @param {number} amount
 * @returns {string} e.g. "₹1,499"
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate discount percentage
 * @param {number} price
 * @param {number} comparePrice
 * @returns {number} e.g. 25
 */
export const calculateDiscount = (price, comparePrice) => {
  if (!comparePrice || comparePrice <= price) return 0;
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

/**
 * Generate WhatsApp checkout URL for entire cart
 * @param {Array} cartItems
 * @param {string} customerNote
 * @returns {string} wa.me URL with encoded message
 */
export const generateCartWhatsAppUrl = (cartItems = [], customerNote = '') => {
  const phone = appConstants.whatsappNumber.replace(/[^0-9]/g, '');
  const baseUrl = window.location.origin;

  let totalAmount = 0;
  let itemsSummary = '';

  cartItems.forEach((item, index) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    totalAmount += itemTotal;
    const link = `${baseUrl}/product/${item.slug}`;

    itemsSummary += `\n${index + 1}. *${item.title}*\n   Qty: ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(itemTotal)}\n   Link: ${link}`;
    if (item.personalizationNote) {
      itemsSummary += `\n   Custom Note: "${item.personalizationNote}"`;
    }
  });

  let message = `Hello TWS Gifts Team! 🎁\nI would like to place an order for the following items:\n${itemsSummary}\n\n*Total Amount:* ${formatCurrency(totalAmount)}`;

  if (customerNote) {
    message += `\n\n*Special Instructions/Note:* ${customerNote}`;
  }

  message += `\n\nPlease let me know how to proceed with photo sharing and order confirmation. Thank you!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate WhatsApp URL for single product inquiry or order
 * @param {Object} product
 * @param {string} customNote
 * @returns {string}
 */
export const generateProductWhatsAppUrl = (product, customNote = '') => {
  const phone = appConstants.whatsappNumber.replace(/[^0-9]/g, '');
  const productUrl = `${window.location.origin}/product/${product?.slug}`;

  let message = `Hello TWS Gifts! 🎁\nI am interested in ordering:\n*${product?.title}*\nPrice: ${formatCurrency(product?.price)}\nLink: ${productUrl}`;

  if (customNote) {
    message += `\n\nPersonalization details: "${customNote}"`;
  }

  message += `\nPlease guide me on the next steps for customization!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
