import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/public/Home';
import { ServiceList } from '../pages/public/ServiceList';
import { ProviderDetail } from '../pages/public/ProviderDetail';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { CustomerDashboard } from '../pages/customer/CustomerDashboard';
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServiceList />} />
      <Route path="/provider/:id" element={<ProviderDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Role-Protected Dashboards */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['customer', 'admin']}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={['provider', 'admin']}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
