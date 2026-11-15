import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { PriorityBadge } from '../components/common/PriorityBadge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
  Cpu,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Shield,
} from 'lucide-react';

export function TicketDetail() {
  const { id } = useParams();
  const { isStaff, user } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editStatus, setEditStatus] = useState('TODO');
  const [editPriority, setEditPriority] = useState('medium');
  const [editNotes, setEditNotes] = useState('');

  const fetchTicket = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await ticketApi.getTicket(id);
      const t = data.ticket;
      setTicket(t);
      if (t) {
        setEditStatus(t.status || 'TODO');
        setEditPriority(t.priority || 'medium');
        setEditNotes(t.helpfulNotes || '');
      }
    } catch (err) {
      setError(err.message || 'Failed to load ticket.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await ticketApi.updateTicket(id, {
        status: editStatus,
        priority: editPriority,
        helpfulNotes: editNotes,
      });
      setTicket(response.ticket);
      setSuccessMessage('Ticket state updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update ticket state.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseTicket = async () => {
    setUpdating(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await ticketApi.updateTicket(id, {
        status: 'CLOSED',
      });
      setTicket(response.ticket);
      setEditStatus('CLOSED');
      setSuccessMessage('Ticket marked as closed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to close ticket.');
    } finally {
      setUpdating(false);
    }
  };

  const isOwner = ticket?.createdBy && (
    (typeof ticket.createdBy === 'object' ? ticket.createdBy._id : ticket.createdBy) === (user?.id || user?._id)
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <LoadingSpinner size="lg" />
        <p className="text-xs font-sans text-slate-400">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket && !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl glass-panel text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Record Not Found</h2>
        <p className="text-xs text-slate-400 mb-6 font-sans">
          Ticket ID does not exist or access authorization is restricted.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans font-medium transition shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const skills = ticket.relatedSkills || [];
  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Recent';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      {/* Top Navigation & Refresh */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tickets</span>
        </Link>

        <button
          onClick={() => fetchTicket(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-sans transition cursor-pointer hover:border-white/20"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-3 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-sans flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <div className="ml-auto text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 tracking-tight leading-snug">
              {ticket.title}
            </h1>

            <div className="border-t border-white/[0.08] pt-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-300 text-xs whitespace-pre-wrap leading-relaxed font-sans">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* AI Diagnostic Assessment Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 text-slate-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 tracking-tight flex items-center gap-2">
                  <span>AI Triage & Suggested Resolution</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300 border border-white/10">
                    Gemini
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  Automated diagnostic notes generated upon ticket submission
                </p>
              </div>
            </div>

            {ticket.priority || ticket.helpfulNotes || skills.length > 0 ? (
              <div className="space-y-5">
                {/* AI Troubleshooting Notes */}
                {ticket.helpfulNotes && (
                  <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Suggested Troubleshooting & Root Cause</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {ticket.helpfulNotes}
                    </div>
                  </div>
                )}

                {/* Extracted Skills */}
                {skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                      <Cpu className="w-3.5 h-3.5 text-slate-400" />
                      <span>Required Skills</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 text-xs font-sans"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 px-4 bg-slate-900/50 rounded-2xl border border-white/[0.05]">
                <LoadingSpinner size="md" className="mx-auto mb-2 text-slate-400" />
                <h4 className="text-xs font-semibold text-slate-300 mb-1">
                  Triage in progress...
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  AI is analyzing the report and matching required skills.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar (1 col): Metadata & Resolution */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Ticket Details
            </h3>

            <div className="space-y-3 text-xs font-sans">
              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Ticket ID</span>
                <span className="text-slate-200 font-mono text-[11px]">{ticket._id?.slice(-8)}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Status</span>
                <StatusBadge status={ticket.status} />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Priority</span>
                <PriorityBadge priority={ticket.priority} />
              </div>

              <div className="flex flex-col gap-1 py-2 border-b border-white/[0.06]">
                <span className="text-slate-400">Assignee</span>
                <div className="flex items-center gap-1.5 font-medium text-slate-200 mt-0.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    {ticket.assignedTo
                      ? ticket.assignedTo.name || ticket.assignedTo.email || ticket.assignedTo
                      : 'Unassigned'}
                  </span>
                </div>
              </div>

              {ticket.createdBy && (
                <div className="flex flex-col gap-1 py-2">
                  <span className="text-slate-400">Created By</span>
                  <span className="font-medium text-slate-300 truncate">
                    {ticket.createdBy.name || ticket.createdBy.email || ticket.createdBy}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Staff Control Panel */}
          {isStaff && (
            <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Staff Controls
                </h3>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Update Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-200 font-sans outline-none"
                  >
                    <option value="TODO" className="bg-slate-900">To Do</option>
                    <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
                    <option value="RESOLVED" className="bg-slate-900">Resolved</option>
                    <option value="CLOSED" className="bg-slate-900">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Update Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="w-full glass-input rounded-xl px-3 py-2 text-xs text-slate-200 font-sans outline-none"
                  >
                    <option value="low" className="bg-slate-900">Low Priority</option>
                    <option value="medium" className="bg-slate-900">Medium Priority</option>
                    <option value="high" className="bg-slate-900">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Internal Staff Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add internal resolution notes or steps..."
                    className="w-full glass-input rounded-xl p-3 text-xs text-slate-200 font-sans outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="w-full py-2.5 px-4 btn-theme-primary text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* End-User Creator Resolution Panel */}
          {!isStaff && isOwner && ticket.status !== 'CLOSED' && (
            <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/10 space-y-3">
              <h3 className="text-xs font-sans font-semibold text-slate-200 uppercase tracking-wider">
                Ticket Management
              </h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                If your issue has been addressed or you no longer require assistance, you can close this ticket.
              </p>
              <button
                type="button"
                onClick={handleCloseTicket}
                disabled={updating}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-sans font-medium transition cursor-pointer disabled:opacity-50 border border-white/10 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Closing Ticket...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark Issue as Closed</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
