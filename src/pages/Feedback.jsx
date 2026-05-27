import React, { useState } from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { Star, Send, MessageSquare, Mic } from 'lucide-react';

export const Feedback = () => {
  const { feedbacks, addFeedback, centers } = useStore();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [role, setRole] = useState('donor');
  const [centerId, setCenterId] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    addFeedback({
      role,
      centerId: centerId || null,
      rating,
      comment,
      date: new Date().toISOString()
    });
    setSubmitted(true);
    setTimeout(() => {
      setRating(0);
      setComment('');
      setCenterId('');
      setSubmitted(false);
    }, 3000);
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-screen bg-background text-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-sans font-bold text-4xl md:text-5xl mb-2">Post-Disaster Feedback</h1>
        <p className="font-outfit text-dark/70 text-lg mb-12 max-w-2xl">
          Help us improve the Damayan network. Rate your experience after donating, volunteering, or receiving aid.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 shadow-xl border border-primary/5">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare className="text-green-600" size={32} />
                </div>
                <h3 className="font-sans font-bold text-2xl text-primary mb-2">Salamat!</h3>
                <p className="font-outfit text-dark/60">Your feedback helps us build a better relief network.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-outfit text-sm font-bold text-primary mb-3">I am a:</label>
                  <div className="flex gap-3">
                    {['donor', 'volunteer', 'evacuee', 'coordinator'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-4 py-2 rounded-xl text-sm font-outfit font-semibold border capitalize transition-all ${
                          role === r
                            ? 'bg-primary text-background border-primary'
                            : 'bg-background border-primary/10 text-primary/70 hover:border-primary/30'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-outfit text-sm font-bold text-primary mb-3">Related Center (optional):</label>
                  <select
                    value={centerId}
                    onChange={(e) => setCenterId(e.target.value)}
                    className="w-full bg-background border border-primary/10 rounded-xl px-4 py-3 font-outfit text-sm outline-none focus:border-accent"
                  >
                    <option value="">— Select a center —</option>
                    {centers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-outfit text-sm font-bold text-primary mb-3">Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'fill-accent text-accent'
                              : 'text-primary/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-outfit text-sm font-bold text-primary mb-3">Comments:</label>
                  <div className="relative">
                    <textarea
                      rows="4"
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-background border border-primary/10 rounded-xl p-4 pr-10 font-outfit text-sm outline-none focus:border-accent resize-none"
                    ></textarea>
                    <Mic className="absolute right-3 bottom-3 w-4 h-4 text-primary/30 cursor-pointer hover:text-accent transition-colors" title="Voice input" />
                  </div>
                </div>

                <MagneticButton
                  type="submit"
                  className="w-full bg-primary text-background py-4 text-base"
                >
                  Submit Feedback <Send size={18} />
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-primary/5 text-center">
              <div className="font-mono text-xs uppercase tracking-widest text-dark/50 mb-3">Community Rating</div>
              <div className="font-sans font-bold text-6xl text-primary mb-2">{avgRating}</div>
              <div className="flex justify-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(parseFloat(avgRating) || 0) ? 'fill-accent text-accent' : 'text-primary/15'} />
                ))}
              </div>
              <div className="font-outfit text-dark/50 text-sm mt-2">{feedbacks.length} response{feedbacks.length !== 1 ? 's' : ''}</div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-primary/5">
              <h4 className="font-sans font-bold text-lg text-primary mb-4">Recent Feedback</h4>
              {feedbacks.length === 0 ? (
                <p className="font-outfit text-dark/40 text-sm italic">No feedback yet. Be the first!</p>
              ) : (
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {[...feedbacks].reverse().slice(0, 5).map(fb => (
                    <div key={fb.id} className="border-b border-primary/5 pb-3 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-primary/50 bg-primary/5 px-2 py-0.5 rounded-full">{fb.role}</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={10} className={s <= fb.rating ? 'fill-accent text-accent' : 'text-primary/15'} />
                          ))}
                        </div>
                      </div>
                      {fb.comment && <p className="font-outfit text-dark/70 text-xs mt-1">{fb.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
