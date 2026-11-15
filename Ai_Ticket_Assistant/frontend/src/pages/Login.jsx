import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Bot, Mail, Lock, AlertCircle, ArrowRight, Sparkles, Shield, User, Terminal } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md">
        {/* Header Icon & Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.5)] mx-auto mb-4 border border-white/20">
            <Bot className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Sign In
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Sign in to access your support dashboard
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/[0.08]">
          {/* Ambient glow */}
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-rose-300 text-xs font-sans">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@supportai.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-sans outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-sans outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 btn-theme-primary disabled:opacity-50 text-white font-medium text-xs font-sans tracking-wide rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Test Indian Profiles */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Demo Accounts (Password: Pass@123):</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoFill('aarav.sharma@supportai.in', 'Pass@123')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-purple-500/30 hover:border-purple-400 text-slate-300 hover:text-white transition flex items-center justify-between font-sans cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-semibold text-purple-300">Aarav Sharma</span>
                </div>
                <span className="text-[11px] text-slate-400">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('rohan.verma@supportai.in', 'Pass@123')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-cyan-500/30 hover:border-cyan-400 text-slate-300 hover:text-white transition flex items-center justify-between font-sans cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-300">Rohan Verma</span>
                </div>
                <span className="text-[11px] text-slate-400">Mod (React/Node)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoFill('rahul.gupta@gmail.com', 'Pass@123')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-indigo-500/30 hover:border-indigo-400 text-slate-300 hover:text-white transition flex items-center justify-between font-sans cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300">Rahul Gupta</span>
                </div>
                <span className="text-[11px] text-slate-400">User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6 font-sans">
          Don't have an account?{' '}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
