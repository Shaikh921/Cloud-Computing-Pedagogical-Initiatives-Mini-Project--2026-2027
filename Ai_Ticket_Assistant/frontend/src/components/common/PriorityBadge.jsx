import React from 'react';
import { Flame, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

export function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-tight bg-purple-500/10 text-purple-300 border border-purple-500/30 backdrop-blur-md">
        <Sparkles className="w-3 h-3 text-purple-400" />
        Analyzing...
      </span>
    );
  }

  const normalized = priority.toLowerCase();

  const configs = {
    low: {
      label: 'Low Priority',
      classes: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      icon: ArrowDown,
    },
    medium: {
      label: 'Medium Priority',
      classes: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      icon: ArrowUp,
    },
    high: {
      label: 'High Priority',
      classes: 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-semibold',
      icon: Flame,
    },
  };

  const config = configs[normalized] || configs.medium;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-sans font-medium tracking-tight border backdrop-blur-md ${config.classes}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}
