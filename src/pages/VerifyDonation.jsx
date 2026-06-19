import React from 'react';
import { VerificationPanel } from '../components/VerificationPanel';

export const VerifyDonation = () => {
  return (
    <div className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Drop-Off Point</span>
            <div className="h-[1px] w-8 bg-accent"></div>
          </div>
          <h1 className="font-sans font-bold text-4xl text-primary mb-3">Verify Delivery</h1>
          <p className="font-outfit text-dark/60 max-w-md mx-auto">
            Scan the donor's QR code or enter their manual code to confirm the delivered items.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-primary/10 shadow-2xl">
          <VerificationPanel />
        </div>
      </div>
    </div>
  );
};
