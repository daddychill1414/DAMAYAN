import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import {
  Heart, Package, TrendingUp, MapPin, CheckCircle,
  Clock, ArrowRight, ShieldCheck, Check
} from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

export const DonorDashboard = () => {
  const { currentUser, donations, tasks, needs, centers, claimTask, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('impact');
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.donor-fade', { y: 20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  // Derived stats
  const myDonations = donations; // Assuming simulated current user donations
  const totalPledged = myDonations.length;
  const verifiedDelivered = myDonations.filter(d => d.status === 'Delivered').length;
  const myTasks = tasks.filter(t => t.status === 'Claimed');
  const openTasks = tasks.filter(t => t.status === 'Open');

  const handleClaimTask = (taskId) => {
    claimTask(taskId);
    showToast('Task claimed successfully. Coordinator notified.', 'success');
  };

  const tabs = [
    { id: 'impact', label: 'My Impact', icon: TrendingUp },
    { id: 'pledges', label: 'My Pledges', icon: Heart },
    { id: 'tasks', label: 'Volunteer Tasks', icon: Package },
  ];

  return (
    <div ref={containerRef} className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-[90vh] bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="donor-fade flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent"></div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Donor & Volunteer</span>
            </div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Welcome, {currentUser?.name || 'User'}</h1>
            <p className="font-outfit text-dark/70 text-base">Track your pledges, view your impact, and claim volunteer tasks.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/needs" className="bg-primary text-background px-6 py-3 rounded-xl text-sm font-outfit font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Heart size={16} /> Donate Now
            </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-60 shrink-0">
            <div className="flex lg:flex-col gap-2 font-outfit text-sm font-semibold overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`p-3 rounded-xl text-left transition-all duration-300 flex items-center gap-3 whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-primary text-background shadow-lg' : 'hover:bg-primary/5 text-dark/60'
                  }`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            
            {/* ═══ IMPACT TAB ═══ */}
            {activeTab === 'impact' && (
              <div key="impact" className="donor-fade">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-xl text-accent"><Heart size={24} /></div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-1">Total Pledges</p>
                      <p className="font-sans font-bold text-3xl text-primary">{totalPledged}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-xl text-green-600"><CheckCircle size={24} /></div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-1">Delivered</p>
                      <p className="font-sans font-bold text-3xl text-primary">{verifiedDelivered}</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg shadow-primary/5 border border-primary/5 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package size={24} /></div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-dark/50 mb-1">Tasks Completed</p>
                      <p className="font-sans font-bold text-3xl text-primary">{myTasks.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                  <h2 className="font-sans font-bold text-xl text-primary mb-6">Live Needs Feed</h2>
                  <div className="space-y-4">
                    {needs.slice(0, 4).map(need => {
                      const center = centers.find(c => c.id === need.centerId);
                      const pct = Math.min(100, Math.round(((need.pledged + need.delivered) / need.requested) * 100));
                      return (
                        <div key={need.id} className="flex items-center gap-4 p-4 border border-primary/10 rounded-xl">
                          <div className={`p-2.5 rounded-lg ${
                            need.urgency === 'critical' ? 'bg-red-100 text-red-600' :
                            need.urgency === 'urgent' ? 'bg-yellow-100 text-yellow-600' : 'bg-primary/10 text-primary'
                          }`}>
                            <AlertCircle size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-outfit font-bold text-sm text-primary truncate">{need.item}</h4>
                            <p className="font-mono text-[10px] text-dark/50 truncate">{center?.name}</p>
                          </div>
                          <div className="w-24 shrink-0">
                            <div className="flex justify-between text-[9px] font-mono mb-1">
                              <span>{pct}%</span>
                              <span>{need.requested} req</span>
                            </div>
                            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
                              <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 text-center">
                    <Link to="/needs" className="text-accent text-sm font-outfit font-semibold hover:underline inline-flex items-center gap-1">
                      View all needs <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ PLEDGES TAB ═══ */}
            {activeTab === 'pledges' && (
              <div key="pledges" className="donor-fade">
                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                  <h2 className="font-sans font-bold text-xl text-primary mb-6">Donation History</h2>
                  
                  {myDonations.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart size={40} className="text-dark/10 mx-auto mb-4" />
                      <p className="font-outfit text-dark/50 mb-4">You haven't made any pledges yet.</p>
                      <Link to="/needs" className="bg-primary text-background px-6 py-2.5 rounded-xl text-sm font-outfit font-semibold inline-block hover:bg-primary/90 transition-colors">
                        Browse Needs
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myDonations.map(donation => {
                        const need = needs.find(n => n.id === donation.needId);
                        const center = centers.find(c => c.id === need?.centerId);
                        return (
                          <div key={donation.id} className="p-4 border border-primary/10 rounded-xl flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-outfit font-bold text-base text-primary">{need?.item || 'Unknown Item'}</h4>
                                  <p className="font-mono text-[10px] text-dark/50 uppercase">Qty: {donation.amount} • To: {center?.name}</p>
                                </div>
                                <span className={`font-mono text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                                  donation.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>{donation.status}</span>
                              </div>
                              {donation.status === 'Pending QR Scan' && (
                                <p className="font-outfit text-xs text-dark/60 mt-2 bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                                  Show your QR code at the center to verify delivery.
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ VOLUNTEER TASKS TAB ═══ */}
            {activeTab === 'tasks' && (
              <div key="tasks" className="donor-fade">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-primary text-background rounded-2xl p-6 shadow-lg shadow-primary/20">
                    <h3 className="font-sans font-bold text-xl mb-2">Active Tasks</h3>
                    <p className="font-outfit text-background/70 text-sm mb-4">You have {myTasks.length} task(s) currently claimed.</p>
                    {myTasks.length > 0 ? (
                      <div className="space-y-3">
                        {myTasks.map(task => (
                          <div key={task.id} className="bg-background/10 border border-background/20 rounded-xl p-3">
                            <p className="font-outfit font-semibold text-sm mb-1">{task.title}</p>
                            <p className="font-mono text-[10px] text-background/60">{task.location}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-background/10 border border-background/20 rounded-xl p-4 text-center">
                        <p className="font-outfit text-sm text-background/60">No active tasks.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-primary/5 shadow-lg shadow-primary/5">
                  <h2 className="font-sans font-bold text-xl text-primary mb-6">Available Opportunities</h2>
                  
                  {openTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
                      <p className="font-outfit text-dark/50">All tasks are currently assigned. Check back later!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {openTasks.map(task => (
                        <div key={task.id} className="p-4 border border-primary/10 rounded-xl hover:border-accent/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-outfit font-bold text-base text-primary mb-1">{task.title}</h4>
                            <div className="flex gap-3 font-mono text-[10px] text-dark/50">
                              <span className="flex items-center gap-1"><MapPin size={12} /> {task.location}</span>
                              <span className="flex items-center gap-1"><Package size={12} /> Transport: {task.transport}</span>
                            </div>
                          </div>
                          <button onClick={() => handleClaimTask(task.id)} className="bg-accent text-white px-5 py-2 rounded-xl text-sm font-outfit font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2">
                            Claim Task <ArrowRight size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
