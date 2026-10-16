# TWS Gifts — Frontend

> **"Thoughtful Wishes. Meaningful Moments."**
> A premium personalized & corporate gifting storefront, conversational gifting assistant, and administrative control center built with **React 19 + Vite (JavaScript)**.

---

## 🎁 Features Overview

### 1. Public Storefront
- **Sticky Navbar:** Customized brand lockup ("Dear" in chocolate `#4A2118` + "Keeps" in rose `#D9456B`), Categories mega-menu, live debounced search overlay, Wishlist counter, Cart drawer trigger, and animated light/dark Theme Switch.
- **Hero Section:** GSAP entrance animation, headline reveal, primary and WhatsApp CTA buttons, 15,000+ trust indicators, and 3D gift-box keepsake showcase.
- **Category Strip:** Horizontal snap-scrolling categories populated dynamically from `/categories`.
- **Product Shelves:** Best Sellers shelf (`bestSeller=true`), New Arrivals (`newArrival=true`), and luxury dark-band Premium Collection (`premium=true`).
- **How Personalization Works:** 3-step intuitive guide showing customers how easy customization is.
- **Why TWS Gifts & Testimonials:** 4 promise pillars (free shipping > ₹999, 100% custom crafted, ribbon packaging, direct WhatsApp support) and heartfelt customer reviews with star ratings.
- **Themed Components Sheet:** Interactive design-system showcase demonstrating all variants of Button, Textfield, Dropdown, Badges, PriceTags, and InfoAlerts.
- **Shop Page (`/shop` & `/shop/:categorySlug`):** Dynamic category filter checkboxes, price range slider (₹0 - ₹10,000), collection toggles (Best Seller, New, Premium), sorting, search, and mobile bottom filter sheet.
- **Product Details (`/product/:slug`):** Multi-thumbnail image gallery with hover zoom, discount tags, sold-out state, quantity stepper, "Add to Bag", single-product "Order on WhatsApp", and mobile sticky checkout bar.
- **Cart (`/cart` & sliding drawer):** Quantity changer, item removal, special instructions/dates input, and instant WhatsApp order link builder.
- **Wishlist (`/wishlist`):** Persistent saved items with "Move All to Bag".

### 2. Chatbot Assistant ("TWS Gifts Assistant")
- Floating gift-box button at bottom right (hidden on admin pages).
- Header with online status dot and warm greeting.
- Quick-reply chips ("Birthday gifts under ₹500", "Anniversary ideas", "Personalized mugs", "Premium gifts").
- Connects to `POST /api/chat` with session message history and displays horizontal mini product cards when matches are found.
- Gracefully handles 429 rate-limiting and service downtime with friendly retry chips.

### 3. Admin & Manager Panel (`/admin/*`)
- **Login (`/admin/login`):** Split-layout branded login page connected to `POST /auth/login` (httpOnly cookie authentication).
- **Dashboard (`/admin/dashboard`):** Animated KPI cards (Total products, Active, Sold out, Categories, Managers), Recharts Area Chart for 30-day product addition trends, top contributors bar list, recent products, and activity feed.
- **Product Management (`/admin/products`):** Full catalog list with thumbnail, title, category, price, stock (red badge if 0), status, and "Added By" staff attribution.
- **Product Add / Edit Form (`/admin/products/new` & `edit/:id`):** React Hook Form + Zod schema validation, multi-file drag-drop `ImageUploader` (up to 8 images, 5MB each, ImageKit transformations), MRP comparison validation, tags chip input, and catalog visibility switches.
- **Category Management (`/admin/categories`):** Add, rename, and delete categories with friendly prevention notices when categories contain active products.
- **Team & Access Control (`/admin/team`):** Manage staff accounts, view granted permissions and granting admin timestamps, toggle active/inactive status, and open right-side 3-tab Drawer (Overview, Products Added Timeline, Access History).
- **Audit & Activity Log (`/admin/activity`):** Complete chronological event log with action filters (creations, edits, deletions, permission changes, status changes) and actor filters.

---

## 🎨 Brand Design Tokens

| Token | Light Theme | Dark Theme |
|---|---|---|
| **Background** | Warm cream `#FFF8EC` | Deep cocoa `#1C1210` |
| **Surface / Cards** | Clean white `#FFFFFF` + warm shadow | Cocoa `#2A1B17` |
| **Text Primary** | Chocolate `#4A2118` | Cream `#F8EBDD` |
| **Text Secondary** | `#8A6A60` | `#C9B1A5` |
| **Accent / CTA / "Keeps"** | Rose `#D9456B` | Soft rose `#F2758F` |
| **Soft Accent** | Blush `#F9D5DA` | `#4A2630` |
| **Detail** | Gold `#C9A24B` | Gold `#C9A24B` |

- **Headings & Prices:** `Fraunces` (soft serif)
- **UI & Body:** `DM Sans`
- **Motifs:** SVG ribbon dividers, hanging gift tags, heart wishlist animations, and warm rounded corners (16–24px).

---

## 🛠️ Tech Stack & Architecture

