import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { QrCode, CheckCircle, Package } from 'lucide-react';

export const QRScanner = () => {
  const { needs, centers, markDelivered } = useStore();
  const [selectedNeedId, setSelectedNeedId] = useState('');
  const [scanStatus, setScanStatus] = useState('idle');

  // Filter needs that have active pledges not yet delivered
  const pendingDeliveries = needs.filter(n => n.pledged > 0);

  const handleScan = () => {
    if (!selectedNeedId) return;
    setScanStatus('scanning');
    
    // Simulate scan delay
    setTimeout(() => {
      const need = needs.find(n => n.id === parseInt(selectedNeedId));
      if (need) {
        // Mark all currently pledged amount as delivered for this simulation
        markDelivered(need.id, need.pledged);
        setScanStatus('success');
        setTimeout(() => {
          setScanStatus('idle');
          setSelectedNeedId('');
        }, 3000);
      }
    }, 1500);
  };

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-[90vh] bg-background flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Verification Scanner</h1>
          <p className="font-outfit text-dark/70 text-lg">Simulate scanning a donor's drop-off QR code at the center to log receipt.</p>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-primary/10 border border-primary/5">
          <div className="aspect-square w-full max-w-sm mx-auto bg-dark/5 rounded-3xl mb-8 flex flex-col items-center justify-center relative overflow-hidden border-2 border-dashed border-primary/20">
            {scanStatus === 'idle' && (
              <>
                <QrCode size={64} className="text-primary/40 mb-4" />
                <p className="font-mono text-xs text-primary/60 uppercase tracking-widest">Awaiting Code</p>
              </>
            )}
            {scanStatus === 'scanning' && (
              <>
                <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_15px_rgba(204,88,51,0.8)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                <QrCode size={64} className="text-primary/80 mb-4 opacity-50" />
                <p className="font-mono text-xs text-accent uppercase tracking-widest animate-pulse">Scanning...</p>
              </>
            )}
            {scanStatus === 'success' && (
              <>
                <CheckCircle size={64} className="text-green-500 mb-4" />
                <p className="font-mono text-xs text-green-600 uppercase tracking-widest">Verified</p>
              </>
            )}
          </div>

          <div className="space-y-4">
            <label className="block font-outfit text-sm font-bold text-primary">Simulate incoming pledge:</label>
            <select 
              value={selectedNeedId}
              onChange={(e) => setSelectedNeedId(e.target.value)}
              disabled={scanStatus !== 'idle'}
              className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent disabled:opacity-50"
            >
              <option value="">-- Select a pending delivery --</option>
              {pendingDeliveries.map(n => {
                const center = centers.find(c => c.id === n.centerId);
                return (
                  <option key={n.id} value={n.id}>
                    {n.pledged}x {n.item} to {center.name}
                  </option>
                );
              })}
            </select>

            <MagneticButton 
              onClick={handleScan}
              disabled={!selectedNeedId || scanStatus !== 'idle'}
              className="w-full bg-primary text-background py-4 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
            >
              Scan Drop-Off <Package size={20} />
            </MagneticButton>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};
