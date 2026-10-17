export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Strip trailing slashes and ensure /api endpoint prefix for backend routes
const normalizedBase = API_URL.trim().replace(/\/+$/, '');
const apiBaseURL = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

const fullAddress = 'Parvati Bhawan, Sector A2, Scheme 136, Vijay Nagar, Indore, Madhya Pradesh 452010';
const instagramHandle = ''; // Not confirmed yet. If set later, e.g. 'indore_gaddha_free'

export const appConstants = {
  appName: 'TWS Gifts',
  tagline: 'Thoughtful Wishes. Special Moments.',
  subTagline: 'Personalized & Corporate Gifting.',
  apiUrl: API_URL,
  apiBaseURL,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '918109101811',
  phoneDisplay: '+91 81091 01811',
  contactEmail: 'twsgiftsqcs@gmail.com',
  locationText: 'Indore, Madhya Pradesh, India',
  fullAddress,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
  businessHours: '', // owner will fill later; if empty, do not render anywhere
  websiteUrl: '', // not confirmed yet; do not display anywhere while empty
  instagramHandle,
  instagramUrl: instagramHandle ? `https://www.instagram.com/${instagramHandle}/` : '',

  // Permissions & Roles
  permissions: {
    PRODUCT_CREATE: 'product:create',
  },
  roles: {
    ADMIN: 'admin',
    MANAGER: 'manager',
  },

  // Color Tokens
  colors: {
    light: {
      background: '#FFF8EC',
      surface: '#FFFFFF',
      textPrimary: '#4A2118',
      textSecondary: '#8A6A60',
      accent: '#D9456B',
      softAccent: '#F9D5DA',
      detailGold: '#C9A24B',
      border: 'rgba(74, 33, 24, 0.12)',
      cardShadow: '0 8px 30px rgba(74, 33, 24, 0.06)',
    },
    dark: {
      background: '#1C1210',
      surface: '#2A1B17',
      textPrimary: '#F8EBDD',
      textSecondary: '#C9B1A5',
      accent: '#F2758F',
      softAccent: '#4A2630',
      detailGold: '#C9A24B',
      border: 'rgba(248, 235, 221, 0.12)',
      cardShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
    },
  },

  // Value props & honest copy
  whyUs: [
    {
      title: 'Free Shipping Across India',
      description: 'On all orders above ₹999 with careful, tracked doorstep delivery.',
      icon: 'LocalShippingRounded',
    },
    {
      title: 'Personalization Available',
      description: 'Custom photo printing, engraving and message tags on selected products.',
      icon: 'FavoriteRounded',
    },
    {
      title: 'Gift-Ready Packaging',
      description: 'Every gift comes wrapped in our signature blush box with ribbon and seal.',
      icon: 'CardGiftcardRounded',
    },
    {
      title: 'Direct WhatsApp Support',
      description: 'Chat directly with our team before, during, and after your order.',
      icon: 'SupportAgentRounded',
    },
  ],

  personalizationSteps: [
    {
      step: '01',
      title: 'Choose Your Gift',
      description: 'Browse personalized gifts, branded apparel, bags and handicraft options.',
    },
    {
      step: '02',
      title: 'Share Your Details on WhatsApp',
      description: 'Send your favorite high-res photos, anniversary dates, songs, or heartfelt personal notes.',
    },
    {
      step: '03',
      title: 'Prepared & Delivered',
      description: 'We prepare your order with care, pack it securely, and deliver it to your doorstep.',
    },
  ],

  testimonials: [],

  chatbotQuickReplies: [
    'Corporate & bulk gifting',
    'Gifts under ₹2000',
    'Polo T-Shirts',
    'Backpacks & duffle bags',
  ],
};
