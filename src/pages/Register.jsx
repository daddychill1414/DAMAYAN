import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { QrCode, User, MapPin, Phone, Lock, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [barangayCode, setBarangayCode] = useState('');
  const [donorType, setDonorType] = useState(null); // 'community' | 'external'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: '',
    password: '',
    isAnonymous: false,
  });
  const [error, setError] = useState('');
  
  const { barangay, registerDonor, showToast } = useStore();
  const navigate = useNavigate();

  const handleBarangaySubmit = (e) => {
    e.preventDefault();
    // Simulate verification of barangay code (in a real app, this verifies against DB)
    const code = barangay.id.split('-')[1].toUpperCase();
    if (barangayCode.toUpperCase() === code || barangayCode === 'TEST') {
      setError('');
      setStep(2);
    } else {
      setError('Invalid Barangay Code. Please ask your coordinator.');
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (donorType === 'community' && !formData.password) {
      setError('Password is required for community members.');
      return;
    }

    const res = registerDonor({
      ...formData,
      type: donorType,
    });

    if (res.success) {
      showToast('Registration successful! You can now pledge items.');
      navigate('/needs');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 py-20">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-block font-sans font-bold text-2xl text-primary mb-2">Damayan Match</Link>
          <p className="font-outfit text-dark/60 text-sm">Join the barangay relief network</p>
        </div>

        <div className="bg-white rounded-3xl border border-primary/10 shadow-xl overflow-hidden">
          
          {/* Progress Bar */}
          <div className="flex w-full h-1 bg-primary/5">
            <div className="h-full bg-accent transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <div className="p-8">
            {/* STEP 1: Barangay Verification */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={32} className="text-primary" />
                  </div>
                  <h2 className="font-sans font-bold text-xl text-primary mb-2">Connect to Barangay</h2>
                  <p className="font-outfit text-xs text-dark/60">Enter the 3-digit code provided by your barangay coordinator or scan their QR.</p>
                </div>

                <form onSubmit={handleBarangaySubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                      <QrCode size={16} className="text-primary/40" />
                      <input
                        type="text"
                        required
                        value={barangayCode}
                        onChange={(e) => setBarangayCode(e.target.value)}
                        placeholder="e.g. 001"
                        maxLength={6}
                        className="w-full bg-transparent font-mono text-lg font-bold text-center tracking-[0.2em] outline-none uppercase"
                      />
                    </div>
                  </div>
                  
                  {error && <p className="font-outfit text-xs text-red-500 text-center">{error}</p>}
                  
                  <button type="submit" className="w-full py-4 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors">
                    Verify Code
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: Donor Type */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="font-sans font-bold text-xl text-primary mb-2">Select Account Type</h2>
                  <p className="font-outfit text-xs text-dark/60">How are you connected to {barangay.name}?</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => { setDonorType('community'); setStep(3); }}
                    className="w-full flex items-start gap-4 p-5 rounded-2xl border border-primary/10 hover:border-accent hover:bg-accent/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-primary mb-1">Community Member</h3>
                      <p className="font-outfit text-xs text-dark/60">I live within the barangay. Creates a permanent account with password.</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setDonorType('external'); setStep(3); }}
                    className="w-full flex items-start gap-4 p-5 rounded-2xl border border-primary/10 hover:border-accent hover:bg-accent/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center shrink-0">
                      <User size={20} className="text-primary/60" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-primary mb-1">External Donor</h3>
                      <p className="font-outfit text-xs text-dark/60">I live outside the barangay. Creates a temporary session for immediate pledging.</p>
                    </div>
                  </button>
                </div>
                
                <button onClick={() => setStep(1)} className="w-full py-2 text-center font-outfit text-xs text-dark/40 hover:text-primary">
                  Back
                </button>
              </div>
            )}

            {/* STEP 3: Details Form */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h2 className="font-sans font-bold text-xl text-primary mb-2">
                    {donorType === 'community' ? 'Community Registration' : 'External Donor Details'}
                  </h2>
                  <p className="font-outfit text-xs text-dark/60">Fill in your details to start pledging.</p>
                </div>

                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  <div>
                    <label className="block font-outfit text-xs font-semibold text-primary mb-1 uppercase tracking-widest">Full Name</label>
                    <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                      <User size={16} className="text-primary/40" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Juan Dela Cruz"
                        className="w-full bg-transparent font-outfit text-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-outfit text-xs font-semibold text-primary mb-1 uppercase tracking-widest">Phone Number</label>
                    <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                      <Phone size={16} className="text-primary/40" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="0917 123 4567"
                        className="w-full bg-transparent font-outfit text-sm outline-none"
                      />
                    </div>
                  </div>

                  {donorType === 'community' ? (
                    <>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-primary mb-1 uppercase tracking-widest">Home Address</label>
                        <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                          <MapPin size={16} className="text-primary/40" />
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Block / Lot / Street"
                            className="w-full bg-transparent font-outfit text-sm outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-outfit text-xs font-semibold text-primary mb-1 uppercase tracking-widest">Password</label>
                        <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                          <Lock size={16} className="text-primary/40" />
                          <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-transparent font-outfit text-sm outline-none"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block font-outfit text-xs font-semibold text-primary mb-1 uppercase tracking-widest">Current City/Location</label>
                      <div className="flex items-center gap-3 bg-background border border-primary/10 rounded-xl px-4 py-3 focus-within:border-accent">
                        <MapPin size={16} className="text-primary/40" />
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="e.g. Manila"
                          className="w-full bg-transparent font-outfit text-sm outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors mt-2 ${
                      formData.isAnonymous ? 'bg-accent/5 border-accent/20' : 'bg-background border-primary/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <EyeOff size={18} className={formData.isAnonymous ? 'text-accent' : 'text-primary/40'} />
                      <div>
                        <p className={`font-outfit font-semibold text-sm ${formData.isAnonymous ? 'text-primary' : 'text-primary/80'}`}>Stay Anonymous</p>
                        <p className="font-outfit text-[10px] text-dark/50">Hide name from public needs board</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${formData.isAnonymous ? 'bg-accent justify-end' : 'bg-primary/20 justify-start'}`}>
                      <div className="w-4 h-4 bg-white rounded-full mx-0.5 shadow-sm"></div>
                    </div>
                  </button>

                  {error && <p className="font-outfit text-xs text-red-500 text-center py-2">{error}</p>}

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-outfit font-bold text-sm bg-background border border-primary/10 text-primary hover:bg-primary/5">
                      Back
                    </button>
                    <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-background rounded-xl font-outfit font-bold text-sm hover:bg-primary/90 transition-colors">
                      Complete <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-center mt-6 font-outfit text-sm text-dark/60">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:text-accent">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
