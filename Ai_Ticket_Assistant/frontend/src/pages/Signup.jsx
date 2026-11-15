import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bot, Mail, Lock, AlertCircle, ArrowRight, User } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await signup({
        name,
        email,
        password,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] mx-auto mb-4 border border-white/20">
            <Bot className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Get started with AI-powered support ticket triage
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/[0.08]">
          <div className="absolute -left-16 -top-16 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-rose-300 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Singh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 font-sans outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 font-sans outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 font-sans outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 px-4 btn-theme-primary disabled:opacity-50 text-white font-medium text-xs font-sans tracking-wide rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
