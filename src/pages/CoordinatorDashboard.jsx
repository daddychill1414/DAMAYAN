import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import {
  BarChart3, MapPin, Package, CheckCircle, Clock, Users,
  Smartphone, Download, AlertTriangle, Send
} from 'lucide-react';

export const CoordinatorDashboard = () => {
  const { needs, tasks, centers, feedbacks } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [smsLog, setSmsLog] = useState([
    { id: 1, time: '10:42 AM', to: '+63 917 *** 1234', msg: 'DAMAYAN: San Jose Center needs 50 Diapers (Size L). Reply PLEDGE to help.', status: 'Delivered' },
    { id: 2, time: '09:15 AM', to: '+63 906 *** 5678', msg: 'DAMAYAN: Water supply arriving at Rosario. Prepare storage.', status: 'Delivered' },
    { id: 3, time: '08:00 AM', to: 'BROADCAST', msg: 'DAMAYAN ALERT: Typhoon Aghon signal raised. Evac centers open at San Jose, Rosario, Makati HS.', status: 'Delivered' },
  ]);

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
      `FEEDBACK RESPONSES: ${feedbacks.length}`,
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

  const tabs = [
    { id: 'overview', label: 'Metrics Overview', icon: BarChart3 },
    { id: 'sms', label: 'SMS/USSD Fallback', icon: Smartphone },
  ];

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-[90vh] bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Coordinator Dashboard</h1>
            <p className="font-outfit text-dark/70 max-w-2xl text-lg">High-level overview of network operations, logistics, and resource distribution.</p>
          </div>
          <MagneticButton onClick={handleExportReport} className="bg-primary text-background px-6 py-3 text-sm shrink-0">
            <Download size={16} /> Export SitRep
          </MagneticButton>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-2 font-outfit text-sm font-semibold overflow-x-auto pb-2 lg:pb-0">
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
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-2">Total Requested</h3>
                    <p className="font-sans font-bold text-4xl text-primary">{totalRequested}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-2">Pledged / Transit</h3>
                    <p className="font-sans font-bold text-4xl text-accent">{totalPledged}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-2">Verified Delivered</h3>
                    <p className="font-sans font-bold text-4xl text-green-600">{totalDelivered}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 border border-primary/5">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-2">Fulfillment Rate</h3>
                    <p className="font-sans font-bold text-4xl text-primary">{fulfillmentRate}%</p>
                  </div>
                </div>

                {/* Center Status & Logistics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-xl shadow-primary/5">
                    <h2 className="font-sans font-bold text-2xl text-primary mb-6">Evacuation Centers</h2>
                    <div className="space-y-4">
                      {centers.map(c => {
                        const occupancyPct = Math.round((c.current / c.capacity) * 100);
                        return (
                          <div key={c.id} className="p-4 bg-background/50 rounded-2xl">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <MapPin className="text-primary/50" size={18} />
                                <div>
                                  <h4 className="font-outfit font-bold text-primary text-sm">{c.name}</h4>
                                  <p className="font-mono text-[10px] text-dark/50">{c.current}/{c.capacity} occupants</p>
                                </div>
                              </div>
                              <span className={`font-mono text-[10px] px-3 py-1 rounded-full font-bold uppercase ${
                                c.status === 'Critical' ? 'bg-red-100 text-red-600' : c.status === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                              }`}>
                                {c.status}
                              </span>
                            </div>
                            <div className="w-full bg-primary/10 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${occupancyPct > 80 ? 'bg-accent' : 'bg-primary'}`} style={{ width: `${occupancyPct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-xl shadow-primary/5">
                    <h2 className="font-sans font-bold text-2xl text-primary mb-6">Logistics</h2>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-2xl">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent"><Clock size={20} /></div>
                        <div>
                          <h4 className="font-outfit font-bold text-primary">Pending Deliveries</h4>
                          <p className="font-mono text-xs text-dark/50">{openTasks} tasks awaiting volunteers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-2xl">
                        <div className="p-3 bg-green-100 rounded-xl text-green-600"><Users size={20} /></div>
                        <div>
                          <h4 className="font-outfit font-bold text-primary">Active Volunteers</h4>
                          <p className="font-mono text-xs text-dark/50">{claimedTasks} on active missions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 border border-primary/10 rounded-2xl">
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package size={20} /></div>
                        <div>
                          <h4 className="font-outfit font-bold text-primary">Items in Pipeline</h4>
                          <p className="font-mono text-xs text-dark/50">{totalPledged} pledged, awaiting delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sms' && (
              <div>
                <div className="bg-white rounded-3xl p-8 border border-primary/5 shadow-xl shadow-primary/5 mb-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent shrink-0"><Smartphone size={24} /></div>
                    <div>
                      <h2 className="font-sans font-bold text-2xl text-primary">SMS/USSD Fallback</h2>
                      <p className="font-outfit text-dark/60 text-sm">Broadcast updates to users without smartphones. Messages are dispatched via USSD gateway for areas with limited data connectivity.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSendSMS} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-outfit text-sm font-semibold text-primary mb-2">Recipient</label>
                        <select name="smsRecipient" className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent">
                          <option value="BROADCAST">📢 Broadcast to All</option>
                          {centers.map(c => (
                            <option key={c.id} value={c.name}>📍 {c.name}</option>
                          ))}
                          <option value="VOLUNTEERS">🙋 All Volunteers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-outfit text-sm font-semibold text-primary mb-2">Template (optional)</label>
                        <select 
                          className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                          onChange={(e) => {
                            if (e.target.value) {
                              const textarea = document.querySelector('textarea[name="smsContent"]');
                              if (textarea) textarea.value = e.target.value;
                            }
                          }}
                        >
                          <option value="">— Custom message —</option>
                          <option value="DAMAYAN ALERT: Evacuation centers are now open. Please proceed to your nearest barangay center.">🚨 Evacuation Alert</option>
                          <option value="DAMAYAN UPDATE: Supplies have arrived. Distribution begins at 8:00 AM. Bring your family ID.">📦 Supply Arrival</option>
                          <option value="DAMAYAN: All clear signal issued. Please coordinate with your barangay for return procedures.">✅ All Clear</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-outfit text-sm font-semibold text-primary mb-2">Message</label>
                      <textarea
                        name="smsContent"
                        rows="3"
                        maxLength={160}
                        placeholder="Enter broadcast message (max 160 chars for SMS)..."
                        className="w-full bg-background border border-primary/10 rounded-xl p-4 font-mono text-sm outline-none focus:border-accent resize-none"
                        required
                      ></textarea>
                    </div>
                    <MagneticButton className="bg-accent text-white py-3 px-8 text-sm">
                      <Send size={16} /> Dispatch SMS
                    </MagneticButton>
                  </form>
                </div>

                {/* Transmission Log */}
                <div className="bg-dark text-background rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-background/50">Transmission Log</h3>
                    <div className="flex items-center gap-2 bg-background/10 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="font-mono text-[10px] uppercase text-background/60">Gateway Online</span>
                    </div>
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {smsLog.map(log => (
                      <div key={log.id} className="border-l-2 border-primary/40 pl-4 py-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-background/40 mb-1">
                          <span>{log.time} → {log.to}</span>
                          <span className={`px-2 py-0.5 rounded-full ${log.status === 'Delivered' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10 animate-pulse'}`}>
                            {log.status}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-background/80 leading-relaxed">{log.msg}</p>
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
