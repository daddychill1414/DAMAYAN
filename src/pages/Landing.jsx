import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const container = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-element', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[100dvh] w-full overflow-hidden flex items-end pb-24 px-8 md:px-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop" 
          alt="Dark Forest Texture" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-primary/80 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl text-background">
        <div className="flex items-center gap-4 mb-6 hero-element opacity-0">
          <div className="h-[1px] w-12 bg-accent"></div>
          <p className="font-mono text-sm tracking-widest uppercase text-accent">Disaster Relief Coordination</p>
        </div>
        
        <h1 className="leading-[1.1] mb-8 hero-element opacity-0">
          <span className="block font-sans font-extrabold text-5xl md:text-7xl tracking-tighter">
            Relief coordination is the
          </span>
          <span className="block font-drama italic text-7xl md:text-[8rem] text-background/90 mt-2">
            Lifeline.
          </span>
        </h1>
        
        <div className="hero-element opacity-0">
          <Link to="/needs">
            <MagneticButton className="bg-accent text-background px-8 py-4 text-lg">
              Start Providing Aid <ArrowRight size={20} />
            </MagneticButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

// --- FEATURE CARDS ---

const ShufflerCard = () => {
  const [items, setItems] = useState([
    { id: 1, text: "50x Diapers (Size L)", type: "Hygiene", urgency: "High" },
    { id: 2, text: "10L Drinking Water", type: "Essentials", urgency: "Critical" },
    { id: 3, text: "Insulin (10 units)", type: "Medical", urgency: "Critical" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newArr = [...prev];
        const last = newArr.pop();
        newArr.unshift(last);
        return newArr;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-background rounded-[2rem] p-8 shadow-xl border border-primary/5 flex flex-col h-full relative overflow-hidden group">
      <div className="mb-6 z-10 relative">
        <h3 className="font-sans font-bold text-2xl text-primary mb-2">Live Needs Board</h3>
        <p className="font-outfit text-dark/70 text-sm">Real-time requests preventing duplicate donations.</p>
      </div>
      <div className="relative flex-grow min-h-[160px] z-10">
        {items.map((item, i) => {
          const isTop = i === 0;
          return (
            <div 
              key={item.id}
              className="absolute w-full rounded-2xl bg-white border border-primary/10 p-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{
                top: `${i * 12}px`,
                scale: 1 - i * 0.05,
                opacity: 1 - i * 0.2,
                zIndex: 10 - i,
                boxShadow: isTop ? '0 10px 30px -10px rgba(46,64,54,0.1)' : 'none'
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-primary/60">{item.type}</span>
                <span className={`font-mono text-[10px] px-2 py-1 rounded-full ${item.urgency === 'Critical' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  {item.urgency}
                </span>
              </div>
              <p className="font-outfit font-semibold text-primary">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const fullText = "Scanning available supplies...\n> 12 matches found.\n> Rerouting excess canned goods.\n> Preventing dump.\n> Match confirmed: San Jose Center.";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setDisplayedText(""), 2000); // Reset after a while, though looping might not be strictly needed
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-primary rounded-[2rem] p-8 shadow-xl border border-primary/5 flex flex-col h-full relative overflow-hidden group text-background">
      <div className="mb-6 z-10 relative flex justify-between items-start">
        <div>
          <h3 className="font-sans font-bold text-2xl mb-2 text-background">Smart Donation Matching</h3>
          <p className="font-outfit text-background/70 text-sm">AI routing to exactly where it's needed.</p>
        </div>
        <div className="flex items-center gap-2 bg-background/10 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="font-mono text-[10px] uppercase">Live Feed</span>
        </div>
      </div>
      <div className="flex-grow bg-black/40 rounded-2xl p-5 font-mono text-xs leading-relaxed text-background/80 relative">
        <pre className="whitespace-pre-wrap font-inherit">{displayedText}<span className="inline-block w-1.5 h-3 bg-accent ml-1 animate-pulse align-middle"></span></pre>
      </div>
    </div>
  );
};

const SchedulerCard = () => {
  const gridRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      
      tl.set('.cursor', { x: 0, y: 0, opacity: 0 })
        .to('.cursor', { opacity: 1, duration: 0.3 })
        .to('.cursor', { x: 120, y: 60, duration: 1, ease: 'power2.inOut' })
        .to('.cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }) // Click
        .to('.cell-active', { backgroundColor: '#CC5833', color: '#F2F0E9', duration: 0.2 }, "-=0.1")
        .to('.cursor', { x: 220, y: 140, duration: 0.8, ease: 'power2.inOut' })
        .to('.cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }) // Click save
        .to('.cursor', { opacity: 0, duration: 0.3 });
        
      return () => tl.kill();
    }, gridRef);
    return () => ctx.revert();
  }, []);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-background rounded-[2rem] p-8 shadow-xl border border-primary/5 flex flex-col h-full relative group">
      <div className="mb-6 z-10 relative">
        <h3 className="font-sans font-bold text-2xl text-primary mb-2">Volunteer Micro-Tasking</h3>
        <p className="font-outfit text-dark/70 text-sm">Break help into small, actionable tasks.</p>
      </div>
      
      <div ref={gridRef} className="flex-grow relative border border-primary/10 rounded-2xl p-4 bg-white/50">
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d, i) => <div key={i} className="text-center font-mono text-[10px] text-primary/40">{d}</div>)}
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className={`aspect-square rounded border border-primary/5 flex items-center justify-center font-mono text-xs ${i === 10 ? 'cell-active transition-colors' : ''}`}>
              {i + 1}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <div className="bg-primary text-background font-mono text-[10px] px-4 py-2 rounded-full inline-block">Save Assignment</div>
        </div>

        {/* Custom SVG Cursor */}
        <div className="cursor absolute top-0 left-0 z-20 pointer-events-none drop-shadow-md">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.78 21.39L10.87 17.95C11.13 17.73 11.47 17.61 11.82 17.61H18.5C19.16 17.61 19.52 16.85 19.09 16.37L5.5 3.21Z" fill="#1A1A1A" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-32 px-8 md:px-16 bg-background relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-4">Functional Artifacts</h2>
          <p className="font-outfit text-dark/70 max-w-xl text-lg">HCI-driven tools designed to reduce cognitive load during emergencies and ensure aid precision.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ShufflerCard />
          <TypewriterCard />
          <SchedulerCard />
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-line', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="relative py-40 px-8 md:px-16 bg-dark overflow-hidden flex items-center justify-center">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-20 parallax-bg">
        <img 
          src="https://images.unsplash.com/photo-1618090584126-129cd1f3f4e2?q=80&w=2070&auto=format&fit=crop" 
          alt="Moss Texture" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="phil-line font-outfit text-background/60 text-xl md:text-2xl mb-8">
          Most disaster relief focuses on: chaotic, uncoordinated drop-offs.
        </p>
        <p className="phil-line font-sans font-extrabold text-5xl md:text-7xl text-background leading-tight">
          We focus on: <br/>
          <span className="font-drama italic text-accent font-normal tracking-wide">precision aid matching.</span>
        </p>
      </div>
    </section>
  );
};

const ProtocolCard = ({ index, title, desc, icon: Icon, children }) => {
  return (
    <div className="protocol-card h-[100dvh] w-full flex items-center justify-center sticky top-0 px-8 md:px-16 perspective-[1000px]">
      <div className="w-full max-w-6xl bg-background rounded-[3rem] p-12 md:p-20 shadow-2xl flex flex-col md:flex-row items-center gap-16 border border-primary/10 overflow-hidden relative">
        <div className="flex-1 z-10">
          <div className="font-mono text-accent text-sm mb-6 uppercase tracking-widest">Phase 0{index}</div>
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-primary mb-6">{title}</h2>
          <p className="font-outfit text-dark/70 text-lg md:text-xl leading-relaxed">{desc}</p>
        </div>
        <div className="flex-1 w-full flex justify-center items-center h-[400px] relative z-10 border border-primary/5 rounded-[2rem] bg-white/40 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const Protocol = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.protocol-card');
      
      cards.forEach((card, i) => {
        if (i !== cards.length - 1) {
          gsap.to(card.querySelector('.bg-background'), {
            scale: 0.9,
            opacity: 0.5,
            filter: 'blur(20px)',
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            }
          });
        }
      });
      
      // Animations for SVG contents
      gsap.to('.rotating-motif', { rotation: 360, duration: 20, repeat: -1, ease: 'linear' });
      gsap.fromTo('.laser-line', { y: 0 }, { y: 300, duration: 3, repeat: -1, yoyo: true, ease: 'power1.inOut' });
      gsap.to('.pulse-wave', { strokeDashoffset: 0, duration: 2, repeat: -1, ease: 'linear' });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="protocol" ref={containerRef} className="bg-white relative">
      <ProtocolCard 
        index={1} 
        title="Live Assessment" 
        desc="Evacuation centers broadcast real-time requirements. No more guessing games. Data is structured, validated, and instantly synchronized across the network."
      >
        <svg className="rotating-motif w-64 h-64 opacity-80" viewBox="0 0 100 100" fill="none" stroke="#2E4036" strokeWidth="0.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={i} cx="50" cy="50" r={10 + i * 3} strokeDasharray={`${4 + i} ${4 + i}`} />
          ))}
          <circle cx="50" cy="50" r="48" stroke="#CC5833" strokeWidth="1" strokeDasharray="10 20" />
        </svg>
      </ProtocolCard>
      
      <ProtocolCard 
        index={2} 
        title="Intelligent Routing" 
        desc="Donations are algorithmically matched with verified needs. Excess items are rerouted to prevent dumping, ensuring an equitable distribution of resources."
      >
        <div className="relative w-full h-full p-8 overflow-hidden">
          <div className="grid grid-cols-8 gap-4 w-full h-full opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="bg-primary/40 rounded-sm"></div>
            ))}
          </div>
          <div className="laser-line absolute top-8 left-8 right-8 h-[2px] bg-accent shadow-[0_0_15px_rgba(204,88,51,0.8)] z-10"></div>
        </div>
      </ProtocolCard>
      
      <ProtocolCard 
        index={3} 
        title="Verified Delivery" 
        desc="Unique cryptographic signatures accompany every payload. Drop-offs are scanned and confirmed, creating an immutable ledger of trust and transparency."
      >
        <svg className="w-full h-32 px-12" viewBox="0 0 400 100" fill="none" stroke="#2E4036" strokeWidth="2">
          <path className="pulse-wave" strokeDasharray="1000" strokeDashoffset="1000" d="M0 50 L150 50 L170 20 L200 90 L230 10 L250 50 L400 50" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </ProtocolCard>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-40 px-8 md:px-16 bg-background relative flex items-center justify-center text-center">
      <div className="max-w-4xl">
        <h2 className="font-sans font-bold text-5xl md:text-7xl text-primary mb-8 tracking-tight">Become part of the network.</h2>
        <p className="font-outfit text-xl text-dark/70 mb-12 max-w-2xl mx-auto">Whether you're organizing a center, driving supplies, or donating essentials — Damayan needs your exact capabilities.</p>
        <Link to="/needs">
          <MagneticButton className="bg-primary text-background px-10 py-5 text-xl inline-flex items-center gap-3">
            Get Started Now <ArrowRight size={24} />
          </MagneticButton>
        </Link>
      </div>
    </section>
  );
};

export const Landing = () => {
  return (
    <main>
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <CTA />
    </main>
  );
};
