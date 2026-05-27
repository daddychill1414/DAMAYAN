import React from 'react';
import { useStore } from '../store';
import { MagneticButton } from '../components/MagneticButton';
import { Truck, CheckCircle } from 'lucide-react';

export const VolunteerHub = () => {
  const { tasks, claimTask, showToast } = useStore();

  const handleClaim = (taskId) => {
    claimTask(taskId);
    showToast("Task Claimed! A coordinator will contact you shortly.", 'success');
  };

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-[80vh] bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Volunteer Hub</h1>
        <p className="font-outfit text-dark/70 mb-12 max-w-2xl text-lg">Pick up micro-tasks based on your location and capabilities.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-primary/5 border border-primary/5 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-1 rounded-full flex items-center gap-1">
                  <Truck size={10} /> {task.transport}
                </span>
                <span className={`font-mono text-[10px] px-2 py-1 rounded-full uppercase ${task.status === 'Open' ? 'text-accent bg-accent/10' : 'text-green-600 bg-green-100'}`}>
                  {task.status}
                </span>
              </div>
              
              <h3 className="font-sans font-bold text-xl text-primary mb-2 leading-tight">{task.title}</h3>
              <div className="text-dark/60 font-outfit text-sm mb-6">
                📍 {task.location}
              </div>

              <div className="mt-auto pt-4 border-t border-primary/5">
                {task.status === 'Open' ? (
                  <MagneticButton 
                    onClick={() => handleClaim(task.id)}
                    className="w-full bg-primary text-background py-3 text-sm"
                  >
                    Claim Task
                  </MagneticButton>
                ) : (
                  <button disabled className="w-full bg-green-500/10 text-green-700 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                    <CheckCircle size={16} /> Claimed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
