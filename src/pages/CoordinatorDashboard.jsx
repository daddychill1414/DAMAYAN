import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { gsap } from 'gsap';
import {
  BarChart3, MapPin, Package, CheckCircle, Clock, Users,
  Smartphone, Download, AlertTriangle, Send, Box,
  TrendingDown, TrendingUp, AlertCircle, RefreshCw, Plus
} from 'lucide-react';

export const CoordinatorDashboard = () => {
  const { 
    needs, tasks, centers, feedbacks, inventory,
    submitSupplyRequest, broadcastUrgentAlert, updateCenter,
    updateInventoryItem, showToast, transferSurplus, submitPhysicalCount
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [smsLog, setSmsLog] = useState([
    { id: 1, time: '10:42 AM', to: '+63 917 *** 1234', msg: 'DAMAYAN: San Jose Center needs 50 Diapers (Size L). Reply PLEDGE to help.', status: 'Delivered' },
    { id: 2, time: '09:15 AM', to: '+63 906 *** 5678', msg: 'DAMAYAN: Water supply arriving at Rosario. Prepare storage.', status: 'Delivered' },
    { id: 3, time: '08:00 AM', to: 'BROADCAST', msg: 'DAMAYAN ALERT: Typhoon Aghon signal raised. Evac centers open at San Jose, Rosario, Makati HS.', status: 'Delivered' },
  ]);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dash-fade', { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const totalRequested = needs.reduce((sum, n) => sum + n.requested, 0);
  const totalPledged = needs.reduce((sum, n) => sum + n.pledged, 0);
  const totalDelivered = needs.reduce((sum, n) => sum + n.delivered, 0);
  const openTasks = tasks.filter(t => t.status === 'Open').length;
  const claimedTasks = tasks.filter(t => t.status === 'Claimed').length;
  const fulfillmentRate = totalRequested > 0 ? Math.round(((totalPledged + totalDelivered) / totalRequested) * 100) : 0;

  const handleSendSMS = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const msg = formData.get('smsContent');
    const recipient = formData.get('smsRecipient') || 'BROADCAST';
    if (!msg) return;
    setSmsLog(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), to: recipient, msg, status: 'Sending...' }, ...prev]);
    e.target.reset();
    setTimeout(() => {
      setSmsLog(prev => prev.map((log, i) => i === 0 ? { ...log, status: 'Delivered' } : log));
      showToast('SMS dispatched successfully', 'success');
    }, 1500);
  };

  const handleExportReport = () => {
    const reportLines = [
      'DAMAYAN NETWORK — SITUATION REPORT',
      `Generated: ${new Date().toLocaleString()}`,
      '—'.repeat(40),
      '',
      'EVACUATION CENTER STATUS:',
      ...centers.map(c => `  • ${c.name} — ${c.current}/${c.capacity} occupants — Status: ${c.status}`),
      '',
      'NEEDS SUMMARY:',
      ...needs.map(n => {
        const center = centers.find(c => c.id === n.centerId);
        return `  • ${n.item} (${n.category}) — Requested: ${n.requested}, Pledged: ${n.pledged}, Delivered: ${n.delivered} — ${center?.name}`;
      }),
      '',
      `FULFILLMENT RATE: ${fulfillmentRate}%`,
      `ACTIVE VOLUNTEERS: ${claimedTasks}`,
      `OPEN TASKS: ${openTasks}`,
      '',
      '— End of Report —'
    ];
    const blob = new Blob([reportLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `damayan-sitrep-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSupplyRequest = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    submitSupplyRequest({
      centerId: Number(fd.get('centerId')),
      category: fd.get('category'),
      item: fd.get('item'),
      quantity: Number(fd.get('quantity')),
      urgency: fd.get('urgency'),
      notes: fd.get('notes')
    });
    e.target.reset();
    showToast('Supply request submitted to network', 'success');
  };

  const handleUrgentAlert = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    broadcastUrgentAlert({
      title: fd.get('title'),
      message: fd.get('message'),
      level: fd.get('level')
    });
    e.target.reset();
    showToast('Urgent alert broadcasted to network', 'warning');
  };

  const tabs = [
    { id: 'overview', label: 'Metrics Overview', icon: BarChart3 },
    { id: 'storage', label: 'Storage Analytics', icon: Box },
    { id: 'actions', label: 'Inventory Actions', icon: RefreshCw },
    { id: 'evacuation', label: 'Evacuation Centers', icon: Users },
    { id: 'requests', label: 'Request Needs', icon: Plus },
    { id: 'alerts', label: 'Urgent Alerts', icon: AlertTriangle },
    { id: 'sms', label: 'SMS Fallback', icon: Smartphone },
  ];

  return (
    <div ref={containerRef} className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-[90vh] bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="dash-fade flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent"></div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Operations</span>
            </div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Coordinator Dashboard</h1>
            <p className="font-outfit text-dark/70 max-w-2xl text-base">Manage evacuation centers, monitor storage analytics, and dispatch logistics.</p>
          </div>
          <MagneticButton onClick={handleExportReport} className="bg-primary text-background px-6 py-3 text-sm shrink-0">
            <Download size={16} /> Export SitRep
          </MagneticButton>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-60 shrink-0">
            <div className="flex lg:flex-col gap-2 font-outfit text-sm font-semibold overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-background shadow-lg'
                      : 'hover:bg-primary/5 text-dark/60'
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* ═══ OVERVIEW TAB ═══ */}
            {activeTab === 'overview' && (
              <div key="overview" className="dash-fade">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[9px] uppercase tracking-widest text-dark/50 mb-2">Total Requested</h3>
                    <p className="font-sans font-bold text-3xl text-primary">{totalRequested}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[9px] uppercase tracking-widest text-dark/50 mb-2">Pledged / Transit</h3>
                    <p className="font-sans font-bold text-3xl text-accent">{totalPledged}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[9px] uppercase tracking-widest text-dark/50 mb-2">Verified Delivered</h3>
                    <p className="font-sans font-bold text-3xl text-green-600">{totalDelivered}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[9px] uppercase tracking-widest text-dark/50 mb-2">Fulfillment Rate</h3>
                    <p className="font-sans font-bold text-3xl text-primary">{fulfillmentRate}%</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                  <h2 className="font-sans font-bold text-xl text-primary mb-6">Logistics Pipeline</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-xl">
                      <div className="p-3 bg-accent/10 rounded-xl text-accent"><Clock size={20} /></div>
                      <div>
                        <h4 className="font-outfit font-bold text-sm text-primary">Pending Deliveries</h4>
                        <p className="font-mono text-[10px] text-dark/50">{openTasks} tasks awaiting</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-xl">
                      <div className="p-3 bg-green-100 rounded-xl text-green-600"><Users size={20} /></div>
                      <div>
                        <h4 className="font-outfit font-bold text-sm text-primary">Active Volunteers</h4>
                        <p className="font-mono text-[10px] text-dark/50">{claimedTasks} on missions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-xl">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package size={20} /></div>
                      <div>
                        <h4 className="font-outfit font-bold text-sm text-primary">Items Pipeline</h4>
                        <p className="font-mono text-[10px] text-dark/50">{totalPledged} pledged items</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STORAGE ANALYTICS TAB ═══ */}
            {activeTab === 'storage' && (
              <div key="storage" className="dash-fade">
                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-sans font-bold text-xl text-primary">Live Stock Inventory</h2>
                    <span className="font-mono text-[10px] bg-green-100 text-green-600 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Live Sync
                    </span>
                  </div>

                  <div className="space-y-6">
                    {inventory.map(category => (
                      <div key={category.id} className="border border-primary/5 rounded-xl p-5">
                        <h3 className="font-outfit font-bold text-base text-primary mb-4 flex items-center gap-2">
                          <Box size={16} className="text-accent" /> {category.category}
                        </h3>
                        <div className="space-y-4">
                          {category.items.map((item, idx) => {
                            const pct = Math.round((item.current / item.max) * 100);
                            const statusColor = pct < 20 ? 'bg-red-500' : pct < 50 ? 'bg-yellow-500' : 'bg-green-500';
                            return (
                              <div key={idx} className="flex flex-col gap-2">
                                <div className="flex justify-between items-end">
                                  <div>
                                    <p className="font-outfit text-sm font-semibold text-dark/80">{item.name}</p>
                                    <div className="flex gap-2 items-center mt-1">
                                      <p className="font-mono text-[9px] text-dark/40 uppercase">{item.current} / {item.max} {item.unit}</p>
                                      {item.expirationDate && (
                                        <p className="font-mono text-[9px] text-accent uppercase flex items-center gap-1 bg-accent/10 px-1.5 py-0.5 rounded border border-accent/20">
                                          <Clock size={10} /> Exp: {item.expirationDate}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <span className={`font-mono text-[10px] font-bold ${pct < 20 ? 'text-red-500' : pct < 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {pct}% Capacity
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                                  <div className={`h-full ${statusColor} transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ INVENTORY ACTIONS TAB ═══ */}
            {activeTab === 'actions' && (
              <div key="actions" className="dash-fade">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Physical Count Form */}
                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h2 className="font-sans font-bold text-xl text-primary mb-2">Submit Physical Count</h2>
                    <p className="font-outfit text-xs text-dark/60 mb-6">Log manual physical counts. This requires Admin approval to take effect.</p>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      submitPhysicalCount({
                        categoryId: fd.get('categoryId'),
                        itemName: fd.get('itemName'),
                        newCurrent: Number(fd.get('newCurrent')),
                        notes: fd.get('notes')
                      });
                      e.target.reset();
                      showToast('Physical count submitted for approval.', 'success');
                    }} className="space-y-4">
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Category</label>
                        <select name="categoryId" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                          {inventory.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Specific Item</label>
                        <input type="text" name="itemName" placeholder="e.g. Canned Goods" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">New Quantity Count</label>
                        <input type="number" name="newCurrent" min="0" placeholder="0" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Notes / Discrepancy Reason</label>
                        <textarea name="notes" rows="2" className="w-full bg-background border border-primary/10 rounded-xl p-3 font-outfit text-sm outline-none focus:border-accent resize-none"></textarea>
                      </div>
                      <MagneticButton className="w-full bg-primary text-background py-3 mt-2">Submit Count</MagneticButton>
                    </form>
                  </div>

                  {/* Transfer Surplus Form */}
                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h2 className="font-sans font-bold text-xl text-primary mb-2">Transfer Surplus</h2>
                    <p className="font-outfit text-xs text-dark/60 mb-6">Move excess items directly to another evacuation center in need.</p>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      transferSurplus({
                        toCenterId: Number(fd.get('toCenterId')),
                        categoryId: fd.get('categoryId'),
                        itemName: fd.get('itemName'),
                        amount: Number(fd.get('amount'))
                      });
                      e.target.reset();
                    }} className="space-y-4">
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Destination Center</label>
                        <select name="toCenterId" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                          <option value="">Select Target Center...</option>
                          {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Category</label>
                        <select name="categoryId" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                          {inventory.map(cat => <option key={cat.id} value={cat.id}>{cat.category}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Item Name</label>
                        <input type="text" name="itemName" placeholder="e.g. Rice (5kg bags)" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Transfer Amount</label>
                        <input type="number" name="amount" min="1" placeholder="0" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <MagneticButton className="w-full bg-accent text-background py-3 mt-2">Dispatch Surplus</MagneticButton>
                    </form>
                  </div>

                </div>
              </div>
            )}

            {/* ═══ EVACUATION CENTERS TAB ═══ */}
            {activeTab === 'evacuation' && (
              <div key="evacuation" className="dash-fade">
                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                  <h2 className="font-sans font-bold text-xl text-primary mb-6">Facility Management</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {centers.map(c => {
                      const occupancyPct = Math.round((c.current / c.capacity) * 100);
                      return (
                        <div key={c.id} className="p-5 border border-primary/10 rounded-xl hover:border-primary/20 transition-colors">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                c.status === 'Critical' ? 'bg-red-100 text-red-600' : c.status === 'Warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                              }`}>
                                <MapPin size={18} />
                              </div>
                              <div>
                                <h4 className="font-outfit font-bold text-primary text-sm">{c.name}</h4>
                                <p className="font-mono text-[10px] text-dark/50">{c.current}/{c.capacity} occupants</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-mono text-dark/50 mb-1">
                              <span>Occupancy</span>
                              <span>{occupancyPct}%</span>
                            </div>
                            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${occupancyPct > 80 ? 'bg-red-500' : occupancyPct > 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${occupancyPct}%` }}></div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-background text-dark/60 rounded-lg hover:bg-background/80 transition-colors border border-primary/5">
                              Update Occupancy
                            </button>
                            <button className="flex-1 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-background text-dark/60 rounded-lg hover:bg-background/80 transition-colors border border-primary/5">
                              Change Status
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ REQUEST NEEDS TAB ═══ */}
            {activeTab === 'requests' && (
              <div key="requests" className="dash-fade">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h2 className="font-sans font-bold text-xl text-primary mb-6">Submit New Request</h2>
                    <form onSubmit={handleSupplyRequest} className="space-y-4">
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Destination Center</label>
                        <select name="centerId" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                          <option value="">Select Center...</option>
                          {centers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Category</label>
                          <select name="category" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                            <option value="">Category...</option>
                            <option value="Food">Food</option>
                            <option value="Water">Water</option>
                            <option value="Medical">Medical</option>
                            <option value="Hygiene">Hygiene</option>
                            <option value="Clothing">Clothing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Urgency</label>
                          <select name="urgency" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required>
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Specific Item</label>
                        <input type="text" name="item" placeholder="e.g. Rice (5kg bags)" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Quantity Needed</label>
                        <input type="number" name="quantity" min="1" placeholder="0" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-dark/70 mb-1.5">Notes (Optional)</label>
                        <textarea name="notes" rows="2" className="w-full bg-background border border-primary/10 rounded-xl p-3 font-outfit text-sm outline-none focus:border-accent resize-none"></textarea>
                      </div>
                      <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl text-sm font-outfit font-semibold btn-magnetic flex items-center justify-center gap-2 mt-2">
                        <Plus size={16} /> Submit to Network
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h2 className="font-sans font-bold text-xl text-primary mb-6">Quick Requests (Low Stock)</h2>
                    <div className="space-y-3">
                      {inventory.flatMap(cat => cat.items.map(item => ({...item, cat: cat.category})))
                        .filter(i => (i.current / i.max) < 0.2)
                        .map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border border-red-500/20 bg-red-500/5 rounded-xl">
                          <div>
                            <p className="font-outfit text-sm font-semibold text-red-700">{item.name}</p>
                            <p className="font-mono text-[9px] text-red-500/70 uppercase">Current: {item.current} {item.unit}</p>
                          </div>
                          <button onClick={() => {
                            const qty = item.max - item.current;
                            submitSupplyRequest({ centerId: centers[0].id, category: item.cat, item: item.name, quantity: qty, urgency: 'urgent' });
                            showToast(`Quick request sent for ${qty} ${item.unit} of ${item.name}`, 'success');
                          }} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-outfit font-semibold hover:bg-red-600 transition-colors">
                            Request Refill
                          </button>
                        </div>
                      ))}
                      {inventory.flatMap(cat => cat.items).filter(i => (i.current / i.max) < 0.2).length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                          <p className="font-outfit text-sm text-dark/50">No critical shortages detected.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ ALERTS TAB ═══ */}
            {activeTab === 'alerts' && (
              <div key="alerts" className="dash-fade">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/20 shadow-lg shadow-red-500/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-red-500/20 rounded-xl"><AlertCircle size={20} className="text-red-500" /></div>
                      <h2 className="font-sans font-bold text-xl text-red-600">Broadcast Alert</h2>
                    </div>
                    <form onSubmit={handleUrgentAlert} className="space-y-4">
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-red-700/80 mb-1.5">Alert Level</label>
                        <select name="level" className="w-full bg-white border border-red-500/20 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-red-400" required>
                          <option value="warning">Warning (Yellow)</option>
                          <option value="critical">Critical (Red)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-red-700/80 mb-1.5">Headline</label>
                        <input type="text" name="title" placeholder="e.g. Immediate Evacuation" className="w-full bg-white border border-red-500/20 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-red-400" required />
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-red-700/80 mb-1.5">Message Content</label>
                        <textarea name="message" rows="4" placeholder="Detailed instructions for the network..." className="w-full bg-white border border-red-500/20 rounded-xl p-3 font-outfit text-sm outline-none focus:border-red-400 resize-none" required></textarea>
                      </div>
                      <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-xl text-sm font-outfit font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                        <AlertTriangle size={16} /> Broadcast to Network
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                    <h2 className="font-sans font-bold text-xl text-primary mb-6">Recent Broadcasts</h2>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/10 before:to-transparent">
                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-red-100 text-red-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                           <AlertCircle size={16} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                           <div className="flex items-center justify-between mb-1">
                             <h4 className="font-outfit font-bold text-sm text-primary">Typhoon Aghon Update</h4>
                             <span className="font-mono text-[9px] text-dark/40">2h ago</span>
                           </div>
                           <p className="font-outfit text-xs text-dark/60">Signal No. 3 raised. All coastal barangays are ordered to preemptively evacuate.</p>
                         </div>
                       </div>
                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                         <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-yellow-100 text-yellow-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                           <AlertTriangle size={16} />
                         </div>
                         <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/10 bg-white shadow-sm">
                           <div className="flex items-center justify-between mb-1">
                             <h4 className="font-outfit font-bold text-sm text-primary">Water Shortage</h4>
                             <span className="font-mono text-[9px] text-dark/40">5h ago</span>
                           </div>
                           <p className="font-outfit text-xs text-dark/60">San Jose center is running critically low on drinking water. Diverting supplies.</p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ SMS TAB ═══ */}
            {activeTab === 'sms' && (
              <div key="sms" className="dash-fade">
                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5 mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0"><Smartphone size={24} /></div>
                    <div>
                      <h2 className="font-sans font-bold text-xl text-primary">SMS/USSD Gateway</h2>
                      <p className="font-outfit text-dark/60 text-sm">Dispatch text updates to residents without data access.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSendSMS} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-primary mb-1.5">Recipient</label>
                        <select name="smsRecipient" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent">
                          <option value="BROADCAST">📢 Broadcast to All</option>
                          {centers.map(c => <option key={c.id} value={c.name}>📍 {c.name}</option>)}
                          <option value="VOLUNTEERS">🙋 All Volunteers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-primary mb-1.5">Quick Template</label>
                        <select 
                          className="w-full bg-background border border-primary/10 rounded-xl px-4 py-2.5 font-outfit text-sm outline-none focus:border-accent"
                          onChange={(e) => {
                            if (e.target.value) {
                              const textarea = document.querySelector('textarea[name="smsContent"]');
                              if (textarea) textarea.value = e.target.value;
                            }
                          }}
                        >
                          <option value="">— Custom message —</option>
                          <option value="DAMAYAN ALERT: Evacuation centers open. Proceed to nearest center.">🚨 Evacuation Alert</option>
                          <option value="DAMAYAN UPDATE: Supplies arrived. Distribution at 8AM.">📦 Supply Arrival</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-outfit text-xs font-semibold text-primary mb-1.5">Message (Max 160 chars)</label>
                      <textarea
                        name="smsContent" rows="3" maxLength={160}
                        placeholder="Type message here..."
                        className="w-full bg-background border border-primary/10 rounded-xl p-3 font-mono text-sm outline-none focus:border-accent resize-none"
                        required
                      ></textarea>
                    </div>
                    <MagneticButton className="bg-accent text-white py-3 px-6 text-sm flex items-center justify-center w-full md:w-auto">
                      <Send size={16} className="mr-2" /> Dispatch SMS
                    </MagneticButton>
                  </form>
                </div>

                <div className="bg-dark text-background rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-background/50">Transmission Log</h3>
                    <div className="flex items-center gap-2 bg-background/10 px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="font-mono text-[9px] uppercase text-background/60">Gateway Online</span>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {smsLog.map(log => (
                      <div key={log.id} className="border-l-2 border-primary/40 pl-3 py-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-background/40 mb-1">
                          <span>{log.time} → {log.to}</span>
                          <span className={`${log.status === 'Delivered' ? 'text-green-400' : 'text-yellow-400 animate-pulse'}`}>{log.status}</span>
                        </div>
                        <p className="font-mono text-xs text-background/80 leading-snug">{log.msg}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
