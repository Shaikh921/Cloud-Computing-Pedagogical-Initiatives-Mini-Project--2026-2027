import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { ThemeSwitcher } from './ThemeSwitcher.jsx';
import { Bot, Ticket, PlusCircle, Users, LogOut, Shield } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleStyles = {
    admin: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
    moderator: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
    user: 'bg-slate-800/60 text-slate-300 border-white/10',
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="max-w-7xl mx-auto rounded-2xl glass-panel border border-white/[0.08] px-4 sm:px-6 py-2.5 shadow-2xl relative">
        {/* Subtle top edge neon line */}
        <div
          className="absolute top-0 left-1/4 right-1/4 h-[1px] opacity-80 rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--theme-primary), transparent)',
          }}
        />

        <div className="flex items-center justify-between">
          {/* Brand Logo & AI Heartbeat */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105"
                style={{
                  background: 'var(--theme-gradient)',
                  boxShadow: 'var(--theme-glow-sm)',
                }}
              >
                <Bot className="w-5 h-5" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-950 animate-pulse"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Support<span style={{ color: 'var(--theme-text-accent)' }}>AI</span>
                </span>
                <span
                  className="text-[9px] uppercase font-mono font-semibold tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderColor: 'var(--theme-border)',
                    color: 'var(--theme-text-accent)',
                  }}
                >
                  Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans tracking-tight -mt-0.5">
                Intelligent Support Platform
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/[0.05]">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive('/dashboard')
                    ? 'bg-white/[0.08] text-white border border-white/10 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Tickets</span>
              </Link>

              <Link
                to="/tickets/new"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white transition cursor-pointer shadow-md"
                style={{
                  background: isActive('/tickets/new') ? 'var(--theme-gradient)' : 'rgba(255,255,255,0.08)',
                  borderColor: 'var(--theme-border)',
                }}
              >
                <PlusCircle className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-accent)' }} />
                <span>New Ticket</span>
              </Link>

              {isAdmin && (
                <Link
                  to="/admin/users"
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                    isActive('/admin/users')
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Team</span>
                </Link>
              )}
            </div>
          )}

          {/* Right Section: Theme Switcher & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Real-time Theme Switcher Pill */}
            <ThemeSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-medium text-slate-200 truncate max-w-[160px]">
                    {user?.name || user?.email}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      roleStyles[user?.role] || roleStyles.user
                    }`}
                  >
                    {user?.role === 'admin' && <Shield className="w-2.5 h-2.5 text-purple-400" />}
                    {user?.role || 'user'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 text-xs font-medium text-white rounded-xl transition shadow-md"
                  style={{
                    background: 'var(--theme-gradient)',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
