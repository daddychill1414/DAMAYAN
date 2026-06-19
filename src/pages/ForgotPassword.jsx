import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, ArrowRight, Shield, Phone, Mail } from 'lucide-react';

export const ForgotPassword = () => {
  const [activeTab, setActiveTab] = useState('donor');
  const [contact, setContact] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact) { setError(`Please enter your ${activeTab === 'donor' ? 'phone number' : 'email'}`); return; }
    // Simulate sending recovery link
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-sans font-bold text-2xl text-primary mb-2">Damayan Match</Link>
        </div>

        <div className="bg-white rounded-3xl border border-primary/10 shadow-xl overflow-hidden">
          {!sent ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-primary/5">
                <button
                  onClick={() => { setActiveTab('donor'); setError(''); setContact(''); }}
                  className={`flex-1 py-4 font-outfit text-sm font-semibold transition-colors ${
                    activeTab === 'donor' ? 'bg-primary text-background' : 'bg-transparent text-primary/60 hover:bg-primary/5'
                  }`}
                >
                  Donor
                </button>
                <button
                  onClick={() => { setActiveTab('coordinator'); setError(''); setContact(''); }}
                  className={`flex-1 py-4 font-outfit text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'coordinator' ? 'bg-primary text-background' : 'bg-transparent text-primary/60 hover:bg-primary/5'
                  }`}
                >
                  <Shield size={14} /> Barangay
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="text-center mb-6">
                  <h2 className="font-sans font-bold text-xl text-primary mb-1">Reset Password</h2>
                  <p className="font-outfit text-xs text-dark/60">
                    Enter your registered {activeTab === 'donor' ? 'phone number' : 'barangay email'} to receive recovery instructions.
                  </p>
                </div>

                <div>
                  <label className="block font-outfit text-xs font-semibold text-primary mb-2 uppercase tracking-widest">
                    {activeTab === 'donor' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                    {activeTab === 'donor' ? <Phone size={16} className="text-primary/40" /> : <Mail size={16} className="text-primary/40" />}
                    <input
                      type={activeTab === 'donor' ? 'tel' : 'email'}
                      value={contact}
                      onChange={e => { setContact(e.target.value); setError(''); }}
                      placeholder={activeTab === 'donor' ? '0917 123 4567' : 'brgy@gov.ph'}
                      className="w-full bg-transparent font-outfit text-sm outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="font-outfit text-xs text-red-500">{error}</p>
                  </div>
                )}

                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-background py-4 rounded-xl text-sm font-outfit font-bold hover:bg-primary/90 transition-colors">
                  Send Instructions <ArrowRight size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/20 rounded-full mx-auto flex items-center justify-center mb-6">
                <Check size={28} className="text-green-500" />
              </div>
              <h2 className="font-sans font-bold text-xl text-primary mb-2">Instructions Sent</h2>
              <p className="font-outfit text-sm text-dark/60 mb-6">
                If an account exists for <span className="font-bold text-primary">{contact}</span>, you will receive instructions shortly.
              </p>
              <button 
                onClick={() => setSent(false)}
                className="w-full py-4 bg-background text-primary rounded-xl text-sm font-outfit font-bold border border-primary/10 hover:bg-primary/5 transition-colors"
              >
                Try another account
              </button>
            </div>
          )}
        </div>

        <Link to="/login" className="flex items-center justify-center gap-2 mt-6 font-outfit text-sm text-dark/60 hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
