import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { CreateTicket } from './pages/CreateTicket.jsx';
import { TicketDetail } from './pages/TicketDetail.jsx';
import { AdminUsers } from './pages/AdminUsers.jsx';
import { NotFound } from './pages/NotFound.jsx';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-500">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<RootRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets/new"
                  element={
                    <ProtectedRoute>
                      <CreateTicket />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets/:id"
                  element={
                    <ProtectedRoute>
                      <TicketDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
