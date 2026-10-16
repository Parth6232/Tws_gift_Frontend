export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Strip trailing slashes and ensure /api endpoint prefix for backend routes
const normalizedBase = API_URL.trim().replace(/\/+$/, '');
const apiBaseURL = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

export const appConstants = {
  appName: 'TWS Gifts',
  tagline: 'Thoughtful Wishes. Meaningful Moments.',
  subTagline: 'Personalized & Corporate Gifting.',
  apiUrl: API_URL,
  apiBaseURL,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210',
  contactEmail: 'hello@twsgifts.com',

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

  // Sample copy for owner/brand customization
  whyUs: [
    {
      title: 'Free Shipping Across India',
      description: 'On all orders above ₹999 with careful, tracked doorstep delivery.',
      icon: 'LocalShippingRounded',
    },
    {
      title: '100% Personalized with Love',
      description: 'Custom photo printing, laser engraving, and custom message tags tailored for you.',
      icon: 'FavoriteRounded',
    },
    {
      title: 'Gift-Ready Packaging',
      description: 'Every gift comes wrapped in our signature blush box with ribbon and seal.',
      icon: 'CardGiftcardRounded',
    },
    {
      title: 'Direct WhatsApp Support',
      description: 'Chat directly with our gifting artisans before, during, and after crafting your order.',
      icon: 'SupportAgentRounded',
    },
  ],

  personalizationSteps: [
    {
      step: '01',
      title: 'Choose Your Keepsake',
      description: 'Select from handcrafted wooden frames, glowing lamps, engraved accessories, or custom mugs.',
    },
    {
      step: '02',
      title: 'Share Your Details on WhatsApp',
      description: 'Send your favorite high-res photos, anniversary dates, songs, or heartfelt personal notes.',
    },
    {
      step: '03',
      title: 'Crafted & Delivered to Doorstep',
      description: 'Our artisans handcraft your gift with meticulous precision, package it securely, and deliver it.',
    },
  ],

  testimonials: [
    {
      id: 1,
      name: 'Ananya Sharma',
      city: 'Bengaluru',
      quote:
        'The engraved wooden portrait arrived in the most beautiful blush packaging. My parents were in tears on their 25th anniversary. Such exquisite craftsmanship!',
      rating: 5,
      product: 'Custom Wooden Photo Frame',
    },
    {
      id: 2,
      name: 'Rohan Mehra',
      city: 'Mumbai',
      quote:
        'Ordering on WhatsApp was ridiculously smooth. The team confirmed my photo resolution within 10 minutes and delivered right on my girlfriend’s birthday.',
      rating: 5,
      product: 'Personalized Acrylic Spotify Lamp',
    },
    {
      id: 3,
      name: 'Priyanka Verma',
      city: 'Delhi',
      quote:
        'TWS Gifts offers such warm and thoughtful gifts compared to generic online shopping. The golden gift tag detail is perfection.',
      rating: 5,
      product: 'Handmade Memory Keepsake Box',
    },
  ],

  chatbotQuickReplies: [
    'Birthday gifts under ₹500',
    'Anniversary ideas',
    'Personalized mugs',
    'Premium gifts',
  ],
};
