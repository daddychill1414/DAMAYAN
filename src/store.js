import { create } from 'zustand';

const initialCenters = [
  { id: 1, name: "San Jose Evacuation Center", lat: 14.5995, lng: 120.9842, capacity: 500, current: 450, status: "Critical" },
  { id: 2, name: "Brgy. Rosario Covered Court", lat: 14.6042, lng: 120.9822, capacity: 300, current: 150, status: "Stable" },
  { id: 3, name: "Makati High School", lat: 14.5547, lng: 121.0244, capacity: 1000, current: 800, status: "Warning" },
];

const initialNeeds = [
  { id: 101, centerId: 1, category: "Hygiene", item: "Diapers (Size L)", requested: 50, pledged: 20, delivered: 0 },
  { id: 102, centerId: 1, category: "Water", item: "10L Drinking Water", requested: 100, pledged: 100, delivered: 80 },
  { id: 103, centerId: 2, category: "Medical", item: "Insulin (10 units)", requested: 10, pledged: 2, delivered: 0 },
  { id: 104, centerId: 3, category: "Food", item: "Canned Goods", requested: 500, pledged: 480, delivered: 200 },
];

const initialTasks = [
  { id: 201, title: "Drive 20 boxes of Water to San Jose", location: "San Jose Center", status: "Open", transport: "Van/Truck" },
  { id: 202, title: "Verify Makati High School needs milk", location: "Makati High School", status: "Open", transport: "None" },
  { id: 203, title: "Sort clothes at Rosario Court", location: "Brgy. Rosario", status: "Claimed", transport: "None" },
];

export const useStore = create((set) => ({
  centers: initialCenters,
  needs: initialNeeds,
  tasks: initialTasks,
  language: 'EN',
  isOffline: false,
  feedbacks: [],
  donations: [],
  currentUser: null, // { role: 'Donor' | 'Volunteer' | 'Center Admin' | 'Coordinator', name: string }
  toast: null, // { message: string, type: 'success' | 'info' | 'warning' }
  
  login: (role, name) => set({ currentUser: { role, name } }),
  logout: () => set({ currentUser: null }),
  
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 4000);
  },

  setLanguage: (lang) => set({ language: lang }),
  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  
  pledgeNeed: (needId, amount) => set((state) => {
    // Check if the pledge exceeds requested amount - simulating the duplicate alert context
    const updatedNeeds = state.needs.map(n => n.id === needId ? { ...n, pledged: n.pledged + amount } : n);
    return { needs: updatedNeeds };
  }),

  claimTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "Claimed" } : t)
  })),

  addDonation: (donation) => set((state) => ({
    donations: [...state.donations, { id: Date.now(), ...donation, status: 'Pending QR Scan' }]
  })),

  markDelivered: (qrId) => set((state) => {
    // Simplified simulation: QR id matches a donation id. We find the donation, mark it delivered, and update the needs.
    const donation = state.donations.find(d => d.id === qrId);
    if (!donation) return state;

    const updatedDonations = state.donations.map(d => d.id === qrId ? { ...d, status: 'Delivered' } : d);
    const updatedNeeds = state.needs.map(n => n.id === donation.needId ? { ...n, delivered: n.delivered + donation.amount, pledged: Math.max(0, n.pledged - donation.amount) } : n);
    
    return { donations: updatedDonations, needs: updatedNeeds };
  }),

  addFeedback: (feedback) => set((state) => ({
    feedbacks: [...state.feedbacks, { id: Date.now(), ...feedback }]
  })),
}));
