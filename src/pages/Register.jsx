import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { gsap } from 'gsap';
import { Shield, Activity, Heart, ArrowRight, ArrowLeft, Upload, Check, Eye, EyeOff } from 'lucide-react';

const ROLES = [
  { id: 'Admin', icon: Shield, desc: 'System administrator — manage users and verification', color: 'from-violet-500/20 to-violet-600/10' },
  { id: 'Coordinator', icon: Activity, desc: 'Barangay official — manage evacuation and logistics', color: 'from-primary/20 to-primary/10' },
  { id: 'Donor', icon: Heart, desc: 'Donor & Volunteer — pledge supplies and claim tasks', color: 'from-accent/20 to-accent/10' },
];

export const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', name: '',
    role: '', barangay: '', position: '', documentName: '',
  });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { register, showToast } = useStore();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const stepRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reg-fade', { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (stepRef.current) {
      gsap.fromTo(stepRef.current.querySelectorAll('.step-animate'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }
      );
    }
  }, [step]);

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.confirmPassword) {
        setError('All fields are required');
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    if (step === 2 && !form.role) {
      setError('Please select a role');
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.role === 'Coordinator') {
      if (!form.barangay || !form.position) {
        setError('Barangay and position are required for coordinators');
        return;
      }
    }

    const result = register({
      email: form.email,
      password: form.password,
      name: form.name,
      role: form.role,
      ...(form.role === 'Coordinator' && {
        barangay: form.barangay,
        position: form.position,
        documentName: form.documentName || 'No document uploaded',
      }),
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    showToast('Account created successfully!', 'success');

    if (form.role === 'Coordinator') navigate('/pending');
    else if (form.role === 'Admin') navigate('/admin');
    else navigate('/donor-dashboard');
  };

  const totalSteps = form.role === 'Coordinator' ? 3 : 2;

  return (
    <div ref={containerRef} className="min-h-screen w-full relative flex items-center justify-center py-20 px-4 md:px-8 overflow-hidden bg-dark">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop"
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/90 to-dark/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress bar */}
        <div className="reg-fade flex items-center gap-2 mb-8">
          {[1, 2, 3].slice(0, totalSteps).map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-accent' : 'bg-background/20'}`}></div>
            </div>
          ))}
          <span className="font-mono text-[10px] text-background/40 ml-2">STEP {step}/{totalSteps}</span>
        </div>

        {/* Title */}
        <div className="reg-fade mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="font-mono text-xs tracking-widest uppercase text-accent">Create Account</span>
          </div>
          <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-background mb-2 leading-tight">
            Join the <br /><span className="font-drama italic text-primary/80">Network.</span>
          </h1>
        </div>

        {/* Card */}
        <div className="reg-fade bg-background/10 backdrop-blur-2xl border border-background/20 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit}>
            <div ref={stepRef} key={step}>
              {/* ── Step 1: Account Details ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Full Name</label>
                    <input
                      type="text" value={form.name}
                      onChange={e => updateForm('name', e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                    />
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Email Address</label>
                    <input
                      type="email" value={form.email}
                      onChange={e => updateForm('email', e.target.value)}
                      placeholder="you@email.com"
                      className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                    />
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'} value={form.password}
                        onChange={e => updateForm('password', e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 pr-12 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                      />
                      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background/70 transition-colors">
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Confirm Password</label>
                    <input
                      type="password" value={form.confirmPassword}
                      onChange={e => updateForm('confirmPassword', e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Role Selection ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="step-animate font-outfit text-sm text-background/60 mb-4">Select your role in the Damayan network. This determines your dashboard and capabilities.</p>
                  {ROLES.map(r => (
                    <button
                      key={r.id} type="button"
                      onClick={() => updateForm('role', r.id)}
                      className={`step-animate w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 btn-magnetic ${
                        form.role === r.id
                          ? 'bg-gradient-to-r ' + r.color + ' border-accent/50 shadow-lg shadow-accent/10 scale-[1.01]'
                          : 'bg-background/5 border-background/10 hover:bg-background/8'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${form.role === r.id ? 'bg-accent/20 text-accent' : 'bg-background/10 text-background/40'}`}>
                        <r.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-sans font-bold text-base ${form.role === r.id ? 'text-background' : 'text-background/70'}`}>{r.id === 'Donor' ? 'Donor / Volunteer' : r.id}</div>
                        <div className={`font-mono text-[10px] uppercase tracking-wider mt-1 ${form.role === r.id ? 'text-background/60' : 'text-background/35'}`}>{r.desc}</div>
                      </div>
                      {form.role === r.id && (
                        <div className="p-1.5 bg-accent rounded-full text-white"><Check size={14} /></div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* ── Step 3: Coordinator Verification ── */}
              {step === 3 && form.role === 'Coordinator' && (
                <div className="space-y-5">
                  <div className="step-animate bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-start gap-3">
                    <Shield className="text-accent shrink-0 mt-0.5" size={18} />
                    <p className="font-outfit text-xs text-background/70">As a coordinator, your account must be verified by an admin before gaining full access. Please provide your barangay credentials.</p>
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Barangay Name</label>
                    <input
                      type="text" value={form.barangay}
                      onChange={e => updateForm('barangay', e.target.value)}
                      placeholder="e.g. Brgy. San Jose"
                      className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent placeholder:text-background/30 transition-colors"
                    />
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Official Position</label>
                    <select
                      value={form.position}
                      onChange={e => updateForm('position', e.target.value)}
                      className="w-full bg-background/5 border border-background/20 rounded-xl px-4 py-3 font-outfit text-sm text-background outline-none focus:border-accent transition-colors"
                    >
                      <option value="" className="text-dark">Select position...</option>
                      <option value="Barangay Captain" className="text-dark">Barangay Captain</option>
                      <option value="Barangay Kagawad" className="text-dark">Barangay Kagawad</option>
                      <option value="SK Chairperson" className="text-dark">SK Chairperson</option>
                      <option value="Barangay Secretary" className="text-dark">Barangay Secretary</option>
                      <option value="Barangay Treasurer" className="text-dark">Barangay Treasurer</option>
                      <option value="BDRRMC Member" className="text-dark">BDRRMC Member</option>
                      <option value="Other Official" className="text-dark">Other Official</option>
                    </select>
                  </div>
                  <div className="step-animate">
                    <label className="block font-outfit text-sm font-semibold text-background/80 mb-2">Upload Verification Document</label>
                    <div
                      onClick={() => updateForm('documentName', 'barangay_id_' + form.name.toLowerCase().replace(/\s+/g, '_') + '.pdf')}
                      className={`w-full border-2 border-dashed rounded-xl px-4 py-6 text-center cursor-pointer transition-all duration-300 ${
                        form.documentName
                          ? 'border-accent/50 bg-accent/5'
                          : 'border-background/20 bg-background/5 hover:border-background/40'
                      }`}
                    >
                      {form.documentName ? (
                        <div className="flex items-center justify-center gap-2">
                          <Check size={16} className="text-accent" />
                          <span className="font-mono text-xs text-accent">{form.documentName}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={20} className="text-background/40" />
                          <span className="font-outfit text-xs text-background/40">Click to upload Barangay ID / Certificate</span>
                          <span className="font-mono text-[9px] text-background/25">PDF, JPG, PNG — Max 5MB</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="font-outfit text-xs text-red-400">{error}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex items-center justify-center gap-2 bg-background/10 border border-background/20 text-background/70 hover:text-background py-3 px-5 rounded-xl text-sm font-outfit font-semibold transition-all btn-magnetic">
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              {step < totalSteps ? (
                <button type="button" onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl text-sm font-outfit font-semibold btn-magnetic hover:shadow-lg hover:shadow-accent/20 transition-all">
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-accent text-white py-3 rounded-xl text-sm font-outfit font-semibold btn-magnetic hover:shadow-lg hover:shadow-accent/20 transition-all">
                  {form.role === 'Coordinator' ? 'Submit for Verification' : 'Create Account'} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="font-outfit text-xs text-background/40">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-semibold">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
