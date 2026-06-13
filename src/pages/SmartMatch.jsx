import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { MapPin, ArrowRight, Mic, Search, Package, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Food', 'Water', 'Medical', 'Hygiene', 'Clothing', 'Baby Needs'];

export const SmartMatch = () => {
  const { needs, centers, pledgeNeed, addDonation } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [donorItem, setDonorItem] = useState('');
  const [donorQty, setDonorQty] = useState('');
  const [matchResults, setMatchResults] = useState(null);
  const [pledgeSuccess, setPledgeSuccess] = useState(null);

  const handleSearch = () => {
    if (!selectedCategory) return;
    const matches = needs
      .filter(n => n.category === selectedCategory)
      .map(n => {
        const center = centers.find(c => c.id === n.centerId);
        const remaining = Math.max(0, n.requested - n.pledged - n.delivered);
        return { ...n, center, remaining };
      })
      .filter(m => m.remaining > 0)
      .sort((a, b) => b.remaining - a.remaining);
    setMatchResults(matches);
    setPledgeSuccess(null);
  };

  const handlePledge = (match) => {
    const qty = parseInt(donorQty) || match.remaining;
    const actualQty = Math.min(qty, match.remaining);

    // Check for over-pledging (Duplicate Alert)
    if (qty > match.remaining) {
      const alternativeCenter = needs
        .filter(n => n.category === selectedCategory && n.id !== match.id)
        .map(n => {
          const c = centers.find(c2 => c2.id === n.centerId);
          const rem = Math.max(0, n.requested - n.pledged - n.delivered);
          return { ...n, center: c, remaining: rem };
        })
        .filter(m => m.remaining > 0)[0];

      if (alternativeCenter) {
        setPledgeSuccess({
          type: 'redirect',
          msg: `Only ${match.remaining} needed at ${match.center.name}. We suggest rerouting ${qty - match.remaining} units to ${alternativeCenter.center.name}.`,
          match,
          alternative: alternativeCenter
        });
        return;
      }
    }

    pledgeNeed(match.id, actualQty);
    addDonation({ needId: match.id, item: match.item, amount: actualQty, center: match.center.name });
    setPledgeSuccess({
      type: 'success',
      msg: `${actualQty}x ${match.item} pledged to ${match.center.name}. A QR code will be generated for drop-off verification.`
    });
    // Refresh results
    handleSearch();
  };

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-screen bg-background text-primary">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-sans font-bold text-4xl md:text-5xl mb-2">Smart Donation Matching</h1>
        <p className="font-outfit text-dark/70 text-lg mb-12 max-w-2xl">
          Tell us what you can donate. We'll show you exactly which evacuation centers need it most — preventing donation dumping.
        </p>

        {/* Donor Input Panel */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-primary/5 mb-8">
          <h2 className="font-sans font-bold text-xl mb-6">What can you provide?</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setMatchResults(null); setPledgeSuccess(null); }}
                className={`p-3 rounded-xl text-sm font-outfit font-semibold border transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-primary text-background border-primary shadow-lg scale-[1.03]'
                    : 'bg-background border-primary/10 text-primary/70 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Item description (e.g., Canned sardines)"
                value={donorItem}
                onChange={(e) => setDonorItem(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-primary/10 bg-background font-outfit text-sm outline-none focus:border-accent"
              />
              <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 cursor-pointer hover:text-accent transition-colors" title="Voice input" />
            </div>
            <input
              type="number"
              placeholder="Qty"
              min="1"
              value={donorQty}
              onChange={(e) => setDonorQty(e.target.value)}
              className="w-24 py-3 px-4 rounded-xl border border-primary/10 bg-background font-mono text-sm outline-none focus:border-accent"
            />
            <MagneticButton
              onClick={handleSearch}
              className="bg-accent text-white px-8 py-3 text-sm shrink-0"
            >
              <Search size={16} /> Find Matches
            </MagneticButton>
          </div>
        </div>

        {/* Pledge Success / Redirect Alert */}
        {pledgeSuccess && (
          <div className={`mb-8 p-6 rounded-2xl border flex items-start gap-4 ${
            pledgeSuccess.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            {pledgeSuccess.type === 'success' ? (
              <Package className="text-green-600 shrink-0 mt-1" size={24} />
            ) : (
              <AlertTriangle className="text-yellow-600 shrink-0 mt-1" size={24} />
            )}
            <div>
              <p className="font-outfit font-semibold text-dark">{pledgeSuccess.msg}</p>
              {pledgeSuccess.type === 'redirect' && pledgeSuccess.alternative && (
                <button
                  onClick={() => {
                    const qty = parseInt(donorQty) || pledgeSuccess.match.remaining;
                    const matchQty = pledgeSuccess.match.remaining;
                    const overflowQty = qty - matchQty;
                    const altQty = Math.min(overflowQty, pledgeSuccess.alternative.remaining);

                    // Pledge to original
                    pledgeNeed(pledgeSuccess.match.id, matchQty);
                    addDonation({ needId: pledgeSuccess.match.id, item: pledgeSuccess.match.item, amount: matchQty, center: pledgeSuccess.match.center.name });
                    
                    // Pledge to alternative
                    if (altQty > 0) {
                      pledgeNeed(pledgeSuccess.alternative.id, altQty);
                      addDonation({ needId: pledgeSuccess.alternative.id, item: pledgeSuccess.alternative.item, amount: altQty, center: pledgeSuccess.alternative.center.name });
                    }

                    setPledgeSuccess({ type: 'success', msg: 'Donation split and rerouted across centers!' });
                    handleSearch();
                  }}
                  className="mt-3 bg-primary text-background px-4 py-2 rounded-lg font-outfit text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Accept Split & Reroute
                </button>
              )}
            </div>
          </div>
        )}

        {/* Match Results */}
        {matchResults && (
          <div>
            <h2 className="font-sans font-bold text-2xl mb-6">
              {matchResults.length > 0
                ? `${matchResults.length} center${matchResults.length > 1 ? 's' : ''} need${matchResults.length === 1 ? 's' : ''} ${selectedCategory}`
                : `No centers currently need ${selectedCategory}`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchResults.map(match => (
                <div key={match.id} className="bg-white rounded-[2rem] p-6 shadow-xl border border-primary/5 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-sans font-bold text-xl text-primary">{match.center.name}</h3>
                      <div className="flex items-center gap-1 text-dark/50 font-outfit text-xs mt-1">
                        <MapPin size={12} /> {match.center.lat.toFixed(3)}, {match.center.lng.toFixed(3)}
                      </div>
                    </div>
                    <span className={`font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider ${
                      match.center.status === 'Critical' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      {match.center.status}
                    </span>
                  </div>

                  <div className="bg-background/70 rounded-xl p-4 mb-4 flex-1">
                    <div className="font-mono text-xs text-dark/50 uppercase tracking-widest mb-2">{match.category}</div>
                    <div className="font-outfit font-semibold text-primary text-lg">{match.item}</div>
                    <div className="font-mono text-sm text-accent font-bold mt-1">{match.remaining} units still needed</div>
                  </div>

                  <MagneticButton
                    onClick={() => handlePledge(match)}
                    className="w-full bg-primary text-background py-3 text-sm"
                  >
                    Pledge to this Center <ArrowRight size={16} />
                  </MagneticButton>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
