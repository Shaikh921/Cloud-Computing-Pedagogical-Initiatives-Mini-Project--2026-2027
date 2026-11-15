import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LoadingSpinner } from './LoadingSpinner.jsx';
import { ShieldAlert } from 'lucide-react';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-rose-900/50 p-8 rounded-2xl max-w-md text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-950/60 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-800">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Access Denied</h2>
          <p className="text-slate-400 text-sm mb-6">
            You do not have permission to access this page. This section requires one of the following roles:{' '}
            <span className="font-semibold text-rose-300">{allowedRoles.join(', ')}</span>.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}

