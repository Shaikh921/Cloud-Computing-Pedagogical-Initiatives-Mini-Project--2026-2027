import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { TicketCard } from '../components/tickets/TicketCard.jsx';
import { TicketFilters } from '../components/tickets/TicketFilters.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  Ticket,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  Clock,
  Flame,
  Inbox,
  Radio,
} from 'lucide-react';

export function Dashboard() {
  const { isStaff } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchTickets = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await ticketApi.getTickets();
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const title = ticket.title?.toLowerCase() || '';
      const desc = ticket.description?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();

      const matchesSearch = !search || title.includes(search) || desc.includes(search);
      const matchesStatus =
        statusFilter === 'ALL' || (ticket.status || 'TODO').toUpperCase() === statusFilter;
      const matchesPriority =
        priorityFilter === 'ALL' || (ticket.priority || '').toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const inProgress = tickets.filter((t) => (t.status || 'TODO').toUpperCase() === 'IN_PROGRESS').length;
    const resolved = tickets.filter((t) => (t.status || '').toUpperCase() === 'RESOLVED').length;
    const highPriority = tickets.filter((t) => (t.priority || '').toLowerCase() === 'high').length;

    return { total, inProgress, resolved, highPriority };
  }, [tickets]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Support Dashboard
            </h1>
            {isStaff && (
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text-accent)',
                }}
              >
                Staff Portal
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans">
            {isStaff
              ? 'Automated triage and skill-based moderator assignment active.'
              : 'Submit issues to trigger automated AI triage and staff routing.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchTickets(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-medium tracking-wide transition cursor-pointer hover:border-white/20"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
              style={{ color: 'var(--theme-text-accent)' }}
            />
            <span>Refresh</span>
          </button>

          <Link
            to="/tickets/new"
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-theme-primary text-xs font-semibold tracking-wide transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Metric */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Total Tickets</span>
            <div
              className="w-7 h-7 rounded-lg border flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text-accent)',
              }}
            >
              <Ticket className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
            {stats.total}
          </div>
          <span className="text-[11px] text-slate-400">Total logged issues</span>
        </div>

        {/* In Progress Metric */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-amber-400">In Progress</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-sans tracking-tight">
            {stats.inProgress}
          </div>
          <span className="text-[11px] text-slate-400">Under review or handling</span>
        </div>

        {/* Resolved Metric */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-emerald-400">Resolved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-sans tracking-tight">
            {stats.resolved}
          </div>
          <span className="text-[11px] text-slate-400">Completed & resolved</span>
        </div>

        {/* High Priority Metric */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-rose-400">High Priority</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-sans tracking-tight">
            {stats.highPriority}
          </div>
          <span className="text-[11px] text-slate-400">Requires urgent action</span>
        </div>
      </div>

      {/* Cyber Filters Bar */}
      <TicketFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-3 backdrop-blur-md">
          <Radio className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => fetchTickets()}
            className="ml-auto underline hover:text-white font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tickets Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
          <LoadingSpinner size="lg" />
          <p className="text-xs font-sans tracking-wide text-slate-500">Loading tickets...</p>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-white/10 text-slate-300 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">No tickets found</h3>
          <p className="text-xs text-slate-400 mb-6 font-sans">
            {tickets.length === 0
              ? 'No tickets yet. Create your first support ticket to get started.'
              : 'No tickets match your active search and filter criteria.'}
          </p>
          {tickets.length === 0 ? (
            <Link
              to="/tickets/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-theme-primary font-medium text-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Ticket</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl glass-panel text-slate-200 font-sans text-xs transition hover:border-white/20"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
