import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { PriorityBadge } from '../common/PriorityBadge.jsx';
import { Calendar, User, ChevronRight, Tag } from 'lucide-react';

export function TicketCard({ ticket }) {
  const skills = ticket.relatedSkills || [];
  const formattedDate = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : 'Recent';

  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="group block glass-panel glass-panel-hover rounded-2xl p-5 relative overflow-hidden"
    >
      {/* Badges Bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition line-clamp-1 mb-2 tracking-tight">
        {ticket.title}
      </h3>

      {/* Description Snippet */}
      <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed font-sans">
        {ticket.description}
      </p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <Tag className="w-3 h-3" />
            <span>Skills:</span>
          </div>
          {skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/[0.08] text-slate-300"
            >
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-[11px] text-slate-400">+{skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <div className="w-4 h-4 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shrink-0">
            <User className="w-2.5 h-2.5 text-slate-400" />
          </div>
          <span className="truncate">
            {ticket.assignedTo
              ? ticket.assignedTo.name || ticket.assignedTo.email || ticket.assignedTo
              : 'Unassigned'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-white font-medium group-hover:translate-x-0.5 transition-all">
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
