import React, { useState } from 'react';
import { useStore } from '../store';
import { Package, Heart, CheckCircle, AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QRDisplay } from '../components/QRDisplay';
import { CountdownTimer } from '../components/CountdownTimer';

export const DonorDashboard = () => {
  const { currentUser, getDonorPledges, getDonorHistory, toggleAnonymous, needs } = useStore();
  const [activeTab, setActiveTab] = useState('active'); // active, history, profile
  
  if (!currentUser) return null;

  const pledges = getDonorPledges(currentUser.id);
  const history = getDonorHistory(currentUser.id);
  
  const activePledges = pledges.filter(p => p.status === 'reserved');
  const pastPledges = pledges.filter(p => p.status !== 'reserved').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalDelivered = history.reduce((sum, h) => sum + h.quantity, 0);

  const tabs = [
    { id: 'active', label: `Active Pledges (${activePledges.length})` },
    { id: 'history', label: 'History' },
    { id: 'profile', label: 'Account Profile' },
  ];

  return (
    <div className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent"></div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Donor Portal</span>
            </div>
            <h1 className="font-sans font-bold text-4xl text-primary mb-2">Hello, {currentUser.name}</h1>
            <p className="font-outfit text-neutralGray">Manage your pledges and view your impact.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-2xl border border-neutralGray/20 shadow-sm text-center">
              <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Items Delivered</p>
              <p className="font-sans font-bold text-3xl text-urgency-stable">{totalDelivered}</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-2xl border border-neutralGray/20 shadow-sm text-center">
              <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Strikes</p>
              <p className={`font-sans font-bold text-3xl ${currentUser.strikes > 0 ? 'text-urgency-critical' : 'text-primary'}`}>
                {currentUser.strikes}/3
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-neutralGray/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-t-xl font-outfit text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
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
          
          {/* ACTIVE PLEDGES */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {activePledges.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-neutralGray/20 shadow-sm">
                  <Heart size={48} className="mx-auto text-neutralGray/30 mb-4" />
                  <h3 className="font-sans font-bold text-2xl text-primary mb-2">No Active Pledges</h3>
                  <p className="font-outfit text-neutralGray mb-6">You don't have any items reserved for delivery right now.</p>
                  <Link to="/needs" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors">
                    View Needs Board <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activePledges.map(pledge => {
                    const need = needs.find(n => n.id === pledge.needId);
                    return (
                      <div key={pledge.id} className="bg-white rounded-3xl p-6 border border-neutralGray/20 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-accent"></div>
                        
                        <div className="mb-6">
                          <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Item to Deliver</p>
                          <h3 className="font-sans font-bold text-2xl text-primary line-clamp-1">{need?.itemName || 'Unknown Item'}</h3>
                          <p className="font-outfit text-sm font-semibold text-accent">{pledge.quantity} units</p>
                        </div>
                        
                        <div className="mb-6">
                          <CountdownTimer expiresAt={pledge.expiresAt} />
                        </div>
                        
                        <QRDisplay qrData={pledge.qrData} verificationCode={pledge.verificationCode} compact />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {pastPledges.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-outfit text-neutralGray">No past pledges found.</p>
                </div>
              ) : (
                pastPledges.map(pledge => {
                  const need = needs.find(n => n.id === pledge.needId);
                  const isVerified = pledge.status.startsWith('verified');
                  const isExpired = pledge.status === 'expired';
                  const isRejected = pledge.status === 'rejected';
                  
                  return (
                    <div key={pledge.id} className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border ${
                      isVerified ? 'bg-urgency-stable/5 border-urgency-stable/20' : 
                      isExpired ? 'bg-urgency-warning/5 border-urgency-warning/20' :
                      'bg-urgency-critical/5 border-urgency-critical/20'
                    }`}>
                      <div className="flex items-center gap-4 mb-3 md:mb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isVerified ? 'bg-urgency-stable/20 text-urgency-stable' :
                          isExpired ? 'bg-urgency-warning/20 text-urgency-warning' :
                          'bg-urgency-critical/20 text-urgency-critical'
                        }`}>
                          {isVerified ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        </div>
                        <div>
                          <p className="font-sans font-bold text-primary">{pledge.quantity}x {need?.itemName || 'Item'}</p>
                          <p className="font-mono text-[10px] text-neutralGray">{new Date(pledge.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider ${
                          isVerified ? 'bg-urgency-stable/20 text-urgency-stable' :
                          isExpired ? 'bg-urgency-warning/20 text-urgency-warning' :
                          'bg-urgency-critical/20 text-urgency-critical'
                        }`}>
                          {pledge.status.replace('_', ' ')}
                        </span>
                        {isVerified && pledge.status === 'verified_partial' && (
                          <p className="font-outfit text-xs text-neutralGray mt-1">
                            {pledge.actualDelivered} of {pledge.quantity} delivered
                          </p>
                        )}
                        {isExpired && (
                          <p className="font-outfit text-xs text-urgency-critical mt-1 flex items-center justify-end gap-1">
                            <AlertTriangle size={12} /> Strike added
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl bg-white rounded-3xl p-8 border border-neutralGray/20 shadow-sm">
              <h2 className="font-sans font-bold text-2xl text-primary mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-neutralGray/10">
                  <div>
                    <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Name</p>
                    <p className="font-outfit font-semibold text-primary">{currentUser.name}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Phone</p>
                    <p className="font-outfit font-semibold text-primary">{currentUser.phone}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Account Type</p>
                    <span className="inline-block px-2 py-1 bg-primary/5 text-primary rounded font-mono text-[10px] uppercase font-bold">
                      {currentUser.type}
                    </span>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-neutralGray uppercase tracking-wider mb-1">Member Since</p>
                    <p className="font-outfit font-semibold text-primary">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-neutralGray/10">
                  <div>
                    <h4 className="font-sans font-bold text-primary flex items-center gap-2">
                      {currentUser.isAnonymous ? <EyeOff size={16} className="text-accent" /> : <Eye size={16} />}
                      Anonymous Mode
                    </h4>
                    <p className="font-outfit text-xs text-neutralGray mt-1 max-w-xs">
                      When active, your name will be hidden on the public needs board. The coordinator can still see your details.
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleAnonymous(currentUser.id)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${currentUser.isAnonymous ? 'bg-accent' : 'bg-primary/20'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${currentUser.isAnonymous ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="p-4 bg-urgency-critical/5 rounded-2xl border border-urgency-critical/10">
                  <h4 className="font-sans font-bold text-urgency-critical flex items-center gap-2">
                    <AlertTriangle size={16} /> Strike System Status
                  </h4>
                  <div className="flex items-center gap-2 mt-3">
                    {[1, 2, 3].map(strike => (
                      <div key={strike} className={`flex-1 h-2 rounded-full ${
                        strike <= currentUser.strikes ? 'bg-urgency-critical' : 'bg-urgency-critical/20'
                      }`}></div>
                    ))}
                  </div>
                  <p className="font-outfit text-xs text-urgency-critical/80 mt-3">
                    You have <strong>{currentUser.strikes}</strong> strike(s). Pledges that expire without delivery result in a strike. 3 strikes will restrict your account to prevent hoarding of needs.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