- **Core:** React 19, Vite 6, JavaScript
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`), RTK Query, Redux Persist (Cart, Wishlist, Theme, User Profile)
- **Styling:** Emotion + deeply customized Material UI v6 theme palette
- **Animations:** Framer Motion 12, GSAP 3 (with ScrollTrigger & timeline contexts)
- **Data Visualization:** Recharts
- **Forms & Validation:** React Hook Form + Zod
- **Date Formatting:** date-fns

---

## 📂 Folder Structure

```
Frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env                         # VITE_API_BASE_URL, VITE_WHATSAPP_NUMBER
├── .env.example
├── .eslintrc.cjs
├── .prettierrc.json
├── public/
│   ├── _redirects               # SPA routing support
│   └── assets/                  # tws-logo-mark.png, tws-logo-full.png, tws-favicon.png
└── src/
    ├── main.jsx                 # Provider, PersistGate, ThemeRoot, BrowserRouter
    ├── App.jsx                  # Suspense, AppRoutes, global Snackbar toast, auth hydration
    ├── common/                  # Reusable UI components
    │   ├── Button.jsx           # Contained, outline, white/surface, secondary
    │   ├── Textfield.jsx        # Standard, icons, validation, multiline
    │   ├── Dropdown.jsx         # Select & Autocomplete
    │   ├── Text.jsx             # Typography variants (Fraunces & DM Sans)
    │   ├── Loader.jsx           # Translucent blur full-page & container loader
    │   ├── CommonTable.jsx      # Paginated search table with action toolbar
    │   ├── DataGridBase.jsx     # Responsive table with mobile card view
    │   ├── CommonKpiCard.jsx    # Metric card with animated number counters
    │   ├── InfoAlert.jsx        # Warning, info, success, error notices
    │   ├── TabSection.jsx       # Animated underline tab switcher
    │   ├── ProductCard.jsx      # Hanging tag price, wishlist heart, add to bag
    │   ├── PriceTag.jsx         # Fraunces price, strikethrough MRP, discount %
    │   ├── Badge.jsx            # Pill badge variants (Best Seller, New, Premium, Free Shipping, Sold Out)
    │   ├── SectionHeading.jsx   # Section titles with blush pill eyebrow
    │   ├── EmptyState.jsx       # Illustrated empty collection state
    │   ├── Skeleton.jsx         # Card, grid, table, and product detail skeletons
    │   ├── ConfirmDialog.jsx    # Action confirmation modal
    │   ├── ThemeToggle.jsx      # Animated light/dark toggle
    │   ├── ImageUploader.jsx    # Multi-file drag-drop, previews, remove (max 8)
    │   ├── Rating.jsx           # 5-star customer review rating
    │   ├── RibbonDivider.jsx    # SVG curved ribbon divider with center heart
    │   ├── Reveal.jsx           # Framer Motion scroll-reveal wrapper
    │   ├── PageTransition.jsx   # Page entrance transition wrapper
    │   ├── Header.jsx           # Admin top header with user avatar & logout
    │   └── Sidebar.jsx          # Admin collapsible sidebar with permissions filter
    ├── constant/
    │   ├── appConstants.js      # API URL, WhatsApp number, roles, permissions, copy
    │   └── themeConstant.js     # Light & dark MUI themes from brand tokens
    ├── features/
    │   ├── layout/              # PublicLayoutContainer.jsx, AdminLayoutContainer.jsx
    │   ├── home/                # HomeContainer.jsx + Hero, CategoryStrip, ProductShelf, WhyUs, ...
    │   ├── shop/                # ShopContainer.jsx (Filters, search, sort, grid)
    │   ├── product/             # ProductDetailContainer.jsx, productApiSlice.js
    │   ├── cart/                # CartContainer.jsx, cartSlice.js, CartDrawer.jsx
    │   ├── wishlist/            # WishlistContainer.jsx, wishlistSlice.js
    │   ├── chatbot/             # ChatbotContainer.jsx, chatApiSlice.js, chatSlice.js
    │   ├── auth/                # LoginContainer.jsx, authApiSlice.js
    │   ├── dashboard/           # DashboardContainer.jsx, dashboardApiSlice.js
    │   ├── productManagement/   # ProductListContainer.jsx, ProductFormContainer.jsx, apiSlice
    │   ├── categoryManagement/  # CategoryContainer.jsx, categoryApiSlice.js
    │   ├── userAndPermission/   # TeamContainer.jsx, userAndPermissionApiSlice.js, modals, drawer
    │   └── activity/            # ActivityLogContainer.jsx
    ├── pages/                   # Thin page wrappers only
    ├── router/                  # AppRoutes.jsx, PrivateRoute.jsx, PublicRoute.jsx
    ├── store/
    │   ├── reduxStore.js        # configureStore + middleware registration
    │   ├── localStore.js
    │   └── redux/
    │       ├── rootReducer.js   # combineReducers for slices & RTK APIs
    │       ├── apiSliceInterceptor.js # BaseQuery with httpOnly cookie auth & loader counters
    │       └── slices/          # toastSlice.js, themeSlice.js, commonApiSlice.js
    └── utils/
        ├── helper.js            # formatCurrency, generateCartWhatsAppUrl, debounce
        ├── DateTimeFormat.js    # formatDateTime, formatRelativeTime (date-fns)
        ├── validation.js        # Form input validators
        └── imageUrl.js          # ImageKit auto-optimization & srcset generator
```

---

## 🚀 Setup & Running Locally

### 1. Install Dependencies
```bash
cd Frontend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in `Frontend/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WHATSAPP_NUMBER=919876543210
```

### 3. Run Development Server
```bash
npm run dev
```
The site will run on `http://localhost:5173/`.

### 4. Build for Production
```bash
npm run build
```
Build bundle will be emitted to `Frontend/dist/`.
