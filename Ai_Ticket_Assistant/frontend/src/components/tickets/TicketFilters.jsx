import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export function TicketFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}) {
  const hasActiveFilters = searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
  };

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-4 mb-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 font-sans tracking-tight outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer font-sans"
          >
            <option value="ALL" className="bg-slate-900">All Statuses</option>
            <option value="TODO" className="bg-slate-900">To Do</option>
            <option value="IN_PROGRESS" className="bg-slate-900">In Progress</option>
            <option value="RESOLVED" className="bg-slate-900">Resolved</option>
            <option value="CLOSED" className="bg-slate-900">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="glass-input text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer font-sans"
          >
            <option value="ALL" className="bg-slate-900">All Priorities</option>
            <option value="low" className="bg-slate-900">Low Priority</option>
            <option value="medium" className="bg-slate-900">Medium Priority</option>
            <option value="high" className="bg-slate-900">High Priority</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 font-sans font-medium transition cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
