import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi.js';
import {
  Bot,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export function CreateTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const presets = [
    {
      title: 'MongoDB Connection Pool Exhaustion on High Throughput Microservice',
      description:
        'The Mongoose connection pool reaches 100 max connections during 10 AM traffic surge, triggering MongoServerSelectionError timeouts across write clusters. Need connection pooling optimization with Mongoose.',
    },
    {
      title: 'React 19 Server Components SSR Hydration Error #418 in Production',
      description:
        'Localized timestamp rendering causes React to throw client/server DOM mismatch warning during hydration. The component tree flickers and triggers a full client re-mount.',
    },
    {
      title: 'Kubernetes Pod OOMKilled in Background Ingestion Cluster',
      description:
        'The ingestion worker pod was terminated with exit code 137 (OOMKilled) after buffering a 4.2GB bulk CSV payload in heap memory. HPA failed to scale worker nodes.',
    },
  ];

  const handleApplyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and a detailed description.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await ticketApi.createTicket({ title, description });
      const createdId = response.ticket?._id;
      if (createdId) {
        navigate(`/tickets/${createdId}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit ticket.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Tickets</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              New Support Ticket
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Describe the issue in detail. Our automated pipeline will analyze priority, suggest resolution notes, and route to the best-fit engineer.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-start gap-2.5 text-rose-300 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory leak in Node.js event listener on socket close"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-400 font-sans outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Include steps to reproduce, affected versions, stack traces, and environment details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-input rounded-xl p-4 text-xs text-slate-100 placeholder-slate-400 font-sans outline-none resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 btn-theme-primary disabled:opacity-50 text-white font-sans text-xs font-semibold tracking-wide rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Create Ticket</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick presets */}
          <div className="glass-panel rounded-2xl p-5 border border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>Sample Issue Templates (Click to fill):</span>
            </div>
            <div className="space-y-2">
              {presets.map((preset, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full text-left p-3 rounded-xl bg-slate-900/50 border border-white/[0.05] hover:border-white/20 transition group cursor-pointer"
                >
                  <p className="text-xs font-medium text-slate-200 group-hover:text-white line-clamp-1 mb-0.5">
                    {preset.title}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-sans">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Info: Workflow Info */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 text-slate-300 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-100 text-xs uppercase tracking-wider">
                Automated Workflow
              </h3>
            </div>

            <p className="text-xs text-slate-400 font-sans mb-5 leading-relaxed">
              Once submitted, our triage system processes your ticket in 4 steps:
            </p>

            <div className="space-y-3.5 text-xs font-sans">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px]">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 text-xs">Database Ingestion</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Logged securely in database.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px]">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 text-xs">AI Diagnostic Analysis</h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Estimates urgency and generates troubleshooting notes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px]">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 text-xs">Skill-Based Assignment</h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Routes to the best-qualified moderator with the lowest current workload.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 text-[10px]">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-slate-200 text-xs">Staff Notification</h4>
                  <p className="text-[11px] text-slate-400 font-sans">Sends an alert to the assigned engineer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
