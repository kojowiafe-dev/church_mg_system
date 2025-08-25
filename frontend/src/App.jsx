import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Admin from "./pages/auth/Admin";

import AdminDashboard from "./pages/admin/AdminDashboard";
import PastorDashboard from "./pages/pastor/PastorDashboard";
import MemberDashboard from "./pages/member/MemberDashboard";
import Profile from "./pages/admin/Profile";

import Sermon from "./Manager/Sermon";
import EventsPage from "./Manager/Events";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ContactPage from "./pages/Contact";

// Member Management Components
import MemberList from "./pages/Members/MemberList";
import MemberForm from "./pages/Members/MemberForm";
import FamilyManagement from "./pages/Members/FamilyManagement";
import AttendanceTracking from "./pages/Members/AttendanceTracking";

import ProtectedRoute from "./layouts/ProtectedRoute";
import Users from "./pages/admin/Users";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      <Route
        path="/:role/unauthorized"
        element={
          <div className="text-center mt-20 text-red-600 text-xl font-bold">
            Unauthorized access
          </div>
        }
      />

      {/* Protected Routes */}
      <Route element={<DashboardLayout role={localStorage.getItem("role")} />}>
        <Route
          path="/admin-only"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["admin", "member"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pastor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pastor"]}>
              <PastorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/home"
          element={
            <ProtectedRoute allowedRoles={["member"]}>
              <MemberDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <EventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <Sermon />
            </ProtectedRoute>
          }
        />

        {/* Member Management Routes */}
        <Route
          path="/members"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/new"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <MemberForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/families"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
              <FamilyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members/attendance"
          element={
            <ProtectedRoute allowedRoles={["admin", "pastor"]}>
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
