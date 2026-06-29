import React, { useState } from 'react';
import { useStore } from '../store';
import { UrgencyBadge } from './UrgencyBadge';
import { ConfirmDialog } from './ConfirmDialog';
import { LoadingSpinner } from './LoadingSpinner';
import { HelperTooltip } from './HelperTooltip';
import { QrCode, Hash, Search, CheckCircle, AlertTriangle, XCircle, Package, User, Phone, X } from 'lucide-react';

export const VerificationPanel = () => {
  const { findPledgeByCode, findPledgesByDonorSearch, verifyPledge, needs, getDonor, isProcessing, setProcessing } = useStore();
  const [activeTab, setActiveTab] = useState('code'); // 'qr' | 'code' | 'fallback'
  const [codeInput, setCodeInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [foundPledge, setFoundPledge] = useState(null);
  const [foundPledges, setFoundPledges] = useState([]);
  const [partialQty, setPartialQty] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState('');

  // Confirmation Dialog State
  const [confirmState, setConfirmState] = useState({ open: false, type: null, pledgeId: null });

  const tabs = [
    { id: 'qr', label: 'QR Scan', icon: QrCode },
    { id: 'code', label: 'Manual Code', icon: Hash },
    { id: 'fallback', label: 'Search', icon: Search },
  ];

  const handleCodeLookup = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setError('Please enter a verification code (e.g., DMY-XXXX)'); return; }
    const pledge = findPledgeByCode(code);
    if (!pledge) { setError('No active pledge found with this code. Check for typos or if the pledge expired.'); setFoundPledge(null); return; }
    setFoundPledge(pledge);
    setError('');
  };

  const handleFallbackSearch = () => {
    const term = searchInput.trim();
    if (!term) { setError('Please enter a phone number or donor name to search.'); return; }
    const results = findPledgesByDonorSearch(term);
    if (results.length === 0) { setError('No active pledges found for that donor. They may have expired or not exist.'); setFoundPledges([]); return; }
    setFoundPledges(results);
    setError('');
  };

  const handleVerifyClick = (pledgeId, type) => {
    if (type === 'partial') {
      const actualQty = parseInt(partialQty);
      const maxQty = foundPledge?.quantity - 1 || 1;
      if (!actualQty || actualQty <= 0) {
        setError('Please enter a valid delivered quantity (greater than 0).');
        return;
      }
      if (actualQty >= foundPledge?.quantity) {
         setError('Partial quantity must be less than the total pledged. Use "Full Match" if everything was delivered.');
         return;
      }
    }
    setError('');
    setConfirmState({ open: true, type, pledgeId });
  };

  const executeVerify = async () => {
    const { type, pledgeId } = confirmState;
    const actualQty = type === 'partial' ? parseInt(partialQty) : null;
    
    setProcessing(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    const res = verifyPledge(pledgeId, type, actualQty);
    setProcessing(false);
    setConfirmState({ open: false, type: null, pledgeId: null });

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
    } else {
      setError(res.error || 'Verification failed.');
    }
  };

  const renderPledgeDetails = (pledge) => {
    const need = needs.find(n => n.id === pledge.needId);
    const donor = getDonor(pledge.donorId);

    if (verifyResult) {
      return (
        <div className="text-center py-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            verifyResult === 'reject' ? 'bg-urgency-critical/10' : 'bg-urgency-stable/10'
          }`}>
            {verifyResult === 'reject'
              ? <XCircle size={32} className="text-urgency-critical" />
              : <CheckCircle size={32} className="text-urgency-stable" />
            }
          </div>
          <h3 className="font-sans font-bold text-xl text-primary mb-1">
            {verifyResult === 'full' ? 'Fully Verified!' :
             verifyResult === 'partial' ? 'Partially Verified' : 'Rejected'}
          </h3>
          <p className="font-outfit text-sm text-neutralGray">Needs pool updated automatically</p>
        </div>
      );
    }

    return (
      <div className="mt-6 p-5 bg-white rounded-2xl border border-neutralGray/20 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-sans font-bold text-lg text-primary">Pledge Details</h4>
          <UrgencyBadge urgency={need?.urgency || 'stable'} size="small" showUrgentTag />
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
            <Package size={16} className="text-accent shrink-0" />
            <div>
              <p className="font-outfit text-xs text-neutralGray">Item</p>
              <p className="font-outfit text-sm font-semibold text-primary">{need?.itemName || 'Unknown'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded-xl border border-accent/20">
              <p className="font-outfit text-xs text-neutralGray">Pledged Qty</p>
              <p className="font-mono text-2xl font-bold text-primary">{pledge.quantity}</p>
            </div>
            <div className="p-3 bg-background rounded-xl">
              <p className="font-outfit text-xs text-neutralGray">Code</p>
              <p className="font-mono text-sm font-bold text-accent">{pledge.verificationCode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
            <User size={16} className="text-neutralGray shrink-0" />
            <div>
              <p className="font-outfit text-xs text-neutralGray">Donor</p>
              <p className="font-outfit text-sm font-semibold text-primary">
                {donor?.isAnonymous ? 'Anonymous Donor' : donor?.name || 'Unknown'}
              </p>
            </div>
          </div>
          {donor && !donor.isAnonymous && (
            <div className="flex items-center gap-3 p-3 bg-background rounded-xl">
              <Phone size={16} className="text-neutralGray shrink-0" />
              <div>
                <p className="font-outfit text-xs text-neutralGray">Phone</p>
                <p className="font-mono text-sm text-primary">{donor.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Verification Actions */}
        <div className="space-y-3">
          <button
            onClick={() => handleVerifyClick(pledge.id, 'full')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-urgency-stable text-white rounded-xl font-outfit font-bold text-sm hover:bg-urgency-stable/90 transition-all shadow-md shadow-urgency-stable/20"
          >
            <CheckCircle size={18} /> Full Match — {pledge.quantity} delivered
          </button>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={pledge.quantity - 1}
              value={partialQty}
              onChange={(e) => { setPartialQty(e.target.value); setError(''); }}
              placeholder="Actual qty"
              className="flex-1 bg-background border border-neutralGray/20 rounded-xl px-3 py-3 font-mono text-sm outline-none focus:border-urgency-warning"
            />
            <button
              onClick={() => handleVerifyClick(pledge.id, 'partial')}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-urgency-warning text-white rounded-xl font-outfit font-bold text-sm hover:bg-urgency-warning/90 transition-all whitespace-nowrap shadow-sm"
            >
              <AlertTriangle size={16} /> Partial
            </button>
            <HelperTooltip text="Use Partial if the donor delivered fewer items than pledged. The remaining quantity will be returned to the needs pool." position="top" />
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleVerifyClick(pledge.id, 'reject')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-background text-urgency-critical rounded-xl font-outfit font-bold text-sm hover:bg-urgency-critical/5 transition-colors border border-urgency-critical/30"
            >
              <XCircle size={16} /> Reject Donation
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getConfirmProps = () => {
    const p = foundPledge || foundPledges.find(p => p.id === confirmState.pledgeId);
    if (confirmState.type === 'full') {
      return {
        title: 'Verify Full Delivery?',
        message: `Confirm that the donor delivered exactly ${p?.quantity} items. This will fulfill the pledge.`,
        confirmLabel: 'Yes, Fully Verified',
        variant: 'info',
        icon: CheckCircle
      };
    }
    if (confirmState.type === 'partial') {
      return {
        title: 'Verify Partial Delivery?',
        message: `Confirm that only ${partialQty} items were delivered. The remaining ${p?.quantity - parseInt(partialQty)} will be returned to the needs pool.`,
        confirmLabel: 'Confirm Partial',
        variant: 'warning',
        icon: AlertTriangle
      };
    }
    if (confirmState.type === 'reject') {
      return {
        title: 'Reject Donation?',
        message: `Are you sure you want to reject this donation? The full quantity will be returned to the pool and the donor will receive a strike.`,
        confirmLabel: 'Yes, Reject',
        variant: 'danger',
        icon: XCircle
      };
    }
    return {};
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
                : 'bg-neutralGray/10 text-neutralGray hover:bg-neutralGray/20'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* QR Scan Tab */}
      {activeTab === 'qr' && (
        <div className="text-center py-12">
          <div className="w-48 h-48 mx-auto mb-6 rounded-2xl border-2 border-dashed border-neutralGray/20 bg-neutralGray/5 flex flex-col items-center justify-center gap-3">
            <QrCode size={48} className="text-neutralGray/30" />
            <p className="font-outfit text-xs text-neutralGray">Camera scanner</p>
            <p className="font-mono text-[9px] text-neutralGray/80">(Simulated)</p>
          </div>
          <p className="font-outfit text-sm text-neutralGray mb-4">Point camera at donor's QR code</p>
          <div className="flex items-center justify-center gap-2">
             <p className="font-outfit text-xs text-neutralGray">Or use Manual Code / Search tabs instead</p>
             <HelperTooltip text="In a real app, this would activate your device camera to scan the donor's QR code." />
          </div>
        </div>
      )}

      {/* Manual Code Tab */}
      {activeTab === 'code' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-outfit text-sm font-semibold text-primary">Enter Verification Code</label>
            <HelperTooltip text="The donor can find this 8-character code (e.g., DMY-1234) on their active pledge screen." />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => { setCodeInput(e.target.value.toUpperCase()); setError(''); }}
              placeholder="DMY-XXXX"
              maxLength={8}
              className="flex-1 bg-white border border-neutralGray/20 rounded-xl px-4 py-3 font-mono text-lg font-bold text-primary text-center tracking-[0.2em] outline-none focus:border-accent uppercase"
            />
            <button
              onClick={handleCodeLookup}
              className="px-6 py-3 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Look Up
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-urgency-critical/10 border border-urgency-critical/20 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-urgency-critical shrink-0 mt-0.5" />
              <p className="font-outfit text-xs text-urgency-critical leading-relaxed">{error}</p>
            </div>
          )}
          {foundPledge && renderPledgeDetails(foundPledge)}
        </div>
      )}

      {/* Fallback Search Tab */}
      {activeTab === 'fallback' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block font-outfit text-sm font-semibold text-primary">Search by Phone or Name</label>
            <HelperTooltip text="If the donor lost their code, you can search for their active pledges using their registered name or phone number." />
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setError(''); }}
              placeholder="Phone number or donor name..."
              className="flex-1 bg-white border border-neutralGray/20 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
            />
            <button
              onClick={handleFallbackSearch}
              className="px-6 py-3 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-urgency-critical/10 border border-urgency-critical/20 rounded-xl flex items-start gap-2">
              <AlertTriangle size={16} className="text-urgency-critical shrink-0 mt-0.5" />
              <p className="font-outfit text-xs text-urgency-critical leading-relaxed">{error}</p>
            </div>
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

      {/* Clear Results Button */}
      {(foundPledge || foundPledges.length > 0) && !verifyResult && (
        <button 
          onClick={() => { setFoundPledge(null); setFoundPledges([]); setCodeInput(''); setSearchInput(''); }}
          className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-background border-2 border-neutralGray/20 text-neutralGray rounded-xl font-outfit font-bold text-sm hover:border-neutralGray/40 hover:text-primary transition-all"
        >
          <X size={16} /> Cancel & Clear Search
        </button>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        onConfirm={executeVerify}
        onCancel={() => setConfirmState({ open: false, type: null, pledgeId: null })}
        isLoading={isProcessing}
        {...getConfirmProps()}
      />
    </div>
  );
};
