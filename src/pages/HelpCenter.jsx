import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { HelpCircle, ChevronDown, Package, QrCode, Shield, Clock, AlertTriangle, CheckCircle, Users, BookOpen } from 'lucide-react';

const faqSections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      {
        q: 'What is Damayan Match?',
        a: 'Damayan Match is a barangay-based relief goods matching system. It connects evacuation centers directly with donors to ensure the right items go where they\'re needed — no duplicates, no waste.',
      },
      {
        q: 'How do I register as a donor?',
        a: 'Click "Sign In" in the navigation bar, then select "Register" to create your account. Community members can register using a barangay QR code, while external donors can sign up with their location details.',
      },
      {
        q: 'What\'s the difference between Community and External donors?',
        a: 'Community donors are residents of the barangay who registered through their local coordinator. External donors are people outside the barangay who want to help — they can register without a barangay QR code.',
      },
    ],
  },
  {
    title: 'Pledging Items',
    icon: Package,
    items: [
      {
        q: 'How do I pledge a donation?',
        a: 'Visit the Needs Board to see what items are currently needed. Click "Pledge Exact Item" on any active need, select the quantity you can deliver, and confirm. You\'ll receive a QR code and verification code.',
      },
      {
        q: 'What is a partial pledge?',
        a: 'A partial pledge means donating less than the total remaining need. For example, if 50 cans are needed and you can provide 10, that\'s a partial pledge. Every contribution counts — you don\'t need to fulfill the entire need.',
      },
      {
        q: 'Can I pledge more than what\'s remaining?',
        a: 'No. The system automatically caps your pledge at the remaining quantity to prevent over-pledging. This ensures resources are distributed where they\'re truly needed.',
      },
      {
        q: 'How long do I have to deliver my pledge?',
        a: 'You have 24 hours from the time you make your pledge to deliver the items. A countdown timer is shown on your dashboard. If the pledge expires, the quantity is returned to the needs pool and you may receive a strike.',
      },
    ],
  },
  {
    title: 'QR Codes & Verification',
    icon: QrCode,
    items: [
      {
        q: 'How does the QR verification process work?',
        a: 'After pledging, you receive a QR code and a manual verification code (e.g., DMY-4821). When you deliver your items to the drop-off point, the barangay coordinator will scan your QR code or enter your manual code to verify the delivery.',
      },
      {
        q: 'What if the coordinator can\'t scan my QR code?',
        a: 'No worries! You can give them your manual verification code (like DMY-XXXX) instead. The coordinator can also search for your pledge by your name or phone number in their verification panel.',
      },
      {
        q: 'Can I save or download my QR code?',
        a: 'Yes! After pledging, you can download the QR code as a PNG image or copy your verification code to the clipboard. This way you have it saved even if you close the app.',
      },
    ],
  },
  {
    title: 'Verification Types',
    icon: CheckCircle,
    items: [
      {
        q: 'What does "Full Match" verification mean?',
        a: 'Full Match means you delivered exactly the quantity you pledged. For example, if you pledged 10 cans and delivered 10 cans, the coordinator will mark it as a Full Match. ✅',
      },
      {
        q: 'What is "Partial" verification?',
        a: 'Partial verification is used when you delivered fewer items than pledged. The coordinator enters the actual delivered quantity. The remaining undelivered items are returned to the needs pool so other donors can help fill the gap.',
      },
      {
        q: 'What does "Reject" mean?',
        a: 'Rejection means the delivered items didn\'t meet the requirements (wrong items, damaged goods, etc.). The full pledged quantity is returned to the needs pool, and the donor receives a strike. This is a last resort.',
      },
    ],
  },
  {
    title: 'Strike System',
    icon: Shield,
    items: [
      {
        q: 'What are strikes?',
        a: 'Strikes are accountability measures. You receive a strike when a pledge expires without delivery or when a donation is rejected. This prevents hoarding of needs and ensures the system stays reliable.',
      },
      {
        q: 'What happens at different strike levels?',
        a: '• 0 strikes: Full access\n• 1 strike: Warning — be careful with your pledges\n• 2 strikes: Account temporarily suspended\n• 3 strikes: Account blocked — contact your barangay coordinator to resolve',
      },
      {
        q: 'Can strikes be removed?',
        a: 'Contact your barangay coordinator to discuss your situation. They have the ability to review and manage donor accounts.',
      },
    ],
  },
  {
    title: 'For Coordinators',
    icon: Users,
    items: [
      {
        q: 'How do I post a new need?',
        a: 'Go to your Coordinator Dashboard → "Post Need" tab. Fill in the item name, category, quantity needed, urgency level, and drop-off location. The need will appear immediately on the public Needs Board.',
      },
      {
        q: 'What does "+1 Walk-in" do?',
        a: 'The "+1 Walk-in" button lets you manually add deliveries from donors who show up without a pledge (walk-in donations). This updates the need\'s delivered count without requiring a QR or code.',
      },
      {
        q: 'How do I close a need?',
        a: 'In the Needs Tracker tab, click the "Close" button on any active need. You\'ll be asked to confirm. Closing a need removes it from the public board. Use this when a need is no longer relevant.',
      },
    ],
  },
];

