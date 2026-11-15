import React, { useState, useEffect } from 'react';
import { authApi } from '../api/authApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  Shield,
  Edit2,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Terminal,
} from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editingEmail, setEditingEmail] = useState(null);
  const [editRole, setEditRole] = useState('user');
  const [editSkills, setEditSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const data = await authApi.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStartEdit = (u) => {
    setEditingEmail(u.email);
    setEditRole(u.role || 'user');
    setEditSkills(u.skills || []);
    setNewSkill('');
  };

  const handleCancelEdit = () => {
    setEditingEmail(null);
    setEditSkills([]);
    setNewSkill('');
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setEditSkills(editSkills.filter((s) => s !== skill));
  };

  const handleSave = async (email) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await authApi.updateUser({
        email,
        role: editRole,
        skills: editSkills,
      });

      setSuccess(`User ${email} updated successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      setEditingEmail(null);
      await fetchUsers(true);
    } catch (err) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const roleStyles = {
    admin: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    moderator: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    user: 'bg-slate-800/40 text-slate-300 border-white/10',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Team & Permissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Manage team roles, routing skills, and system permissions.
          </p>
        </div>

        <button
          onClick={() => fetchUsers(true)}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-xs font-sans font-medium transition cursor-pointer self-start sm:self-auto hover:border-cyan-500/30"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs font-sans flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs font-sans flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Modern Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/[0.08]">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <LoadingSpinner size="lg" />
            <p className="text-xs font-sans text-slate-400">Loading team members...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-slate-300">
              <thead className="bg-slate-950/60 text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.08]">
                <tr>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Routing Skills</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] font-sans">
                {users.map((u) => {
                  const isEditing = editingEmail === u.email;

                  return (
                    <tr key={u._id || u.email} className="hover:bg-white/[0.02] transition">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-100 font-sans text-xs">
                          {u.name || u.email.split('@')[0]}
                        </div>
                        <div className="text-[11px] text-cyan-400/80">{u.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        {isEditing ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="glass-input text-slate-100 text-xs rounded-xl px-2.5 py-1.5 outline-none font-mono"
                          >
                            <option value="user" className="bg-slate-950">User</option>
                            <option value="moderator" className="bg-slate-950">Moderator</option>
                            <option value="admin" className="bg-slate-950">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              roleStyles[u.role] || roleStyles.user
                            }`}
                          >
                            {u.role === 'admin' ? (
                              <Shield className="w-3 h-3" />
                            ) : u.role === 'moderator' ? (
                              <Terminal className="w-3 h-3" />
                            ) : null}
                            <span>{u.role || 'user'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                placeholder="Add skill..."
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                className="glass-input rounded-xl px-2.5 py-1 text-xs text-slate-200 outline-none font-sans"
                              />
                              <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs"
                              >
                                <Plus className="w-3 h-3 text-cyan-400" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {editSkills.map((s) => (
                                <span
                                  key={s}
                                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                >
                                  {s}
                                  <button
                                    onClick={() => handleRemoveSkill(s)}
                                    className="hover:text-rose-400"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : u.skills && u.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {u.skills.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/60 border border-white/10 text-cyan-300"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic font-sans">No skills assigned</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isEditing ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleSave(u.email)}
                              disabled={saving}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-slate-300 hover:text-cyan-300 text-xs font-sans font-medium transition cursor-pointer hover:border-cyan-500/30"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
