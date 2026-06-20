import React, { useState } from 'react';
import { useStore } from '../store';
import { QRDisplay } from './QRDisplay';
import { UrgencyBadge } from './UrgencyBadge';
import { CountdownTimer } from './CountdownTimer';
import { X, Package, MapPin, Minus, Plus, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const PledgeModal = () => {
  const { pledgeModal, closePledgeModal, needs, currentUser, createPledge, showToast } = useStore();
  const [quantity, setQuantity] = useState('');
  const [anonymous, setAnonymous] = useState(currentUser?.isAnonymous || false);
  const [result, setResult] = useState(null); // { pledge } on success
  const [error, setError] = useState('');

  if (!pledgeModal) return null;

  const need = needs.find(n => n.id === pledgeModal.needId);
  if (!need) return null;

  const remaining = Math.max(0, need.quantityNeeded - need.quantityPledged - need.quantityDelivered);

  const handlePledge = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    if (!currentUser) {
      setError('Please log in to make a pledge');
      return;
    }

    const res = createPledge(need.id, currentUser.id, qty);
    if (!res.success) {
      setError(res.error);
      return;
    }

    setResult(res);
    setError('');
    showToast(`Pledge created! ${qty}x ${need.itemName}`, 'success');
  };

  const presets = [5, 10, 20];

  const handleClose = () => {
    setQuantity('');
    setResult(null);
    setError('');
    closePledgeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={handleClose}></div>

      {/* Modal */}
      <div className="relative bg-background rounded-[2rem] shadow-2xl border border-neutralGray/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutralGray/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UrgencyBadge urgency={need.urgency} size="small" />
                <span className="font-mono text-[9px] text-neutralGray uppercase tracking-wider">{need.category}</span>
              </div>
              <h2 className="font-sans font-bold text-2xl text-primary">{need.itemName}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-neutralGray">
                <MapPin size={12} />
                <span className="font-outfit text-xs">{need.dropOffPoint}</span>
              </div>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-neutralGray/10 rounded-xl transition-colors">
              <X size={20} className="text-neutralGray" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              {/* Remaining quantity */}
              <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-neutralGray/10">
                <div>
                  <p className="font-mono text-[9px] text-neutralGray uppercase tracking-wider mb-1">Remaining Need</p>
                  <p className="font-sans font-bold text-3xl text-primary">{remaining}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] text-neutralGray uppercase tracking-wider mb-1">Total Requested</p>
                  <p className="font-outfit text-sm text-neutralGray">{need.quantityNeeded}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-[9px] font-mono text-neutralGray mb-1.5">
                  <span>Pledged: {need.quantityPledged}</span>
                  <span>Delivered: {need.quantityDelivered}</span>
                </div>
                <div className="w-full bg-neutralGray/10 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-urgency-stable transition-all duration-500"
                    style={{ width: `${Math.min(100, (need.quantityDelivered / need.quantityNeeded) * 100)}%` }}>
                  </div>
                  <div className="h-full bg-accent/60 -mt-2 transition-all duration-500"
                    style={{ width: `${Math.min(100, ((need.quantityPledged + need.quantityDelivered) / need.quantityNeeded) * 100)}%` }}>
                  </div>
                </div>
              </div>

              {/* Quantity input */}
              <div className="mb-4">
                <label className="block font-outfit text-sm font-semibold text-primary mb-2">Pledge Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => String(Math.max(1, (parseInt(prev) || 0) - 1)))}
                    className="p-2.5 bg-neutralGray/5 hover:bg-neutralGray/10 rounded-xl transition-colors"
                  >
                    <Minus size={16} className="text-primary" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={remaining}
                    value={quantity}
                    onChange={(e) => { setQuantity(e.target.value); setError(''); }}
                    placeholder="0"
                    className="flex-1 text-center bg-white border border-neutralGray/20 rounded-xl px-4 py-3 font-mono text-2xl font-bold text-primary outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => String(Math.min(remaining, (parseInt(prev) || 0) + 1)))}
                    className="p-2.5 bg-neutralGray/5 hover:bg-neutralGray/10 rounded-xl transition-colors"
                  >
                    <Plus size={16} className="text-primary" />
                  </button>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex gap-2 mb-6">
                {presets.map(p => (
                  <button
                    key={p}
                    onClick={() => { setQuantity(String(Math.min(p, remaining))); setError(''); }}
                    className={`flex-1 py-2 rounded-xl font-mono text-sm font-bold transition-all ${
                      parseInt(quantity) === p
                        ? 'bg-primary text-background'
                        : 'bg-neutralGray/5 text-primary hover:bg-neutralGray/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => { setQuantity(String(remaining)); setError(''); }}
                  className={`flex-1 py-2 rounded-xl font-mono text-sm font-bold transition-all ${
                    parseInt(quantity) === remaining
                      ? 'bg-accent text-background'
                      : 'bg-accent/10 text-accent hover:bg-accent/20'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Anonymous toggle */}
              <button
                onClick={() => setAnonymous(!anonymous)}
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-neutralGray/20 hover:bg-neutralGray/5 transition-colors mb-6"
              >
                <div className={`p-1.5 rounded-lg ${anonymous ? 'bg-accent/10 text-accent' : 'bg-neutralGray/10 text-neutralGray'}`}>
                  {anonymous ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
                <div className="text-left flex-1">
                  <p className="font-outfit text-sm font-semibold text-primary">Anonymous Donation</p>
                  <p className="font-outfit text-[10px] text-neutralGray">Your name will be hidden from the public feed</p>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${anonymous ? 'bg-accent justify-end' : 'bg-primary/20 justify-start'}`}>
                  <div className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm"></div>
                </div>
              </button>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 bg-urgency-critical/10 border border-urgency-critical/20 rounded-xl">
                  <p className="font-outfit text-xs text-urgency-critical">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handlePledge}
                disabled={!quantity || parseInt(quantity) <= 0 || remaining <= 0}
                className="w-full flex items-center justify-center gap-2 bg-primary text-background py-4 rounded-xl font-outfit font-bold text-sm btn-magnetic hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package size={18} />
                Confirm Pledge
              </button>

              <p className="font-outfit text-[10px] text-neutralGray text-center mt-3">
                ⏱ Pledges expire after 24 hours if not verified
              </p>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="text-center">
              <div className="w-16 h-16 bg-urgency-stable/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-urgency-stable" />
              </div>
              <h3 className="font-sans font-bold text-xl text-primary mb-1">Pledge Confirmed!</h3>
              <p className="font-outfit text-sm text-neutralGray mb-6">
                {result.pledge.quantity}x {need.itemName}
              </p>

              {/* QR + Code */}
              <QRDisplay
                qrData={result.pledge.qrData}
                verificationCode={result.pledge.verificationCode}
              />

              {/* Countdown */}
              <div className="mt-6">
                <CountdownTimer expiresAt={result.pledge.expiresAt} compact />
                <p className="font-outfit text-[10px] text-neutralGray mt-2">
                  Deliver within 24 hours to avoid expiration
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full mt-6 py-3 bg-neutralGray/10 text-primary rounded-xl font-outfit font-semibold text-sm hover:bg-neutralGray/20 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
