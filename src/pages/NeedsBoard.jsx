import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { MapPin, Package, AlertCircle } from 'lucide-react';
import { UrgencyBadge } from '../components/UrgencyBadge';

export const NeedsBoard = () => {
  const { needs, barangay, openPledgeModal, currentUser } = useStore();
  const [filter, setFilter] = useState('all');

  // Filter and sort needs
  const sortedNeeds = needs
    .filter(n => n.status !== 'closed' && (filter === 'all' || n.category.toLowerCase() === filter.toLowerCase()))
    .sort((a, b) => {
      // Sort fulfilled to bottom
      if (a.status === 'fulfilled' && b.status !== 'fulfilled') return 1;
      if (a.status !== 'fulfilled' && b.status === 'fulfilled') return -1;
      
      // Sort critical to top
      if (a.urgency === 'critical' && b.urgency !== 'critical') return -1;
      if (a.urgency !== 'critical' && b.urgency === 'critical') return 1;
      if (a.urgency === 'urgent' && b.urgency === 'stable') return -1;
      if (a.urgency === 'stable' && b.urgency === 'urgent') return 1;
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const categories = ['All', 'Food', 'Water', 'Medicine', 'Hygiene', 'Clothing'];

  return (
    <div className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-[80vh] bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-accent"></div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Live Feed</span>
            </div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Needs Board</h1>
            <p className="font-outfit text-neutralGray max-w-2xl text-lg">
              Real-time shortages for {barangay.name}. Direct matching prevents dump donations.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat.toLowerCase())}
                className={`px-4 py-2 rounded-xl font-outfit text-sm font-semibold transition-colors whitespace-nowrap ${
                  filter === cat.toLowerCase()
                    ? 'bg-primary text-background'
                    : 'bg-white border border-neutralGray/20 text-primary hover:bg-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNeeds.map(need => {
            const remaining = Math.max(0, need.quantityNeeded - need.quantityPledged - need.quantityDelivered);
            const progress = ((need.quantityPledged + need.quantityDelivered) / need.quantityNeeded) * 100;
            const isFulfilled = need.status === 'fulfilled' || remaining === 0;

            return (
              <div key={need.id} className={`bg-white rounded-[2rem] p-6 shadow-xl border flex flex-col relative transition-all ${
                isFulfilled ? 'opacity-60 border-neutralGray/10 shadow-sm' :
                need.urgency === 'critical' ? 'border-urgency-critical/30 shadow-lg shadow-urgency-critical/10' : 'border-neutralGray/20 shadow-sm'
              }`}>
                {need.urgency === 'critical' && !isFulfilled && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-white items-center justify-center">
                        <AlertCircle size={12} />
                      </span>
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutralGray bg-neutralGray/10 px-2 py-1 rounded-full font-bold">
                    {need.category}
                  </span>
                  <UrgencyBadge urgency={need.urgency} size="small" />
                </div>
                
                <h3 className="font-sans font-bold text-2xl text-primary mb-2 line-clamp-2">{need.itemName}</h3>
                
                <div className="flex items-center gap-2 text-neutralGray font-outfit text-sm mb-6">
                  <MapPin size={14} className="shrink-0" />
                  <span className="truncate">{need.dropOffPoint}</span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between font-mono text-xs mb-2">
                    <span className="text-neutralGray">Req: {need.quantityNeeded}</span>
                    <span className={`font-bold ${isFulfilled ? 'text-urgency-stable' : 'text-primary'}`}>
                      {isFulfilled ? 'Fulfilled' : `${remaining} needed`}
                    </span>
                  </div>
                  <div className="w-full bg-neutralGray/20 h-2 rounded-full overflow-hidden flex">
                    <div className="h-full bg-urgency-stable transition-all duration-1000" style={{ width: `${Math.min(100, (need.quantityDelivered / need.quantityNeeded) * 100)}%` }}></div>
                    <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${Math.min(100, (need.quantityPledged / need.quantityNeeded) * 100)}%` }}></div>
                  </div>
                </div>

                <div className="mt-auto">
                  <MagneticButton 
                    onClick={() => openPledgeModal(need.id)}
                    disabled={isFulfilled}
                    className={`w-full py-3 text-sm flex items-center justify-center gap-2 font-bold ${
                      isFulfilled ? 'bg-background text-neutralGray border border-neutralGray/20 cursor-not-allowed' :
                      'bg-primary text-background hover:bg-primary/90'
                    }`}
                  >
                    <Package size={16} />
                    {isFulfilled ? 'Goal Reached' : 'Pledge Exact Item'}
                  </MagneticButton>
                </div>
              </div>
            );
          })}

          {sortedNeeds.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <Package size={48} className="mx-auto text-neutralGray/30 mb-4" />
              <h3 className="font-sans font-bold text-2xl text-primary mb-2">No Active Needs</h3>
              <p className="font-outfit text-neutralGray">The barangay hasn't posted any shortages for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
