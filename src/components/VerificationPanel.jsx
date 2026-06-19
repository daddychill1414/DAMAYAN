import React, { useState } from 'react';
import { useStore } from '../store';
import { UrgencyBadge } from './UrgencyBadge';
import { QrCode, Hash, Search, CheckCircle, AlertTriangle, XCircle, Package, User, Phone } from 'lucide-react';

export const VerificationPanel = () => {
  const { findPledgeByCode, findPledgesByDonorSearch, verifyPledge, needs, getDonor } = useStore();
  const [activeTab, setActiveTab] = useState('code'); // 'qr' | 'code' | 'fallback'
  const [codeInput, setCodeInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [foundPledge, setFoundPledge] = useState(null);
  const [foundPledges, setFoundPledges] = useState([]);
  const [partialQty, setPartialQty] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'qr', label: 'QR Scan', icon: QrCode },
    { id: 'code', label: 'Manual Code', icon: Hash },
    { id: 'fallback', label: 'Search', icon: Search },
  ];

  const handleCodeLookup = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setError('Please enter a verification code'); return; }
    const pledge = findPledgeByCode(code);
    if (!pledge) { setError('No active pledge found with this code'); setFoundPledge(null); return; }
    setFoundPledge(pledge);
    setError('');
  };

  const handleFallbackSearch = () => {
    const term = searchInput.trim();
    if (!term) { setError('Please enter a phone number or name'); return; }
    const results = findPledgesByDonorSearch(term);
    if (results.length === 0) { setError('No active pledges found'); setFoundPledges([]); return; }
    setFoundPledges(results);
    setError('');
  };

  const handleVerify = (pledgeId, type) => {
    const actualQty = type === 'partial' ? parseInt(partialQty) : null;
    if (type === 'partial' && (!actualQty || actualQty <= 0)) {
      setError('Please enter the actual delivered quantity');
      return;
    }
    const res = verifyPledge(pledgeId, type, actualQty);
    if (res.success) {
      setVerifyResult(type);
      setTimeout(() => {
        setFoundPledge(null);
        setFoundPledges([]);
        setVerifyResult(null);
        setCodeInput('');
        setSearchInput('');
        setPartialQty('');
      }, 3000);
    }
  };

  const renderPledgeDetails = (pledge) => {
    const need = needs.find(n => n.id === pledge.needId);
    const donor = getDonor(pledge.donorId);

    if (verifyResult) {
      return (
        <div className="text-center py-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            verifyResult === 'reject' ? 'bg-red-500/10' : 'bg-green-500/10'
          }`}>
            {verifyResult === 'reject'
              ? <XCircle size={32} className="text-red-500" />
              : <CheckCircle size={32} className="text-green-500" />
            }
          </div>
          <h3 className="font-sans font-bold text-xl text-primary mb-1">
            {verifyResult === 'full' ? 'Fully Verified!' :
             verifyResult === 'partial' ? 'Partially Verified' : 'Rejected'}
          </h3>
          <p className="font-outfit text-sm text-dark/60">Needs pool updated automatically</p>
        </div>
      );
    }

    return (
      <div className="mt-6 p-5 bg-white rounded-2xl border border-primary/10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-sans font-bold text-lg text-primary">Pledge Details</h4>
          <UrgencyBadge urgency={need?.urgency || 'stable'} size="small" />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
            <Package size={16} className="text-accent shrink-0" />
            <div>
              <p className="font-outfit text-xs text-dark/50">Item</p>
              <p className="font-outfit text-sm font-semibold text-primary">{need?.itemName || 'Unknown'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded-xl">
              <p className="font-outfit text-xs text-dark/50">Pledged Qty</p>
              <p className="font-mono text-xl font-bold text-primary">{pledge.quantity}</p>
            </div>
            <div className="p-3 bg-background rounded-xl">
              <p className="font-outfit text-xs text-dark/50">Code</p>
              <p className="font-mono text-sm font-bold text-accent">{pledge.verificationCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
            <User size={16} className="text-primary/60 shrink-0" />
            <div>
              <p className="font-outfit text-xs text-dark/50">Donor</p>
              <p className="font-outfit text-sm font-semibold text-primary">
                {donor?.isAnonymous ? 'Anonymous Donor' : donor?.name || 'Unknown'}
              </p>
            </div>
          </div>
          {donor && !donor.isAnonymous && (
            <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
              <Phone size={16} className="text-primary/60 shrink-0" />
              <div>
                <p className="font-outfit text-xs text-dark/50">Phone</p>
                <p className="font-mono text-sm text-primary">{donor.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Verification Actions */}
        <div className="space-y-3">
          <button
            onClick={() => handleVerify(pledge.id, 'full')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-outfit font-bold text-sm hover:bg-green-600 transition-colors"
          >
            <CheckCircle size={16} /> Full Match — {pledge.quantity} delivered
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={pledge.quantity - 1}
              value={partialQty}
              onChange={(e) => setPartialQty(e.target.value)}
              placeholder="Actual qty"
              className="flex-1 bg-background border border-primary/10 rounded-xl px-3 py-3 font-mono text-sm outline-none focus:border-amber-500"
            />
            <button
              onClick={() => handleVerify(pledge.id, 'partial')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-outfit font-bold text-sm hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              <AlertTriangle size={14} /> Partial
            </button>
          </div>

          <button
            onClick={() => handleVerify(pledge.id, 'reject')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-500 rounded-xl font-outfit font-bold text-sm hover:bg-red-500/20 transition-colors border border-red-500/20"
          >
            <XCircle size={16} /> Reject — Return to Pool
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setFoundPledge(null); setFoundPledges([]); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-outfit text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-background shadow-lg'
                : 'bg-primary/5 text-dark/60 hover:bg-primary/10'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* QR Scan Tab */}
      {activeTab === 'qr' && (
        <div className="text-center py-12">
          <div className="w-48 h-48 mx-auto mb-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-3">
            <QrCode size={48} className="text-primary/30" />
            <p className="font-outfit text-xs text-dark/40">Camera scanner</p>
            <p className="font-mono text-[9px] text-dark/30">(Simulated)</p>
          </div>
          <p className="font-outfit text-sm text-dark/60 mb-4">Point camera at donor's QR code</p>
          <p className="font-outfit text-xs text-dark/40">Or use Manual Code / Search tabs instead</p>
        </div>
      )}

      {/* Manual Code Tab */}
      {activeTab === 'code' && (
        <div>
          <label className="block font-outfit text-sm font-semibold text-primary mb-2">Enter Verification Code</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setError(''); }}
              placeholder="DMY-XXXX"
              maxLength={8}
              className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-3 font-mono text-lg font-bold text-primary text-center tracking-[0.2em] outline-none focus:border-accent uppercase"
            />
            <button
              onClick={handleCodeLookup}
              className="px-6 py-3 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Look Up
            </button>
          </div>
          {error && (
            <p className="font-outfit text-xs text-red-500 mt-2">{error}</p>
          )}
          {foundPledge && renderPledgeDetails(foundPledge)}
        </div>
      )}

      {/* Fallback Search Tab */}
      {activeTab === 'fallback' && (
        <div>
          <label className="block font-outfit text-sm font-semibold text-primary mb-2">Search by Phone or Name</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setError(''); }}
              placeholder="Phone number or donor name..."
              className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
            />
            <button
              onClick={handleFallbackSearch}
              className="px-6 py-3 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
          {error && (
            <p className="font-outfit text-xs text-red-500 mt-2">{error}</p>
          )}
          {foundPledges.length > 0 && (
            <div className="mt-6 space-y-4">
              <p className="font-outfit text-sm font-semibold text-primary">{foundPledges.length} active pledge(s) found</p>
              {foundPledges.map(pledge => (
                <div key={pledge.id}>
                  {renderPledgeDetails(pledge)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
