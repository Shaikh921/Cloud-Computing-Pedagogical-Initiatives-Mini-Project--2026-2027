import React from 'react';
import { Clock, Loader, CheckCircle2, XCircle } from 'lucide-react';

export function StatusBadge({ status }) {
  const normalized = (status || 'TODO').toUpperCase();

  const configs = {
    TODO: {
      label: 'To Do',
      classes: 'bg-slate-800/60 text-slate-300 border-white/10',
      icon: Clock,
      dotClass: 'bg-slate-400',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: Loader,
      dotClass: 'bg-amber-400',
    },
    RESOLVED: {
      label: 'Resolved',
      classes: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      icon: CheckCircle2,
      dotClass: 'bg-emerald-400',
    },
    CLOSED: {
      label: 'Closed',
      classes: 'bg-zinc-800/40 text-zinc-400 border-white/5',
      icon: XCircle,
      dotClass: 'bg-zinc-500',
    },
  };

  const config = configs[normalized] || configs.TODO;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-tight border backdrop-blur-md ${config.classes}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {normalized === 'IN_PROGRESS' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dotClass}`} />
      </span>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
