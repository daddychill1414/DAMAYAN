import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { gsap } from 'gsap';
import {
  BarChart3, Users, ShieldCheck, FileSearch, AlertCircle,
  Check, X, Search, Filter, ChevronDown, Eye, Clock,
  Heart, Activity, Shield, UserCheck, UserX, MailQuestion
} from 'lucide-react';

// ── Mini SVG Donut Chart ──────────────────────────────────
const DonutChart = ({ data, size = 120 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="transform -rotate-90">
      {data.map((d, i) => {
        const dashLength = (d.value / total) * circumference;
        const dashOffset = (cumulative / total) * circumference;
        cumulative += d.value;
        return (
          <circle
            key={i} cx="60" cy="60" r={radius}
            fill="none" stroke={d.color} strokeWidth="12"
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={-dashOffset}
            className="transition-all duration-700"
          />
        );
      })}
    </svg>
  );
};

// ── Confirmation Modal ───────────────────────────────────
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, variant }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-background rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-primary/10">
        <h3 className="font-sans font-bold text-xl text-primary mb-2">{title}</h3>
        <p className="font-outfit text-sm text-dark/60 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-outfit font-semibold border border-primary/10 text-dark/60 hover:bg-primary/5 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl text-sm font-outfit font-semibold text-white transition-colors ${
              variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-accent hover:bg-accent/90'
            }`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────
export const AdminDashboard = () => {
  const {
    users, needs, centers, donations, appeals, feedbacks,
    verifyCoordinator, rejectCoordinator, approveAppeal, dismissAppeal, showToast
  } = useStore();
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState({ isOpen: false, action: null, userId: null, title: '', message: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.admin-fade', { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  // ── Computed Stats ──
  const coordinators = users.filter(u => u.role === 'Coordinator');
  const pendingCoords = coordinators.filter(u => u.status === 'pending');
  const approvedCoords = coordinators.filter(u => u.status === 'approved');
  const rejectedCoords = coordinators.filter(u => u.status === 'rejected');
  const donors = users.filter(u => u.role === 'Donor');
  const admins = users.filter(u => u.role === 'Admin');
  const pendingAppeals = appeals.filter(a => a.status === 'pending');

  const totalRequested = needs.reduce((sum, n) => sum + n.requested, 0);
  const totalDelivered = needs.reduce((sum, n) => sum + n.delivered, 0);

  const roleData = [
    { label: 'Admins', value: admins.length, color: '#7B61FF' },
    { label: 'Coordinators', value: coordinators.length, color: '#2E4036' },
    { label: 'Donors', value: donors.length, color: '#CC5833' },
  ];

  // ── Filtered users for User Management tab ──
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && u.status === filterStatus;
  });

  // ── Filtered coordinators for Verification tab ──
  const filteredCoords = coordinators.filter(u => {
    if (filterStatus === 'all') return true;
    return u.status === filterStatus;
  });

  const handleVerify = (userId) => {
    setModal({
      isOpen: true, action: 'verify', userId,
      title: 'Approve Coordinator',
      message: 'This will grant full coordinator access to this user. They will be able to manage evacuation centers and logistics.'
    });
  };

  const handleReject = (userId) => {
    if (showRejectInput !== userId) {
      setShowRejectInput(userId);
      return;
    }
    verifyAction('reject', userId);
  };

  const verifyAction = (action, userId) => {
    if (action === 'verify') {
      verifyCoordinator(userId || modal.userId);
      showToast('Coordinator approved successfully', 'success');
    } else {
      rejectCoordinator(userId || modal.userId, rejectReason || 'Insufficient verification documents');
      showToast('Coordinator rejected', 'warning');
      setShowRejectInput(null);
      setRejectReason('');
    }
    setModal({ isOpen: false });
  };

  const handleAppealAction = (appealId, action) => {
    if (action === 'approve') {
      approveAppeal(appealId);
      showToast('Appeal approved — coordinator moved back to pending review', 'success');
    } else {
      dismissAppeal(appealId);
      showToast('Appeal dismissed', 'warning');
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'verification', label: 'Verification', icon: ShieldCheck, badge: pendingCoords.length },
    { id: 'users', label: 'All Users', icon: Users, badge: null },
    { id: 'appeals', label: 'Appeals', icon: MailQuestion, badge: pendingAppeals.length },
  ];

  return (
    <div ref={containerRef} className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-[90vh] bg-background">
      <ConfirmModal
        isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false })}
        onConfirm={() => verifyAction(modal.action, modal.userId)}
        title={modal.title} message={modal.message}
        confirmText={modal.action === 'verify' ? 'Approve' : 'Reject'}
        variant={modal.action === 'reject' ? 'danger' : 'default'}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-fade flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent"></div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Administration</span>
            </div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Admin Center</h1>
            <p className="font-outfit text-dark/60 text-base">Manage user verification, monitor system analytics, and oversee the Damayan network.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-60 shrink-0">
            <div className="flex lg:flex-col gap-2 font-outfit text-sm font-semibold overflow-x-auto pb-2 lg:pb-0">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFilterStatus('all'); setSearchQuery(''); }}
                  className={`p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3 whitespace-nowrap relative ${
                    activeTab === tab.id ? 'bg-primary text-background shadow-lg' : 'hover:bg-primary/5 text-dark/60'
                  }`}>
                  <tab.icon size={18} /> {tab.label}
                  {tab.badge > 0 && (
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === tab.id ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                    }`}>{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* ═══ ANALYTICS TAB ═══ */}
            {activeTab === 'analytics' && (
              <div key="analytics">
                {/* Stats Cards */}
                <div className="admin-fade grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
                    { label: 'Pending Verification', value: pendingCoords.length, icon: Clock, color: 'text-yellow-600' },
                    { label: 'Active Coordinators', value: approvedCoords.length, icon: UserCheck, color: 'text-green-600' },
                    { label: 'Total Donations', value: donations.length, icon: Heart, color: 'text-accent' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5">
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon size={18} className="text-dark/30" />
                        {stat.label === 'Pending Verification' && stat.value > 0 && (
                          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                        )}
                      </div>
                      <p className={`font-sans font-bold text-3xl ${stat.color}`}>{stat.value}</p>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-dark/40 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="admin-fade grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Distribution */}
                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h3 className="font-sans font-bold text-lg text-primary mb-6">User Distribution</h3>
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <DonutChart data={roleData} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="font-sans font-bold text-2xl text-primary">{users.length}</p>
                            <p className="font-mono text-[8px] uppercase text-dark/40">Total</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3 flex-1">
                        {roleData.map((d, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                              <span className="font-outfit text-sm text-dark/70">{d.label}</span>
                            </div>
                            <span className="font-mono text-sm font-bold text-primary">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Network Overview */}
                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h3 className="font-sans font-bold text-lg text-primary mb-6">Network Overview</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Evacuation Centers', value: centers.length, sub: `${centers.filter(c => c.status === 'Critical').length} critical`, icon: Activity },
                        { label: 'Items Requested', value: totalRequested, sub: `${totalDelivered} delivered`, icon: BarChart3 },
                        { label: 'Coordinator Verification', value: `${approvedCoords.length}/${coordinators.length}`, sub: `${pendingCoords.length} pending`, icon: ShieldCheck },
                        { label: 'Active Appeals', value: pendingAppeals.length, sub: `${appeals.length} total`, icon: AlertCircle },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-background/50 rounded-xl">
                          <div className="p-2.5 bg-primary/5 rounded-lg">
                            <item.icon size={16} className="text-primary/50" />
                          </div>
                          <div className="flex-1">
                            <p className="font-outfit text-sm font-semibold text-primary">{item.label}</p>
                            <p className="font-mono text-[10px] text-dark/40">{item.sub}</p>
                          </div>
                          <p className="font-sans font-bold text-xl text-primary">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="admin-fade bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5 mt-6">
                  <h3 className="font-sans font-bold text-lg text-primary mb-4">Recent Registrations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/5">
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 pb-3 pr-4">Name</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 pb-3 pr-4">Email</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 pb-3 pr-4">Role</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 pb-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(-5).reverse().map(u => (
                          <tr key={u.id} className="border-b border-primary/5 last:border-0">
                            <td className="py-3 pr-4 font-outfit text-sm text-primary font-semibold">{u.name}</td>
                            <td className="py-3 pr-4 font-mono text-xs text-dark/50">{u.email}</td>
                            <td className="py-3 pr-4">
                              <span className={`font-mono text-[10px] px-2 py-1 rounded-full ${
                                u.role === 'Admin' ? 'bg-violet-100 text-violet-600' :
                                u.role === 'Coordinator' ? 'bg-primary/10 text-primary' :
                                'bg-accent/10 text-accent'
                              }`}>{u.role}</span>
                            </td>
                            <td className="py-3">
                              <span className={`font-mono text-[10px] px-2 py-1 rounded-full ${
                                u.status === 'active' || u.status === 'approved' ? 'bg-green-100 text-green-600' :
                                u.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>{u.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ VERIFICATION TAB ═══ */}
            {activeTab === 'verification' && (
              <div key="verification">
                {/* Filter Bar */}
                <div className="admin-fade flex flex-wrap items-center gap-3 mb-6">
                  {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button key={status} onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 rounded-xl font-outfit text-xs font-semibold transition-all ${
                        filterStatus === status ? 'bg-primary text-background shadow-md' : 'bg-white border border-primary/10 text-dark/50 hover:bg-primary/5'
                      }`}>
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                      {status === 'pending' && pendingCoords.length > 0 && (
                        <span className="ml-2 bg-accent/20 text-accent px-1.5 py-0.5 rounded-full text-[9px]">{pendingCoords.length}</span>
                      )}
                    </button>
                  ))}
                </div>

                {filteredCoords.length === 0 ? (
                  <div className="admin-fade bg-white rounded-2xl p-12 border border-primary/5 text-center">
                    <ShieldCheck size={40} className="text-dark/20 mx-auto mb-4" />
                    <p className="font-outfit text-dark/50">No coordinators found with this filter.</p>
                  </div>
                ) : (
                  <div className="admin-fade space-y-4">
                    {filteredCoords.map(coord => (
                      <div key={coord.id} className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* User Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="font-sans font-bold text-lg text-primary">{coord.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-sans font-bold text-base text-primary">{coord.name}</h4>
                              <p className="font-mono text-[11px] text-dark/40">{coord.email}</p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg">
                              <Activity size={12} className="text-primary/50" />
                              <span className="font-mono text-[10px] text-dark/60">{coord.barangay || 'N/A'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg">
                              <Shield size={12} className="text-primary/50" />
                              <span className="font-mono text-[10px] text-dark/60">{coord.position || 'N/A'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg">
                              <FileSearch size={12} className="text-primary/50" />
                              <span className="font-mono text-[10px] text-dark/60">{coord.documentName || 'No doc'}</span>
                            </span>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`font-mono text-[10px] px-3 py-1.5 rounded-full font-bold uppercase ${
                              coord.status === 'approved' ? 'bg-green-100 text-green-600' :
                              coord.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>{coord.status}</span>

                            {coord.status === 'pending' && (
                              <>
                                <button onClick={() => handleVerify(coord.id)}
                                  className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors" title="Approve">
                                  <Check size={16} />
                                </button>
                                <button onClick={() => handleReject(coord.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors" title="Reject">
                                  <X size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rejection reason input */}
                        {showRejectInput === coord.id && (
                          <div className="mt-4 flex gap-3">
                            <input
                              type="text" value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection (optional)"
                              className="flex-1 bg-background border border-primary/10 rounded-xl px-4 py-2 font-outfit text-sm outline-none focus:border-red-400"
                            />
                            <button onClick={() => verifyAction('reject', coord.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-xl font-outfit text-sm font-semibold hover:bg-red-600 transition-colors">
                              Confirm Reject
                            </button>
                            <button onClick={() => { setShowRejectInput(null); setRejectReason(''); }}
                              className="px-4 py-2 bg-background border border-primary/10 rounded-xl font-outfit text-sm text-dark/50 hover:bg-primary/5 transition-colors">
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Applied date */}
                        <div className="mt-3 pt-3 border-t border-primary/5">
                          <span className="font-mono text-[9px] text-dark/30 uppercase">
                            Applied: {coord.createdAt ? new Date(coord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ ALL USERS TAB ═══ */}
            {activeTab === 'users' && (
              <div key="users">
                {/* Search & Filter */}
                <div className="admin-fade flex flex-wrap gap-3 mb-6">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark/30" />
                    <input
                      type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-white border border-primary/10 rounded-xl pl-10 pr-4 py-2.5 font-outfit text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="relative">
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                      className="bg-white border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent appearance-none pr-8">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark/30 pointer-events-none" />
                  </div>
                </div>

                {/* Users Table */}
                <div className="admin-fade bg-white rounded-2xl border border-primary/5 shadow-lg shadow-primary/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-background/50 border-b border-primary/5">
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 p-4">User</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 p-4">Email</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 p-4">Role</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 p-4">Status</th>
                          <th className="text-left font-mono text-[9px] uppercase tracking-widest text-dark/40 p-4">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(u => (
                          <tr key={u.id} className="border-b border-primary/5 last:border-0 hover:bg-background/30 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="font-sans font-bold text-sm text-primary">{u.name.charAt(0)}</span>
                                </div>
                                <span className="font-outfit text-sm font-semibold text-primary">{u.name}</span>
                              </div>
                            </td>
                            <td className="p-4 font-mono text-xs text-dark/50">{u.email}</td>
                            <td className="p-4">
                              <span className={`font-mono text-[10px] px-2.5 py-1 rounded-full ${
                                u.role === 'Admin' ? 'bg-violet-100 text-violet-600' :
                                u.role === 'Coordinator' ? 'bg-primary/10 text-primary' :
                                'bg-accent/10 text-accent'
                              }`}>{u.role}</span>
                            </td>
                            <td className="p-4">
                              <span className={`font-mono text-[10px] px-2.5 py-1 rounded-full ${
                                u.status === 'active' || u.status === 'approved' ? 'bg-green-100 text-green-600' :
                                u.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-red-100 text-red-600'
                              }`}>{u.status}</span>
                            </td>
                            <td className="p-4 font-mono text-[11px] text-dark/40">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                      <Users size={32} className="text-dark/15 mx-auto mb-3" />
                      <p className="font-outfit text-dark/40 text-sm">No users match your search.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ APPEALS TAB ═══ */}
            {activeTab === 'appeals' && (
              <div key="appeals">
                {appeals.length === 0 ? (
                  <div className="admin-fade bg-white rounded-2xl p-12 border border-primary/5 text-center">
                    <MailQuestion size={40} className="text-dark/20 mx-auto mb-4" />
                    <p className="font-outfit text-dark/50">No appeals have been submitted yet.</p>
                  </div>
                ) : (
                  <div className="admin-fade space-y-4">
                    {appeals.map(appeal => {
                      const user = users.find(u => u.id === appeal.userId);
                      return (
                        <div key={appeal.id} className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                          <div className="flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <span className="font-sans font-bold text-primary">{user?.name?.charAt(0) || '?'}</span>
                                </div>
                                <div>
                                  <h4 className="font-sans font-bold text-sm text-primary">{user?.name || 'Unknown User'}</h4>
                                  <p className="font-mono text-[10px] text-dark/40">{user?.email} • {user?.barangay}</p>
                                </div>
                              </div>

                              <div className="bg-background/50 rounded-xl p-4 mb-3">
                                <h5 className="font-mono text-[9px] uppercase tracking-widest text-dark/40 mb-2">Appeal Reason</h5>
                                <p className="font-outfit text-sm text-dark/70">{appeal.reason}</p>
                              </div>

                              <div className="flex items-center gap-3 text-[10px] font-mono text-dark/30">
                                <span>Submitted: {new Date(appeal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span>•</span>
                                <span className={`px-2 py-0.5 rounded-full ${
                                  appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                  appeal.status === 'approved' ? 'bg-green-100 text-green-600' :
                                  'bg-red-100 text-red-600'
                                }`}>{appeal.status}</span>
                              </div>
                            </div>

                            {appeal.status === 'pending' && (
                              <div className="flex gap-2 shrink-0">
                                <button onClick={() => handleAppealAction(appeal.id, 'approve')}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-xl font-outfit text-xs font-semibold hover:bg-green-200 transition-colors">
                                  <Check size={14} /> Approve
                                </button>
                                <button onClick={() => handleAppealAction(appeal.id, 'dismiss')}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-xl font-outfit text-xs font-semibold hover:bg-red-200 transition-colors">
                                  <X size={14} /> Dismiss
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
