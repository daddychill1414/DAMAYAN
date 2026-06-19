import React, { useState } from 'react';
import { useStore } from '../store';
import { Package, CheckCircle, Clock, AlertTriangle, Plus, MapPin, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UrgencyBadge } from '../components/UrgencyBadge';

export const CoordinatorDashboard = () => {
  const { needs, pledges, donationHistory, barangay, postNeed, updateNeed, closeNeed, adjustNeedQuantity } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, post, needs, history, qr
  const [newNeed, setNewNeed] = useState({ itemName: '', category: 'Food', quantity: '', urgency: 'stable', dropOffPoint: barangay.name + ' Hall' });

  const activeNeeds = needs.filter(n => n.status === 'active');
  const fulfilledNeeds = needs.filter(n => n.status === 'fulfilled');
  const pendingPledges = pledges.filter(p => p.status === 'reserved');
  const expiredPledges = pledges.filter(p => p.status === 'expired');
  const verifiedPledges = pledges.filter(p => p.status.startsWith('verified'));

  const handlePostNeed = (e) => {
    e.preventDefault();
    postNeed({ ...newNeed, quantity: parseInt(newNeed.quantity) });
    setNewNeed({ ...newNeed, itemName: '', quantity: '' });
    setActiveTab('needs');
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
          <p className="font-outfit text-dark/60">{barangay.coordinatorName} • {barangay.position}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-primary/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-t-xl font-outfit text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-background'
                  : 'bg-transparent text-primary/60 hover:bg-primary/5'
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
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                  <Package size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{activeNeeds.length}</h3>
                <p className="font-outfit text-sm text-dark/60 uppercase tracking-wider">Active Needs</p>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{verifiedPledges.length}</h3>
                <p className="font-outfit text-sm text-dark/60 uppercase tracking-wider">Verified Deliveries</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-primary/10 shadow-sm">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                  <Clock size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{pendingPledges.length}</h3>
                <p className="font-outfit text-sm text-dark/60 uppercase tracking-wider">Pending Pledges</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-red-500/20 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="font-mono text-4xl font-bold text-primary mb-1">{expiredPledges.length}</h3>
                <p className="font-outfit text-sm text-dark/60 uppercase tracking-wider">Expired / No-Show</p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
              </div>
            </div>
          )}

          {/* POST NEED TAB */}
          {activeTab === 'post' && (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] border border-primary/10 shadow-xl">
              <h2 className="font-sans font-bold text-2xl text-primary mb-6">Post New Shortage</h2>
              <form onSubmit={handlePostNeed} className="space-y-5">
                <div>
                  <label className="block font-outfit text-sm font-semibold text-primary mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={newNeed.itemName}
                    onChange={e => setNewNeed({...newNeed, itemName: e.target.value})}
                    placeholder="e.g. 10L Drinking Water"
                    className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block font-outfit text-sm font-semibold text-primary mb-2">Category</label>
                    <select
                      value={newNeed.category}
                      onChange={e => setNewNeed({...newNeed, category: e.target.value})}
                      className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
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
                      onChange={e => setNewNeed({...newNeed, quantity: e.target.value})}
                      placeholder="e.g. 50"
                      className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
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
                        onClick={() => setNewNeed({...newNeed, urgency: u})}
                        className={`py-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                          newNeed.urgency === u 
                            ? 'bg-primary text-background border-primary'
                            : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-outfit text-sm font-semibold text-primary mb-2">Drop-Off Location</label>
                  <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                    <MapPin size={16} className="text-primary/40" />
                    <input
                      type="text"
                      required
                      value={newNeed.dropOffPoint}
                      onChange={e => setNewNeed({...newNeed, dropOffPoint: e.target.value})}
                      className="w-full bg-transparent font-outfit text-sm outline-none"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-background py-4 rounded-xl font-outfit font-bold text-sm hover:shadow-lg transition-all">
                    <Plus size={18} /> Publish Need
                  </button>
                  <p className="font-outfit text-[10px] text-dark/40 text-center mt-3">
                    Ensure physical storage space is available before posting.
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* NEEDS TRACKER TAB */}
          {activeTab === 'needs' && (
            <div className="bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-outfit text-sm">
                  <thead>
                    <tr className="bg-background/50 border-b border-primary/5">
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Item & Status</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Urgency</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Progress</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {needs.map(need => {
                      const remaining = Math.max(0, need.quantityNeeded - need.quantityPledged - need.quantityDelivered);
                      const isFulfilled = need.status === 'fulfilled' || need.status === 'closed';
                      
                      return (
                        <tr key={need.id} className={isFulfilled ? 'bg-background/30 opacity-70' : 'hover:bg-background/30 transition-colors'}>
                          <td className="px-6 py-4">
                            <p className="font-sans font-bold text-primary text-base">{need.itemName}</p>
                            <p className="font-mono text-[10px] text-dark/40 uppercase">{need.category} • {need.status}</p>
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
                              <div className="w-full bg-primary/10 h-1.5 rounded-full overflow-hidden flex">
                                <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (need.quantityDelivered / need.quantityNeeded) * 100)}%` }}></div>
                                <div className="h-full bg-accent" style={{ width: `${Math.min(100, (need.quantityPledged / need.quantityNeeded) * 100)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {need.status === 'active' && (
                              <>
                                <button 
                                  onClick={() => adjustNeedQuantity(need.id, 1)}
                                  className="px-3 py-1.5 bg-primary/5 text-primary rounded-lg font-bold text-[10px] uppercase hover:bg-primary/10"
                                  title="Add manual walk-in donation"
                                >
                                  +1 Walk-in
                                </button>
                                <button 
                                  onClick={() => closeNeed(need.id)}
                                  className="px-3 py-1.5 bg-red-500/5 text-red-500 rounded-lg font-bold text-[10px] uppercase hover:bg-red-500/10"
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
            <div className="bg-white rounded-3xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-outfit text-sm">
                  <thead>
                    <tr className="bg-background/50 border-b border-primary/5">
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Time</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Item & Qty</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Donor</th>
                      <th className="px-6 py-4 font-mono text-[10px] uppercase text-dark/40 tracking-wider font-semibold">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {donationHistory.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-8 text-dark/40">No verification history yet.</td></tr>
                    ) : (
                      [...donationHistory].reverse().map(h => {
                        const date = new Date(h.verifiedAt);
                        return (
                          <tr key={h.id} className="hover:bg-background/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-mono text-xs text-primary">{date.toLocaleDateString()}</p>
                              <p className="font-mono text-[10px] text-dark/40">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-sans font-bold text-primary">{h.quantity}x</p>
                              <p className="text-dark/60 text-xs">{h.itemName}</p>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-primary">
                              {h.donorId.startsWith('anon') ? 'Anonymous' : h.donorId} {/* Ideally join with donor table */}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-md font-mono text-[9px] uppercase font-bold ${
                                h.verifiedBy === 'qr' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                              }`}>
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
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/10 text-center max-w-sm w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
                <h2 className="font-sans font-bold text-2xl text-primary mb-2">Barangay QR</h2>
                <p className="font-outfit text-sm text-dark/60 mb-8">Have donors scan this to register as a community member.</p>
                
                <div className="inline-block p-4 bg-background rounded-2xl border border-primary/10 mb-6">
                  <QRCodeSVG 
                    value={barangay.registrationQR}
                    size={200}
                    bgColor="#F2F0E9"
                    fgColor="#2E4036"
                  />
                </div>
                
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <p className="font-mono text-[10px] text-dark/40 uppercase tracking-wider mb-1">Manual Code</p>
                  <p className="font-mono text-xl font-bold text-primary tracking-widest">{barangay.id.split('-')[1].toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
