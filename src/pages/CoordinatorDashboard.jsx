import React, { useState } from 'react';
import { useStore } from '../store';
import { Package, CheckCircle, Clock, AlertTriangle, Plus, MapPin, QrCode, XCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UrgencyBadge, StatusBadge } from '../components/UrgencyBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Helper for relative time
const getRelativeTime = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

export const CoordinatorDashboard = () => {
  const { needs, pledges, donationHistory, barangay, postNeed, closeNeed, adjustNeedQuantity, isProcessing, setProcessing } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, post, needs, history, qr
  const [newNeed, setNewNeed] = useState({ itemName: '', category: 'Food', quantity: '', urgency: 'stable', dropOffPoint: barangay.name + ' Hall' });
  
  // Dialog state
  const [confirmState, setConfirmState] = useState({ open: false, type: null, needId: null });

  const activeNeeds = needs.filter(n => n.status === 'active');
  const fulfilledNeeds = needs.filter(n => n.status === 'fulfilled');
  const pendingPledges = pledges.filter(p => p.status === 'reserved');
  const expiredPledges = pledges.filter(p => p.status === 'expired');
  const verifiedPledges = pledges.filter(p => p.status.startsWith('verified'));

  const handlePostNeed = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
    postNeed({ ...newNeed, quantity: parseInt(newNeed.quantity) });
    setProcessing(false);
    setNewNeed({ ...newNeed, itemName: '', quantity: '' });
    setActiveTab('needs');
  };

  const handleConfirmAction = () => {
    const { type, needId } = confirmState;
    if (type === 'close') {
      closeNeed(needId);
    } else if (type === 'walkin') {
      adjustNeedQuantity(needId, 1);
    }
    setConfirmState({ open: false, type: null, needId: null });
  };

  const getConfirmProps = () => {
    const need = needs.find(n => n.id === confirmState.needId);
    if (confirmState.type === 'close') {
      return {
        title: 'Close Need Request?',
        message: `Are you sure you want to close the request for "${need?.itemName}"? It will be removed from the public board.`,
        confirmLabel: 'Yes, Close Need',
        variant: 'danger',
      };
    }
    if (confirmState.type === 'walkin') {
      return {
        title: 'Add Walk-in Donation?',
        message: `Confirm adding +1 unit to "${need?.itemName}" without a pledge QR. This cannot be easily undone.`,
        confirmLabel: 'Add +1 Walk-in',
        variant: 'info',
        icon: Plus
      };
    }
    return {};
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'post', label: 'Post Need' },
    { id: 'needs', label: 'Needs Tracker' },
    { id: 'history', label: 'Donation Logs' },
    { id: 'qr', label: 'Community QR' },
  ];

  return (
    <div className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Coordinator Operations</span>
          </div>
          <h1 className="font-sans font-bold text-4xl text-primary mb-2">{barangay.name}</h1>
          <p className="font-outfit text-neutralGray">{barangay.coordinatorName} • {barangay.position}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-neutralGray/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-t-xl font-outfit text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-primary text-background'
                  : 'bg-transparent text-neutralGray hover:bg-neutralGray/10'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[50vh]">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-neutralGray/20 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Package size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{activeNeeds.length}</h3>
                <p className="font-outfit text-sm text-neutralGray uppercase tracking-wider">Active Needs</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutralGray/20 shadow-sm">
                <div className="w-12 h-12 bg-urgency-stable/10 rounded-2xl flex items-center justify-center text-urgency-stable mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{verifiedPledges.length}</h3>
                <p className="font-outfit text-sm text-neutralGray uppercase tracking-wider">Verified Deliveries</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutralGray/20 shadow-sm">
                <div className="w-12 h-12 bg-urgency-warning/10 rounded-2xl flex items-center justify-center text-urgency-warning mb-4">
                  <Clock size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{pendingPledges.length}</h3>
                <p className="font-outfit text-sm text-neutralGray uppercase tracking-wider">Pending Pledges</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-urgency-critical/20 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 bg-urgency-critical/10 rounded-2xl flex items-center justify-center text-urgency-critical mb-4">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{expiredPledges.length}</h3>
                <p className="font-outfit text-sm text-neutralGray uppercase tracking-wider">Expired / No-Show</p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-urgency-critical/5 rounded-full blur-2xl"></div>
              </div>
            </div>
          )}

          {/* POST NEED TAB */}
          {activeTab === 'post' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] border border-neutralGray/20 shadow-xl">
              <h2 className="font-sans font-bold text-2xl text-primary mb-6">Post New Shortage</h2>
              <form onSubmit={handlePostNeed} className="space-y-5">
                <div>
                  <label className="block font-outfit text-sm font-semibold text-primary mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newNeed.itemName}
                    onChange={e => setNewNeed({ ...newNeed, itemName: e.target.value })}
                    placeholder="e.g. 10L Drinking Water"
                    className="w-full bg-background border border-neutralGray/20 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block font-outfit text-sm font-semibold text-primary mb-2">Category</label>
                    <select
                      value={newNeed.category}
                      onChange={e => setNewNeed({ ...newNeed, category: e.target.value })}
                      className="w-full bg-background border border-neutralGray/20 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                    >
                      <option>Food</option>
                      <option>Water</option>
                      <option>Medicine</option>
                      <option>Hygiene</option>
                      <option>Clothing</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-outfit text-sm font-semibold text-primary mb-2">Quantity Needed</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newNeed.quantity}
                      onChange={e => setNewNeed({ ...newNeed, quantity: e.target.value })}
                      placeholder="e.g. 50"
                      className="w-full bg-background border border-neutralGray/20 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-outfit text-sm font-semibold text-primary mb-2">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['critical', 'moderate', 'stable'].map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setNewNeed({ ...newNeed, urgency: u })}
                        className={`py-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-colors border ${newNeed.urgency === u
                            ? 'bg-primary text-background border-primary'
                            : 'bg-transparent text-neutralGray border-neutralGray/20 hover:border-neutralGray/40'
                          }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-outfit text-sm font-semibold text-primary mb-2">Drop-Off Location</label>
                  <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3 focus-within:border-accent">
                    <MapPin size={16} className="text-neutralGray" />
                    <input
                      type="text"
                      required
                      value={newNeed.dropOffPoint}
                      onChange={e => setNewNeed({ ...newNeed, dropOffPoint: e.target.value })}
                      className="w-full bg-transparent font-outfit text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex flex-col gap-3">
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-background py-4 rounded-xl font-outfit font-bold text-sm hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? <LoadingSpinner label="Publishing..." /> : <><Plus size={18} /> Publish Need</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewNeed({ itemName: '', category: 'Food', quantity: '', urgency: 'stable', dropOffPoint: barangay.name + ' Hall' })}
                    disabled={isProcessing}
                    className="w-full py-3 bg-white text-primary rounded-xl font-outfit font-bold text-sm hover:bg-neutralGray/5 border-2 border-neutralGray/20 transition-colors disabled:opacity-50"
                  >
                    Clear Form
                  </button>
                  <p className="font-outfit text-[10px] text-neutralGray text-center mt-1">
                    Ensure physical storage space is available before posting.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* NEEDS TRACKER TAB */}
          {activeTab === 'needs' && (
            <div className="bg-white rounded-3xl border border-neutralGray/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-outfit text-sm">
                  <thead>
                    <tr className="bg-background/50 border-b border-neutralGray/10">
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Item & Status</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Urgency</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Progress</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {needs.map(need => {
                      const remaining = Math.max(0, need.quantityNeeded - need.quantityPledged - need.quantityDelivered);
                      const isFulfilled = need.status === 'fulfilled' || need.status === 'closed';

                      return (
                        <tr key={need.id} className={isFulfilled ? 'bg-background/30 opacity-70' : 'hover:bg-background/30 transition-colors'}>
                          <td className="px-6 py-4">
                            <p className="font-sans font-bold text-primary text-base mb-1">{need.itemName}</p>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-neutralGray uppercase bg-neutralGray/10 px-2 rounded-full">{need.category}</span>
                              <StatusBadge status={need.status} />
                            </div>
                            <p className="font-mono text-[9px] text-neutralGray mt-2">Posted {getRelativeTime(need.createdAt)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <UrgencyBadge urgency={need.urgency} size="small" />
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-full max-w-[150px]">
                              <div className="flex justify-between text-[10px] font-mono mb-1">
                                <span>{need.quantityDelivered} / {need.quantityNeeded}</span>
                                {remaining > 0 && <span className="text-accent">{remaining} left</span>}
                              </div>
                              <div className="w-full bg-neutralGray/10 h-1.5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-urgency-stable" style={{ width: `${Math.min(100, (need.quantityDelivered / need.quantityNeeded) * 100)}%` }}></div>
                                <div className="h-full bg-accent" style={{ width: `${Math.min(100, (need.quantityPledged / need.quantityNeeded) * 100)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {need.status === 'active' && (
                              <>
                                <button
                                  onClick={() => setConfirmState({ open: true, type: 'walkin', needId: need.id })}
                                  className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg font-bold text-[10px] uppercase hover:bg-primary/10 transition-colors"
                                  title="Add manual walk-in donation"
                                >
                                  +1 Walk-in
                                </button>
                                <button
                                  onClick={() => setConfirmState({ open: true, type: 'close', needId: need.id })}
                                  className="px-3 py-1.5 bg-urgency-critical/5 text-urgency-critical rounded-lg font-bold text-[10px] uppercase hover:bg-urgency-critical/10 transition-colors"
                                >
                                  Close
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl border border-neutralGray/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-outfit text-sm">
                  <thead>
                    <tr className="bg-background/50 border-b border-neutralGray/10">
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Time</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Item & Qty</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Donor</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-neutralGray tracking-wider font-semibold">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutralGray/10">
                    {donationHistory.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-8 text-neutralGray">No verification history yet.</td></tr>
                    ) : (
                      [...donationHistory].reverse().map(h => {
                        const date = new Date(h.verifiedAt);
                        return (
                          <tr key={h.id} className="hover:bg-background/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-mono text-xs text-primary">{getRelativeTime(h.verifiedAt)}</p>
                              <p className="font-mono text-[10px] text-neutralGray">{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-sans font-bold text-primary">{h.quantity}x</p>
                              <p className="text-neutralGray text-xs">{h.itemName}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-primary flex items-center gap-2">
                              {h.donorId.startsWith('anon') ? 'Anonymous' : h.donorId}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md font-mono text-[9px] uppercase font-bold ${
                                h.verifiedBy === 'qr' ? 'bg-urgency-stable/10 text-urgency-stable' : 'bg-urgency-warning/10 text-urgency-warning'
                                }`}>
                                {h.verifiedBy === 'qr' ? <QrCode size={10} /> : <Hash size={10} />}
                                {h.verifiedBy}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* QR TAB */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutralGray/20 text-center max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                <h2 className="font-sans font-bold text-2xl text-primary mb-2">Barangay QR</h2>
                <p className="font-outfit text-sm text-neutralGray mb-8">Have donors scan this to register as a community member.</p>

                <div className="inline-block p-4 bg-background rounded-2xl border border-neutralGray/20 mb-6">
                  <QRCodeSVG
                    value={barangay.registrationQR}
                    size={200}
                    bgColor="#F2F0E9"
                    fgColor="#2E4036"
                  />
                </div>

                <div className="bg-neutralGray/5 rounded-xl p-4 border border-neutralGray/10">
                  <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Manual Code</p>
                  <p className="font-mono text-xl font-bold text-primary tracking-widest">{barangay.id.split('-')[1].toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmState({ open: false, type: null, needId: null })}
        {...getConfirmProps()}
      />
    </div>
  );
};
