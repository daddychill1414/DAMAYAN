import React, { useState } from 'react';
import { useStore } from '../store';
import { QRDisplay } from './QRDisplay';
import { UrgencyBadge } from './UrgencyBadge';
import { CountdownTimer } from './CountdownTimer';
import { LoadingSpinner } from './LoadingSpinner';
import { HelperTooltip } from './HelperTooltip';
import { X, Package, MapPin, Minus, Plus, Eye, EyeOff, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const PledgeModal = () => {
  const { pledgeModal, closePledgeModal, needs, currentUser, createPledge, showToast, isProcessing, setProcessing } = useStore();
  const [quantity, setQuantity] = useState('');
  const [anonymous, setAnonymous] = useState(currentUser?.isAnonymous || false);
  const [result, setResult] = useState(null); // { pledge } on success
  const [error, setError] = useState('');

  if (!pledgeModal) return null;

  const need = needs.find(n => n.id === pledgeModal.needId);
  if (!need) return null;

  const remaining = Math.max(0, need.quantityNeeded - need.quantityPledged - need.quantityDelivered);

  const handleQuantityChange = (val) => {
    setError('');
    let num = parseInt(val);
    if (isNaN(num)) {
      setQuantity('');
      return;
    }
    if (num > remaining) {
      setError(`Cannot pledge more than ${remaining}. The quantity has been adjusted.`);
      num = remaining;
    }
    setQuantity(String(num));
  };

  const handlePledge = async () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity greater than 0.');
      return;
    }
    if (qty > remaining) {
      setError(`You can only pledge up to ${remaining} items.`);
      return;
    }
    if (!currentUser) {
      setError('Please log in to make a pledge.');
      return;
    }

    setProcessing(true);
    // Simulate network request
    await new Promise(r => setTimeout(r, 600));

    const res = createPledge(need.id, currentUser.id, qty);
    setProcessing(false);

    if (!res.success) {
      setError(res.error);
      return;
    }

    setResult(res);
    setError('');
    showToast(`Pledge created! ${qty}x ${need.itemName}`, 'success');
  };

  const presets = [5, 10, 20].filter(p => p <= remaining);

  const handleClose = () => {
    setQuantity('');
    setResult(null);
    setError('');
    closePledgeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm" onClick={!isProcessing ? handleClose : undefined}></div>

      {/* Modal */}
      <div className="relative bg-background rounded-[2rem] shadow-2xl border border-neutralGray/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-neutralGray/10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UrgencyBadge urgency={need.urgency} size="small" showUrgentTag />
                <span className="font-mono text-[9px] text-neutralGray uppercase tracking-wider">{need.category}</span>
              </div>
              <h2 className="font-sans font-bold text-2xl text-primary">{need.itemName}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-neutralGray">
                <MapPin size={12} />
                <span className="font-outfit text-xs">{need.dropOffPoint}</span>
              </div>
            </div>
            {!isProcessing && !result && (
              <button onClick={handleClose} className="p-2 hover:bg-neutralGray/10 rounded-xl transition-colors">
                <X size={20} className="text-neutralGray" />
              </button>
            )}
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
                <div className="w-full bg-neutralGray/10 h-2 rounded-full overflow-hidden flex">
                  <div className="h-full bg-urgency-stable transition-all duration-500"
                    style={{ width: `${Math.min(100, (need.quantityDelivered / need.quantityNeeded) * 100)}%` }}>
                  </div>
                  <div className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${Math.min(100, (need.quantityPledged / need.quantityNeeded) * 100)}%` }}>
                  </div>
                </div>
              </div>

              {/* Quantity input */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-outfit text-sm font-semibold text-primary">Pledge Quantity</label>
                  <HelperTooltip text="You can pledge a partial amount! Every bit helps. Just enter what you can comfortably provide." position="top" />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(String(Math.max(1, (parseInt(quantity) || 0) - 1)))}
                    disabled={parseInt(quantity) <= 1}
                    className="p-2.5 bg-neutralGray/5 hover:bg-neutralGray/10 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Minus size={16} className="text-primary" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={remaining}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    placeholder="0"
                    className="flex-1 text-center bg-white border border-neutralGray/20 rounded-xl px-4 py-3 font-mono text-2xl font-bold text-primary outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(String(Math.min(remaining, (parseInt(quantity) || 0) + 1)))}
                    disabled={parseInt(quantity) >= remaining}
                    className="p-2.5 bg-neutralGray/5 hover:bg-neutralGray/10 rounded-xl transition-colors disabled:opacity-50"
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
                    onClick={() => handleQuantityChange(String(p))}
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
                  onClick={() => handleQuantityChange(String(remaining))}
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
                className="flex items-center gap-3 w-full p-3 rounded-xl border border-neutralGray/20 hover:bg-neutralGray/5 transition-colors mb-4"
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

              {/* Error Panel */}
              {error && (
                <div className="mb-4 p-3 bg-urgency-critical/10 border border-urgency-critical/20 rounded-xl flex items-start gap-2">
                  <AlertTriangle size={16} className="text-urgency-critical shrink-0 mt-0.5" />
                  <p className="font-outfit text-xs text-urgency-critical leading-relaxed">{error}</p>
                </div>
              )}

              {/* Time Indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-4 text-urgency-warning font-outfit text-xs font-semibold">
                <Clock size={14} />
                <span>Pledge expires in 24 hours</span>
                <HelperTooltip text="You must deliver the items to the drop-off point within 24 hours, otherwise the pledge is canceled and you may receive a strike." />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePledge}
                  disabled={!quantity || parseInt(quantity) <= 0 || remaining <= 0 || isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-background py-4 rounded-xl font-outfit font-bold text-sm btn-magnetic hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <LoadingSpinner label="Reserving Items..." />
                  ) : (
                    <>
                      <Package size={18} /> Confirm Pledge
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 bg-background text-neutralGray py-3.5 rounded-xl border-2 border-neutralGray/20 font-outfit font-bold text-sm hover:border-neutralGray/40 hover:text-primary transition-all disabled:opacity-50"
                >
                  <X size={16} /> Cancel Pledge
                </button>
              </div>
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
