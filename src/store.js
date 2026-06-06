import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Seed Data ──────────────────────────────────────────────
const initialCenters = [
  { id: 1, name: "San Jose Evacuation Center", lat: 14.5995, lng: 120.9842, capacity: 500, current: 450, status: "Critical" },
  { id: 2, name: "Brgy. Rosario Covered Court", lat: 14.6042, lng: 120.9822, capacity: 300, current: 150, status: "Stable" },
  { id: 3, name: "Makati High School", lat: 14.5547, lng: 121.0244, capacity: 1000, current: 800, status: "Warning" },
];

const initialNeeds = [
  { id: 101, centerId: 1, category: "Hygiene", item: "Diapers (Size L)", requested: 50, pledged: 20, delivered: 0, urgency: "urgent" },
  { id: 102, centerId: 1, category: "Water", item: "10L Drinking Water", requested: 100, pledged: 100, delivered: 80, urgency: "normal" },
  { id: 103, centerId: 2, category: "Medical", item: "Insulin (10 units)", requested: 10, pledged: 2, delivered: 0, urgency: "critical" },
  { id: 104, centerId: 3, category: "Food", item: "Canned Goods", requested: 500, pledged: 480, delivered: 200, urgency: "normal" },
  { id: 105, centerId: 1, category: "Clothing", item: "Blankets", requested: 80, pledged: 30, delivered: 10, urgency: "urgent" },
  { id: 106, centerId: 3, category: "Medical", item: "Paracetamol (500mg)", requested: 200, pledged: 50, delivered: 20, urgency: "urgent" },
];

const initialTasks = [
  { id: 201, title: "Drive 20 boxes of Water to San Jose", location: "San Jose Center", status: "Open", transport: "Van/Truck" },
  { id: 202, title: "Verify Makati High School needs milk", location: "Makati High School", status: "Open", transport: "None" },
  { id: 203, title: "Sort clothes at Rosario Court", location: "Brgy. Rosario", status: "Claimed", transport: "None" },
];

const initialInventory = [
  { id: 'inv-1', category: 'Food', items: [
    { name: 'Canned Goods', current: 320, max: 500, unit: 'cans' },
    { name: 'Rice (5kg bags)', current: 45, max: 200, unit: 'bags' },
    { name: 'Instant Noodles', current: 180, max: 300, unit: 'packs' },
  ]},
  { id: 'inv-2', category: 'Water', items: [
    { name: '10L Containers', current: 80, max: 150, unit: 'containers' },
    { name: '500mL Bottles', current: 420, max: 1000, unit: 'bottles' },
  ]},
  { id: 'inv-3', category: 'Medical', items: [
    { name: 'First Aid Kits', current: 12, max: 50, unit: 'kits' },
    { name: 'Paracetamol', current: 30, max: 200, unit: 'tablets' },
    { name: 'Insulin', current: 2, max: 10, unit: 'units' },
  ]},
  { id: 'inv-4', category: 'Hygiene', items: [
    { name: 'Diapers (Size L)', current: 15, max: 100, unit: 'pcs' },
    { name: 'Soap Bars', current: 90, max: 200, unit: 'bars' },
    { name: 'Toothbrush Kits', current: 50, max: 150, unit: 'kits' },
  ]},
  { id: 'inv-5', category: 'Clothing', items: [
    { name: 'Blankets', current: 25, max: 100, unit: 'pcs' },
    { name: 'T-Shirts (Assorted)', current: 60, max: 200, unit: 'pcs' },
  ]},
];

// ── Seed admin user ────────────────────────────────────────
const seedAdmin = {
  id: 'admin-001',
  email: 'admin@damayan.ph',
  password: 'admin123',
  name: 'System Admin',
  role: 'Admin',
  status: 'active',
  createdAt: '2026-01-01T00:00:00Z',
};

const seedCoordinatorPending = {
  id: 'coord-pending-001',
  email: 'juan@brgy.ph',
  password: 'coord123',
  name: 'Juan Dela Cruz',
  role: 'Coordinator',
  status: 'pending',
  barangay: 'Brgy. San Jose',
  position: 'Barangay Captain',
  documentName: 'barangay_id_juan.pdf',
  createdAt: '2026-06-01T08:00:00Z',
};

const seedCoordinatorApproved = {
  id: 'coord-approved-001',
  email: 'maria@brgy.ph',
  password: 'coord123',
  name: 'Maria Santos',
  role: 'Coordinator',
  status: 'approved',
  barangay: 'Brgy. Rosario',
  position: 'Barangay Kagawad',
  documentName: 'barangay_cert_maria.pdf',
  createdAt: '2026-05-15T10:00:00Z',
};

const seedDonor = {
  id: 'donor-001',
  email: 'donor@email.com',
  password: 'donor123',
  name: 'Ana Reyes',
  role: 'Donor',
  status: 'active',
  createdAt: '2026-05-20T14:00:00Z',
};

