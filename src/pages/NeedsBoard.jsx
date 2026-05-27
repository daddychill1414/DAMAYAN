import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { AlertTriangle, MapPin, Package } from 'lucide-react';

export const NeedsBoard = () => {
  const { needs, centers, pledgeNeed, showToast } = useStore();
  const [pledgeAmounts, setPledgeAmounts] = useState({});
  const [duplicateAlert, setDuplicateAlert] = useState(null);

  const getCenter = (id) => centers.find(c => c.id === id);

  const handlePledge = (need) => {
    const amount = parseInt(pledgeAmounts[need.id] || 0);
    if (!amount || amount <= 0) return;

    // Duplicate Alert System Logic
    const remainingNeeded = Math.max(0, need.requested - need.pledged - need.delivered);
    if (amount > remainingNeeded) {
      // Find another center that needs the same category
      const alternative = needs.find(n => n.category === need.category && n.id !== need.id && (n.requested - n.pledged - n.delivered > 0));
      
      setDuplicateAlert({
        originalNeed: need,
        amount,
        alternative
      });
      return;
    }

    // Success
    pledgeNeed(need.id, amount);
    setPledgeAmounts({ ...pledgeAmounts, [need.id]: '' });
    showToast("Pledge successful! Thank you.", 'success');
  };

  const confirmAlternativePledge = () => {
    if (duplicateAlert.alternative) {
      pledgeNeed(duplicateAlert.alternative.id, duplicateAlert.amount);
      showToast(`Pledge successfully rerouted to ${getCenter(duplicateAlert.alternative.centerId).name}!`, 'success');
    } else {
      pledgeNeed(duplicateAlert.originalNeed.id, duplicateAlert.amount);
      showToast("Pledge added despite surplus.", 'warning');
    }
    setDuplicateAlert(null);
    setPledgeAmounts({ ...pledgeAmounts, [duplicateAlert.originalNeed.id]: '' });
  };

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-[80vh] bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Live Needs Board</h1>
        <p className="font-outfit text-dark/70 mb-12 max-w-2xl text-lg">Real-time requests directly from evacuation centers. Choose what you can provide.</p>

        {duplicateAlert && (
          <div className="mb-8 p-6 bg-accent/10 border border-accent rounded-2xl flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-accent/20 p-3 rounded-full text-accent shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-sans font-bold text-xl text-accent mb-2">Duplicate Alert</h3>
              <p className="font-outfit text-dark/80 mb-4">
                You are trying to pledge {duplicateAlert.amount} of {duplicateAlert.originalNeed.item}, but {getCenter(duplicateAlert.originalNeed.centerId).name} only needs {Math.max(0, duplicateAlert.originalNeed.requested - duplicateAlert.originalNeed.pledged - duplicateAlert.originalNeed.delivered)} more. Pledging this might cause a surplus dump.
              </p>
              {duplicateAlert.alternative ? (
                <div className="bg-white p-4 rounded-xl border border-primary/10 mb-4 shadow-sm">
                  <p className="font-outfit text-primary font-semibold mb-2">Smart Match Suggestion:</p>
                  <p className="font-outfit text-dark/70 text-sm">{getCenter(duplicateAlert.alternative.centerId).name} urgently needs {duplicateAlert.alternative.category} items.</p>
                  <button 
                    onClick={confirmAlternativePledge}
                    className="mt-3 bg-primary text-background px-4 py-2 rounded-lg font-outfit text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    Reroute Pledge Here
                  </button>
                </div>
              ) : (
                <p className="font-outfit text-dark/60 italic text-sm mb-4">No alternative centers found for this category.</p>
              )}
              <button 
                onClick={() => setDuplicateAlert(null)}
                className="text-dark/50 hover:text-dark text-sm font-outfit underline"
              >
                Cancel Pledge
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {needs.map(need => {
            const center = getCenter(need.centerId);
            const remaining = Math.max(0, need.requested - need.pledged - need.delivered);
            const progress = ((need.pledged + need.delivered) / need.requested) * 100;

            return (
              <div key={need.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-primary/5 border border-primary/5 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded-full">
                    {need.category}
                  </span>
                  {remaining === 0 && <span className="font-mono text-[10px] text-green-600 bg-green-100 px-2 py-1 rounded-full uppercase">Fulfilled</span>}
                </div>
                
                <h3 className="font-sans font-bold text-2xl text-primary mb-1">{need.item}</h3>
                <div className="flex items-center gap-2 text-dark/60 font-outfit text-sm mb-6">
                  <MapPin size={14} /> {center.name}
                </div>

                <div className="mb-6">
                  <div className="flex justify-between font-mono text-xs mb-2">
                    <span className="text-dark/50">Requested: {need.requested}</span>
                    <span className="text-primary font-bold">{remaining} needed</span>
                  </div>
                  <div className="w-full bg-primary/10 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3">
                  <input 
                    type="number" 
                    min="1"
                    placeholder="Qty"
                    disabled={remaining === 0}
                    value={pledgeAmounts[need.id] || ''}
                    onChange={(e) => setPledgeAmounts({...pledgeAmounts, [need.id]: e.target.value})}
                    className="w-20 bg-background border border-primary/10 rounded-xl px-3 py-3 font-mono text-sm outline-none focus:border-accent disabled:opacity-50"
                  />
                  <MagneticButton 
                    onClick={() => handlePledge(need)}
                    disabled={remaining === 0}
                    className="flex-1 bg-primary text-background py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Pledge <Package size={16} />
                  </MagneticButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
