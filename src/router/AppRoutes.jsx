import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayoutContainer from '../features/layout/PublicLayoutContainer';
import AdminLayoutContainer from '../features/layout/AdminLayoutContainer';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// Lazy loaded page components
const HomePage = lazy(() => import('../pages/HomePage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductListPage = lazy(() => import('../pages/ProductListPage'));
const ProductFormPage = lazy(() => import('../pages/ProductFormPage'));
const CategoryPage = lazy(() => import('../pages/CategoryPage'));
const TeamPage = lazy(() => import('../pages/TeamPage'));
const ActivityLogPage = lazy(() => import('../pages/ActivityLogPage'));

const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Storefront Layout Routes */}
      <Route element={<PublicLayoutContainer />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:categorySlug" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* 2. Authentication & Guard Pages */}
      <Route
        path="/admin/login"
        element={<PublicRoute component={<LoginPage />} />}
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 3. Admin & Manager Panel Layout Routes */}
      <Route
        path="/admin"
        element={<PrivateRoute component={<AdminLayoutContainer />} />}
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <PrivateRoute
              component={<DashboardPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute
              component={<ProductListPage />}
              requiredPermission="product:create"
            />
          }
        />
        <Route
          path="products/new"
          element={
            <PrivateRoute
              component={<ProductFormPage />}
              requiredPermission="product:create"
            />
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PrivateRoute
              component={<ProductFormPage />}
              requiredPermission="product:create"
            />
          }
        />
        <Route
          path="categories"
          element={
            <PrivateRoute
              component={<CategoryPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="team"
          element={
            <PrivateRoute
              component={<TeamPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="activity"
          element={
            <PrivateRoute
              component={<ActivityLogPage />}
              allowedRoles={['admin']}
            />
          }
        />
      </Route>

      {/* 4. Fallback Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