const AccordionItem = ({ question, answer, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.35,
        ease: 'power2.inOut',
      });
    }
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: isOpen ? 180 : 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  }, [isOpen]);

  return (
    <div className={`border-b border-neutralGray/10 transition-colors ${isOpen ? 'bg-primary/[0.02]' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left group hover:bg-primary/[0.03] transition-colors"
      >
        <span className={`font-outfit text-sm font-semibold transition-colors ${isOpen ? 'text-accent' : 'text-primary'}`}>
          {question}
        </span>
        <span ref={arrowRef} className="shrink-0 ml-3">
          <ChevronDown size={16} className="text-neutralGray" />
        </span>
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <div className="px-5 pb-4">
          <p className="font-outfit text-sm text-neutralGray leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export const HelpCenter = () => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (sectionIdx, itemIdx) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="pt-32 px-4 md:px-8 lg:px-16 pb-24 min-h-screen bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 mb-3 justify-center">
            <div className="h-[1px] w-8 bg-accent"></div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-accent">Support</span>
            <div className="h-[1px] w-8 bg-accent"></div>
          </div>
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-3">Help Center</h1>
          <p className="font-outfit text-neutralGray text-lg max-w-xl mx-auto">
            Everything you need to know about using Damayan Match — from pledging to verification.
          </p>
        </div>

        {/* Quick Guide Banner */}
        <div className="mb-10 p-6 bg-accent/5 border border-accent/20 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
            <HelpCircle size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-primary mb-1">Quick Start Guide</h3>
            <p className="font-outfit text-sm text-neutralGray">
              <strong className="text-primary">Donors:</strong> Visit the Needs Board → Pledge items → Deliver with your QR code.{' '}
              <strong className="text-primary">Coordinators:</strong> Post needs → Verify deliveries → Track progress.
            </p>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqSections.map((section, sIdx) => (
            <div key={sIdx} className="bg-white rounded-[2rem] border border-neutralGray/20 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-5 border-b border-neutralGray/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                  <section.icon size={20} className="text-primary" />
                </div>
                <h2 className="font-sans font-bold text-lg text-primary">{section.title}</h2>
              </div>

              {/* Items */}
              <div>
                {section.items.map((item, iIdx) => (
                  <AccordionItem
                    key={iIdx}
                    question={item.q}
                    answer={item.a}
                    isOpen={!!openItems[`${sIdx}-${iIdx}`]}
                    onToggle={() => toggleItem(sIdx, iIdx)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Banner */}
        <div className="mt-10 p-8 bg-primary rounded-[2rem] text-center">
          <h3 className="font-sans font-bold text-2xl text-background mb-2">Still need help?</h3>
          <p className="font-outfit text-background/70 mb-4">Contact your barangay coordinator for personalized assistance.</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-background font-mono text-sm">
            <Users size={16} />
            Reach out to your local Damayan coordinator
          </div>
        </div>
      </div>
    </div>
  );
};
