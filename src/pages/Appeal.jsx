import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { AlertTriangle, Send, ArrowLeft, Check } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export const Appeal = () => {
  const { currentUser, submitAppeal, appeals, showToast } = useStore();
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ap-fade', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (!currentUser) return <Navigate to="/login" />;

  const existingAppeal = appeals.find(a => a.userId === currentUser.id && a.status === 'pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    submitAppeal(currentUser.id, reason);
    showToast('Appeal submitted successfully', 'success');
    setSubmitted(true);
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 overflow-hidden bg-dark">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/95 to-dark/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <Link to="/login" className="ap-fade inline-flex items-center gap-2 text-background/50 hover:text-accent font-outfit text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Rejection Notice */}
        <div className="ap-fade bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-6 flex items-start gap-4">
          <div className="p-2.5 bg-red-500/20 rounded-xl shrink-0">
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-base text-red-400 mb-1">Application Rejected</h3>
            <p className="font-outfit text-sm text-background/60">
              {currentUser.rejectionReason || 'Your coordinator application has been rejected. You may submit an appeal below with additional information.'}
            </p>
          </div>
        </div>

        {/* Appeal Form / Existing Appeal */}
        <div className="ap-fade bg-background/10 backdrop-blur-2xl border border-background/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
          {submitted || existingAppeal ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-accent/20 border-2 border-accent/30 rounded-full mx-auto flex items-center justify-center mb-6">
                <Check size={28} className="text-accent" />
              </div>
              <h2 className="font-sans font-bold text-xl text-background mb-2">Appeal Submitted</h2>
              <p className="font-outfit text-sm text-background/60 mb-6">
                Your appeal is under review. The admin team will process it as soon as possible. You will be notified of the outcome.
              </p>
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full px-5 py-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="font-mono text-xs uppercase tracking-wider">Appeal Pending Review</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-sans font-bold text-xl text-background mb-1">Submit an Appeal</h2>
                <p className="font-outfit text-sm text-background/50">Provide additional information or documents to support your coordinator application.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Appeal Reason</label>
                  <textarea
                    value={reason} onChange={e => setReason(e.target.value)}
                    rows={5}
                    placeholder="Explain why your application should be reconsidered. Include any additional credentials, references, or supporting information..."
                    className="w-full bg-background/5 border border-background/20 rounded-xl p-4 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Additional Document (Optional)</label>
                  <div className="w-full border-2 border-dashed border-background/20 rounded-xl px-4 py-5 text-center cursor-pointer bg-background/5 hover:border-background/40 transition-all">
                    <span className="font-outfit text-xs text-background/40">Click to upload supporting documents</span>
                  </div>
                </div>

                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-xl text-sm font-outfit font-semibold btn-magnetic hover:shadow-lg hover:shadow-accent/20 transition-all">
                  <Send size={16} /> Submit Appeal
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