// ── Store ──────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      // ── Auth ───────────────────────────────────
      users: [seedAdmin, seedCoordinatorPending, seedCoordinatorApproved, seedDonor],
      currentUser: null,
      appeals: [],

      register: (userData) => {
        const { users } = get();
        const exists = users.find(u => u.email === userData.email);
        if (exists) return { success: false, error: 'Email already registered' };

        const newUser = {
          id: `user-${Date.now()}`,
          ...userData,
          status: userData.role === 'Coordinator' ? 'pending' : 'active',
          createdAt: new Date().toISOString(),
        };

        set({ users: [...users, newUser], currentUser: newUser });
        return { success: true, user: newUser };
      },

      login: (email, password) => {
        const { users } = get();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, error: 'Invalid email or password' };
        set({ currentUser: user });
        return { success: true, user };
      },

      logout: () => set({ currentUser: null }),

      forgotPassword: (email) => {
        const { users } = get();
        const user = users.find(u => u.email === email);
        if (!user) return { success: false, error: 'No account found with this email' };
        // Simulated — in production this sends an email
        return { success: true };
      },

      resetPassword: (email, newPassword) => {
        set(state => ({
          users: state.users.map(u =>
            u.email === email ? { ...u, password: newPassword } : u
          )
        }));
      },

      // ── Admin: Coordinator Verification ────────
      verifyCoordinator: (userId) => {
        set(state => {
          const updatedUsers = state.users.map(u =>
            u.id === userId ? { ...u, status: 'approved' } : u
          );
          const currentUser = state.currentUser?.id === userId
            ? { ...state.currentUser, status: 'approved' }
            : state.currentUser;
          return { users: updatedUsers, currentUser };
        });
      },

      rejectCoordinator: (userId, reason) => {
        set(state => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, status: 'rejected', rejectionReason: reason || 'Insufficient verification documents' } : u
          )
        }));
      },

      // ── Appeals ────────────────────────────────
      submitAppeal: (userId, reason) => {
        const appeal = {
          id: `appeal-${Date.now()}`,
          userId,
          reason,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ appeals: [...state.appeals, appeal] }));
        return { success: true };
      },

      approveAppeal: (appealId) => {
        set(state => {
          const appeal = state.appeals.find(a => a.id === appealId);
          if (!appeal) return state;
          return {
            appeals: state.appeals.map(a =>
              a.id === appealId ? { ...a, status: 'approved' } : a
            ),
            users: state.users.map(u =>
              u.id === appeal.userId ? { ...u, status: 'pending' } : u
            ),
          };
        });
      },

      dismissAppeal: (appealId) => {
        set(state => ({
          appeals: state.appeals.map(a =>
            a.id === appealId ? { ...a, status: 'dismissed' } : a
          ),
        }));
      },

      // ── Disaster Relief Data ───────────────────
      centers: initialCenters,
      needs: initialNeeds,
      tasks: initialTasks,
      inventory: initialInventory,
      language: 'EN',
      isOffline: false,
      feedbacks: [],
      donations: [],
      supplyRequests: [],
      urgentAlerts: [],
      toast: null,

      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 4000);
      },

      setLanguage: (lang) => set({ language: lang }),
      toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),

      pledgeNeed: (needId, amount) => set((state) => ({
        needs: state.needs.map(n => n.id === needId ? { ...n, pledged: n.pledged + amount } : n)
      })),

      claimTask: (taskId) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: "Claimed" } : t)
      })),

      addDonation: (donation) => set((state) => ({
        donations: [...state.donations, { id: Date.now(), ...donation, status: 'Pending QR Scan' }]
      })),

      markDelivered: (qrId) => set((state) => {
        const donation = state.donations.find(d => d.id === qrId);
        if (!donation) return state;
        return {
          donations: state.donations.map(d => d.id === qrId ? { ...d, status: 'Delivered' } : d),
          needs: state.needs.map(n => n.id === donation.needId ? { ...n, delivered: n.delivered + donation.amount, pledged: Math.max(0, n.pledged - donation.amount) } : n),
        };
      }),

      addFeedback: (feedback) => set((state) => ({
        feedbacks: [...state.feedbacks, { id: Date.now(), ...feedback }]
      })),

      // ── Coordinator: Supply Requests ───────────
      submitSupplyRequest: (request) => {
        const newRequest = {
          id: `req-${Date.now()}`,
          ...request,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          supplyRequests: [...state.supplyRequests, newRequest]
        }));
        return { success: true };
      },

      // ── Coordinator: Urgent Alerts ─────────────
      broadcastUrgentAlert: (alert) => {
        const newAlert = {
          id: `alert-${Date.now()}`,
          ...alert,
          createdAt: new Date().toISOString(),
        };
        set(state => ({
          urgentAlerts: [newAlert, ...state.urgentAlerts]
        }));
      },

      // ── Coordinator: Update Center ─────────────
      updateCenter: (centerId, updates) => set(state => ({
        centers: state.centers.map(c => c.id === centerId ? { ...c, ...updates } : c)
      })),

      // ── Coordinator: Update Inventory ──────────
      updateInventoryItem: (categoryId, itemName, newCurrent) => set(state => ({
        inventory: state.inventory.map(cat =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.map(item => item.name === itemName ? { ...item, current: newCurrent } : item) }
            : cat
        )
      })),
    }),
    {
      name: 'damayan-storage',
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        appeals: state.appeals,
        centers: state.centers,
        needs: state.needs,
        tasks: state.tasks,
        inventory: state.inventory,
        donations: state.donations,
        feedbacks: state.feedbacks,
        supplyRequests: state.supplyRequests,
        urgentAlerts: state.urgentAlerts,
      }),
    }
  )
);
