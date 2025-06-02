import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import PastorDashboard from './pages/pastor/PastorDashboard';
import MemberDashboard from './pages/member/MemberDashboard';
// import MemberProfile from './pages/member/MemberProfile';
import Profile from './pages/admin/Profile';

import Sermon from './Manager/Sermon';
import EventsPage from './Manager/Events';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Member Management Components
import MemberList from './pages/Members/MemberList';
import MemberForm from './pages/Members/MemberForm';
import FamilyManagement from './pages/Members/FamilyManagement';
import AttendanceTracking from './pages/Members/AttendanceTracking';

// import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRoute from './layouts/ProtectedRoute';
import Users from './pages/admin/Users';
// import SermonManager from './Manager/SermonManager';
// import EventManager from './Manager/EventManager';
// import Register from './pages/auth/Register';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/admin/register" element={<AdminRegister />} /> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/pastor/login" element={<PastorLogin />} />
        <Route path="/pastor/register" element={<PastorRegister />} />
        <Route path="/member/login" element={<MemberLogin />} />
        <Route path="/member/register" element={<MemberRegister />} /> */}
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/:role/unauthorized" element={<div className='text-center mt-20 text-red-600 text-xl font-bold'>Unauthorized access</div>} />

      {/* Protected Routes */}
      <Route element={<DashboardLayout role={localStorage.getItem("role")} />}>
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pastor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['pastor']}>
              <PastorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/home"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/member/profile"
          element={
            <ProtectedRoute allowedRoles={['member']}>
              <MemberProfile/>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <Sermon />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/create"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <SermonManager />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/create-event"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <EventManager />
            </ProtectedRoute>
          }
        /> */}

        {/* Member Management Routes */}
        <Route
          path="/members"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/new"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/families"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <FamilyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/attendance"
          element={
            <ProtectedRoute allowedRoles={['admin', 'pastor']}>
              <AttendanceTracking />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
