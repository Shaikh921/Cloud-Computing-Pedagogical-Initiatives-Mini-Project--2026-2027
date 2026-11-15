import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <Bot className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">Page Not Found</h2>
        <p className="text-sm text-slate-400 mb-8">
          The support view or resource you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}

