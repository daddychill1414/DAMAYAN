import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const container = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered text entrance
      gsap.from('.hero-element', {
        y: 60,
        opacity: 0,
        duration: 1.4,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });

      // Subtle parallax on the background elements
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="relative h-[100dvh] w-full overflow-hidden flex items-end pb-24 px-8 md:px-16 bg-primary">
      {/* Background */}
      <div className="hero-bg absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-primary to-[#0f2136]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl text-background">
        <div className="flex items-center gap-4 mb-6 hero-element opacity-0">
          <div className="h-[2px] w-12 bg-accent"></div>
          <p className="font-mono text-sm tracking-widest uppercase text-accent font-bold">Official Barangay System</p>
        </div>
        
        <h1 className="leading-[1.05] mb-10 hero-element opacity-0">
          <span className="block font-sans font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] tracking-tighter">
            Community relief is the
          </span>
          <span className="block font-drama italic text-7xl md:text-[9rem] text-background mt-2 drop-shadow-2xl">
            Connection.
          </span>
        </h1>
        
        <div className="hero-element opacity-0">
          <Link to="/needs">
            <MagneticButton className="bg-accent text-white px-10 py-5 text-xl font-bold shadow-[0_0_40px_rgba(245,158,11,0.4)]">
              Start Helping Your Barangay <ArrowRight size={24} />
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
    { id: 1, text: "10L Drinking Water", type: "Water", urgency: "Critical", color: "bg-urgency-critical" },
    { id: 2, text: "Assorted Canned Goods", type: "Food", urgency: "Moderate", color: "bg-urgency-warning" },
    { id: 3, text: "Paracetamol (500mg)", type: "Medicine", urgency: "Stable", color: "bg-urgency-stable" }
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
    <div className="feature-card bg-white rounded-[2rem] p-8 shadow-xl border border-neutralGray/20 flex flex-col h-full relative overflow-hidden group hover:border-accent/50 transition-colors">
      <div className="mb-6 z-10 relative">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
          <Activity size={24} />
        </div>
        <h3 className="font-sans font-bold text-2xl text-dark mb-2">Live Need Matching</h3>
        <p className="font-outfit text-neutralGray text-sm">Real-time shortages direct from the barangay prevent dump donations.</p>
      </div>
      <div className="relative flex-grow min-h-[160px] z-10 mt-4">
        {items.map((item, i) => {
          const isTop = i === 0;
          return (
            <div 
              key={item.id}
              className="absolute w-full rounded-2xl bg-background border border-neutralGray/10 p-4 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] shadow-sm"
              style={{
                top: `${i * 12}px`,
                scale: 1 - i * 0.05,
                opacity: 1 - i * 0.2,
                zIndex: 10 - i,
                boxShadow: isTop ? '0 10px 30px -10px rgba(30,58,95,0.15)' : 'none'
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-neutralGray font-bold">{item.type}</span>
                <span className={`font-mono text-[10px] px-2 py-1 rounded-full ${item.color}/10 ${item.color.replace('bg-', 'text-')} font-bold`}>
                  {item.urgency}
                </span>
              </div>
              <p className="font-outfit font-bold text-dark">{item.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TypewriterCard = () => {
  const fullText = "Pledge received.\n> Reserving 10x Blankets.\n> 24-hour timer started.\n> Updating remaining needs...\n> Quantity locked.";
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setTimeout(() => setDisplayedText(""), 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feature-card bg-primary rounded-[2rem] p-8 shadow-xl border border-primary/5 flex flex-col h-full relative overflow-hidden group text-background">
      <div className="mb-6 z-10 relative">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent">
            <Zap size={24} />
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Live Lock</span>
          </div>
        </div>
        <h3 className="font-sans font-bold text-2xl mb-2 text-background">24-Hour Reservation</h3>
        <p className="font-outfit text-background/70 text-sm">Pledges lock quantities instantly. If undelivered, items return to the pool.</p>
      </div>
      <div className="flex-grow bg-[#0f2136] rounded-2xl p-5 font-mono text-xs leading-relaxed text-background/90 relative shadow-inner mt-4">
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
        .to('.cursor', { x: 120, y: 50, duration: 1, ease: 'power2.inOut' })
        .to('.cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.cell-active', { backgroundColor: '#16A34A', color: '#F8FAFC', duration: 0.2 }, "-=0.1")
        .to('.cursor', { x: 220, y: 130, duration: 0.8, ease: 'power2.inOut' })
        .to('.cursor', { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.cursor', { opacity: 0, duration: 0.3 });
        
      return () => tl.kill();
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="feature-card bg-white rounded-[2rem] p-8 shadow-xl border border-neutralGray/20 flex flex-col h-full relative group hover:border-accent/50 transition-colors">
      <div className="mb-6 z-10 relative">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
          <ShieldCheck size={24} />
        </div>
        <h3 className="font-sans font-bold text-2xl text-dark mb-2">Dual Verification</h3>
        <p className="font-outfit text-neutralGray text-sm">Scan a QR code or use a simple DMY-XXXX text code to verify drop-offs.</p>
      </div>
      
      <div ref={gridRef} className="flex-grow relative border border-neutralGray/20 rounded-2xl p-5 bg-background flex flex-col mt-4 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="w-14 h-14 bg-white border border-neutralGray/20 rounded-xl flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 border-[3px] border-dashed border-primary/30 rounded-sm"></div>
          </div>
          <div className="flex-1 ml-4">
            <div className="h-2.5 w-full bg-neutralGray/20 rounded-full mb-3"></div>
            <div className="h-2.5 w-2/3 bg-neutralGray/20 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="font-mono text-sm font-bold text-dark tracking-widest">DMY-4821</div>
          <div className="cell-active bg-primary text-background font-mono text-[10px] px-4 py-2 rounded-full inline-block transition-colors font-bold uppercase tracking-wider">Verify</div>
        </div>

        {/* Custom SVG Cursor */}
        <div className="cursor absolute top-0 left-0 z-20 pointer-events-none drop-shadow-xl">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3.21V20.8C5.5 21.46 6.27 21.82 6.78 21.39L10.87 17.95C11.13 17.73 11.47 17.61 11.82 17.61H18.5C19.16 17.61 19.52 16.85 19.09 16.37L5.5 3.21Z" fill="#1E3A5F" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out'
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-32 px-8 md:px-16 bg-background relative z-10 border-b border-neutralGray/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="font-sans font-bold text-4xl md:text-5xl text-dark mb-6">Functional Artifacts</h2>
          <p className="font-outfit text-neutralGray max-w-2xl text-lg md:text-xl">Designed to reduce cognitive load during emergencies and ensure exact, verified aid delivery.</p>
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
      const lines = gsap.utils.toArray('.phil-line');
      lines.forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="philosophy" ref={sectionRef} className="relative py-40 px-8 md:px-16 bg-primary overflow-hidden flex items-center justify-center border-y border-white/10">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="phil-line font-outfit text-background/70 text-xl md:text-3xl mb-10 font-light tracking-wide">
          Most disaster relief relies on guessing what's needed.
        </p>
        <p className="phil-line font-sans font-extrabold text-5xl md:text-7xl text-background leading-[1.1]">
          We match exact needs to <br/>
          <span className="font-drama italic text-accent font-normal tracking-wide drop-shadow-lg">exact donations.</span>
        </p>
      </div>
    </section>
  );
};

const ProtocolCard = ({ index, title, desc, children }) => {
  return (
    <div className="protocol-card h-[100dvh] w-full flex items-center justify-center sticky top-0 px-8 md:px-16 perspective-[1000px] bg-background">
      <div className="w-full max-w-6xl bg-white rounded-[3rem] p-12 md:p-20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-16 border border-neutralGray/10 overflow-hidden relative">
        <div className="flex-1 z-10">
          <div className="font-mono text-accent text-sm mb-6 uppercase font-bold tracking-[0.2em]">Phase 0{index}</div>
          <h2 className="font-sans font-bold text-4xl md:text-6xl text-dark mb-6">{title}</h2>
          <p className="font-outfit text-neutralGray text-lg md:text-xl leading-relaxed">{desc}</p>
        </div>
        <div className="flex-1 w-full flex justify-center items-center h-[400px] relative z-10 border border-neutralGray/10 rounded-[2rem] bg-background/50 shadow-inner overflow-hidden">
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
          gsap.to(card.querySelector('.bg-white'), {
            scale: 0.92,
            opacity: 0.6,
            filter: 'blur(10px)',
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
      gsap.to('.rotating-motif', { rotation: 360, duration: 30, repeat: -1, ease: 'linear' });
      gsap.fromTo('.laser-line', { y: -20 }, { y: 320, duration: 2.5, repeat: -1, yoyo: true, ease: 'power2.inOut' });
      gsap.to('.pulse-wave', { strokeDashoffset: 0, duration: 1.5, repeat: -1, ease: 'linear' });
      
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="protocol" ref={containerRef} className="relative">
      <ProtocolCard 
        index={1} 
        title="Post Needs" 
        desc="The barangay coordinator broadcasts real-time shortages for their evacuation centers. Needs are categorized and ranked by urgency to guide donors."
      >
        <svg className="rotating-motif w-72 h-72 opacity-60" viewBox="0 0 100 100" fill="none" stroke="#1E3A5F" strokeWidth="0.5">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx="50" cy="50" r={10 + i * 2.5} strokeDasharray={`${4 + i} ${4 + i}`} />
          ))}
          <circle cx="50" cy="50" r="48" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5 15" />
          <circle cx="50" cy="50" r="42" stroke="#DC2626" strokeWidth="0.5" strokeDasharray="2 8" />
        </svg>
      </ProtocolCard>
      
      <ProtocolCard 
        index={2} 
        title="Match & Lock" 
        desc="Donors browse the live board and pledge exact quantities. The system locks the requested items for 24 hours, preventing duplicate donations from others."
      >
        <div className="relative w-full h-full p-8 overflow-hidden bg-primary">
          <div className="grid grid-cols-8 gap-4 w-full h-full opacity-30">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="bg-white/20 rounded-sm"></div>
            ))}
          </div>
          <div className="laser-line absolute top-0 left-8 right-8 h-[3px] bg-accent shadow-[0_0_20px_rgba(245,158,11,0.9)] z-10 rounded-full"></div>
        </div>
      </ProtocolCard>
      
      <ProtocolCard 
        index={3} 
        title="Verify Delivery" 
        desc="Donors present their unique QR code or text code at the drop-off point. The coordinator scans it to verify the delivery and update the public needs board instantly."
      >
        <svg className="w-full h-32 px-12" viewBox="0 0 400 100" fill="none" stroke="#1E3A5F" strokeWidth="2.5">
          <path className="pulse-wave" strokeDasharray="800" strokeDashoffset="800" d="M0 50 L120 50 L140 20 L170 90 L200 10 L230 50 L400 50" strokeLinecap="round" strokeLinejoin="miter" />
        </svg>
      </ProtocolCard>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-40 px-8 md:px-16 bg-white relative flex items-center justify-center text-center z-10 border-t border-neutralGray/10">
      <div className="max-w-4xl">
        <h2 className="font-sans font-bold text-5xl md:text-7xl text-dark mb-8 tracking-tight">Become part of the network.</h2>
        <p className="font-outfit text-xl text-neutralGray mb-12 max-w-2xl mx-auto">Help your barangay by pledging exact items that are needed right now. Verified, structured, and fast.</p>
        <Link to="/needs">
          <MagneticButton className="bg-primary text-background px-12 py-6 text-xl inline-flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-primary/20">
            Start Helping Now <ArrowRight size={24} />
          </MagneticButton>
        </Link>
      </div>
    </section>
  );
};

export const Landing = () => {
  return (
    <main className="bg-background">
      <Hero />
      <Features />
      <Philosophy />
      <Protocol />
      <CTA />
    </main>
  );
};
