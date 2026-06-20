import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { QrCode, User, MapPin, Phone, Lock, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import bgGradient from '../assets/blue gradient.png';
import logoBlue from '../assets/damayan logo blue.png';

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
    // Simulate verification of barangay code
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
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Left side - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgGradient} alt="Background Gradient" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-primary/40"></div>
        </div>
        
        <div className="relative z-10 p-16 text-white max-w-lg">
          <Link to="/" className="inline-block hover:opacity-80 transition-opacity mb-12 bg-white/10 p-4 rounded-3xl backdrop-blur-sm border border-white/10">
            <ArrowLeft size={24} className="mb-4" />
            <span className="font-outfit font-medium text-sm tracking-widest uppercase">Back to Home</span>
          </Link>
          
          <img src={logoBlue} alt="Damayan Logo" className="w-24 h-auto mb-8 brightness-0 invert" />
          <h1 className="font-sans font-extrabold text-5xl leading-tight mb-6">
            Join the barangay relief network.
          </h1>
          <p className="font-outfit text-white/70 text-lg leading-relaxed">
            Become a part of a transparent, targeted relief effort. Your community needs exact help, exactly now.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <Link to="/" className="absolute top-8 left-8 lg:hidden text-primary hover:opacity-80 transition-opacity">
          <ArrowLeft size={24} />
        </Link>
        
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <img src={logoBlue} alt="Damayan Logo" className="w-16 h-auto mx-auto lg:mx-0 mb-6 lg:hidden" />
            <h2 className="font-sans font-bold text-3xl text-primary mb-3">Create Account</h2>
            <p className="font-outfit text-neutralGray text-base">Sign up to start helping your community</p>
          </div>

          <div className="bg-white rounded-[2rem] border border-neutralGray/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mb-8 relative">
            
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-neutralGray/5">
              <div className="h-full bg-accent transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>

            <div className="p-8 mt-2">
              {/* STEP 1: Barangay Verification */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5 text-primary">
                      <ShieldCheck size={32} />
                    </div>
                    <h2 className="font-sans font-bold text-2xl text-primary mb-2">Connect to Barangay</h2>
                    <p className="font-outfit text-sm text-neutralGray">Enter the 3-digit code provided by your coordinator.</p>
                  </div>

                  <form onSubmit={handleBarangaySubmit} className="space-y-6">
                    <div>
                      <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-4 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                        <QrCode size={20} className="text-neutralGray" />
                        <input
                          type="text"
                          required
                          value={barangayCode}
                          onChange={(e) => setBarangayCode(e.target.value)}
                          placeholder="e.g. 001"
                          maxLength={6}
                          className="w-full bg-transparent font-mono text-xl font-bold text-center tracking-[0.3em] outline-none uppercase text-dark placeholder:text-neutralGray/30"
                        />
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-urgency-critical/5 border border-urgency-critical/20 rounded-xl flex items-start gap-3">
                        <div className="text-urgency-critical mt-0.5"><ShieldCheck size={16} /></div>
                        <p className="font-outfit text-sm text-urgency-critical font-medium">{error}</p>
                      </div>
                    )}
                    
                    <MagneticButton type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-outfit font-bold text-base hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
                      Verify Code <ArrowRight size={18} />
                    </MagneticButton>
                  </form>
                </div>
              )}

              {/* STEP 2: Donor Type */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="font-sans font-bold text-2xl text-primary mb-2">Account Type</h2>
                    <p className="font-outfit text-sm text-neutralGray">How are you connected to {barangay.name}?</p>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={() => { setDonorType('community'); setStep(3); }}
                      className="w-full flex items-start gap-4 p-5 rounded-2xl border border-neutralGray/20 hover:border-accent hover:bg-accent/5 hover:shadow-md transition-all text-left group"
                    >
                      <div className="w-12 h-12 bg-primary/5 group-hover:bg-accent/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                        <MapPin size={24} className="text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-lg text-primary mb-1">Community Member</h3>
                        <p className="font-outfit text-sm text-neutralGray leading-relaxed">I live within the barangay. Creates a permanent account with password.</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { setDonorType('external'); setStep(3); }}
                      className="w-full flex items-start gap-4 p-5 rounded-2xl border border-neutralGray/20 hover:border-accent hover:bg-accent/5 hover:shadow-md transition-all text-left group"
                    >
                      <div className="w-12 h-12 bg-primary/5 group-hover:bg-accent/10 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                        <User size={24} className="text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <div>
                        <h3 className="font-sans font-bold text-lg text-primary mb-1">External Donor</h3>
                        <p className="font-outfit text-sm text-neutralGray leading-relaxed">I live outside the barangay. Creates a temporary session for immediate pledging.</p>
                      </div>
                    </button>
                  </div>
                  
                  <button onClick={() => setStep(1)} className="w-full py-3 text-center font-outfit text-sm font-bold text-neutralGray hover:text-primary transition-colors flex items-center justify-center gap-2 mt-2">
                    <ArrowLeft size={16} /> Back to Verification
                  </button>
                </div>
              )}

              {/* STEP 3: Details Form */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="mb-8">
                    <h2 className="font-sans font-bold text-2xl text-primary mb-2">
                      {donorType === 'community' ? 'Community Info' : 'Donor Details'}
                    </h2>
                    <p className="font-outfit text-sm text-neutralGray">Fill in your details to start pledging.</p>
                  </div>

                  <form onSubmit={handleRegistrationSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Full Name</label>
                      <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                        <User size={18} className="text-neutralGray" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Juan Dela Cruz"
                          className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Phone Number</label>
                      <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                        <Phone size={18} className="text-neutralGray" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="0917 123 4567"
                          className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                        />
                      </div>
                    </div>

                    {donorType === 'community' ? (
                      <>
                        <div className="space-y-1.5">
                          <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Home Address</label>
                          <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                            <MapPin size={18} className="text-neutralGray" />
                            <input
                              type="text"
                              required
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                              placeholder="Block / Lot / Street"
                              className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Password</label>
                          <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                            <Lock size={18} className="text-neutralGray" />
                            <input
                              type="password"
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              placeholder="••••••••"
                              className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="block font-outfit text-xs font-bold text-primary tracking-wide">Current Location</label>
                        <div className="flex items-center gap-3 bg-background border border-neutralGray/20 rounded-xl px-4 py-3.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
                          <MapPin size={18} className="text-neutralGray" />
                          <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. Manila"
                            className="w-full bg-transparent font-outfit text-sm outline-none text-dark placeholder:text-neutralGray/50"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isAnonymous: !formData.isAnonymous})}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all mt-4 ${
                        formData.isAnonymous ? 'bg-accent/5 border-accent shadow-sm' : 'bg-background border-neutralGray/20 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <EyeOff size={20} className={formData.isAnonymous ? 'text-accent' : 'text-neutralGray'} />
                        <div>
                          <p className={`font-outfit font-bold text-sm ${formData.isAnonymous ? 'text-primary' : 'text-dark'}`}>Stay Anonymous</p>
                          <p className="font-outfit text-xs text-neutralGray mt-0.5">Hide name from public needs board</p>
                        </div>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${formData.isAnonymous ? 'bg-accent justify-end' : 'bg-neutralGray/30 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </button>

                    {error && (
                      <div className="p-4 bg-urgency-critical/5 border border-urgency-critical/20 rounded-xl flex items-start gap-3 mt-4">
                        <div className="text-urgency-critical mt-0.5"><ShieldCheck size={16} /></div>
                        <p className="font-outfit text-sm text-urgency-critical font-medium">{error}</p>
                      </div>
                    )}

                    <div className="pt-6 flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-outfit font-bold text-sm bg-background border border-neutralGray/20 text-neutralGray hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center">
                        Back
                      </button>
                      <MagneticButton type="submit" className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-xl font-outfit font-bold text-base hover:shadow-lg hover:shadow-primary/20 transition-all">
                        Complete Registration <ArrowRight size={18} />
                      </MagneticButton>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-center font-outfit text-sm text-neutralGray">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:text-accent transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
