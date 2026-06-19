import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Helpers ────────────────────────────────────────────────
const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'DMY-';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const generateId = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// ── Seed Data ──────────────────────────────────────────────
const seedBarangay = {
  id: 'brgy-001',
  name: 'Brgy. Ibabang Dupay',
  email: 'ibabangdupay@brgy.gov.ph',
  password: 'brgy123',
  coordinatorName: 'Kap. Juan Dela Cruz',
  position: 'Barangay Captain',
  registrationQR: 'DAMAYAN-BRGY-IBABANGDUPAY-001',
  deviceId: 'device-001',
  municipality: 'Lucena City',
  province: 'Quezon',
};

const seedDonors = [
  {
    id: 'donor-001',
    name: 'Maria Santos',
    phone: '09171234567',
    address: 'Block 5, Lot 12, Ibabang Dupay',
    password: 'donor123',
    type: 'community',
    isAnonymous: false,
    strikes: 0,
    status: 'active',
    barangayId: 'brgy-001',
    createdAt: '2026-06-01T08:00:00Z',
  },
  {
    id: 'donor-002',
    name: 'Pedro Reyes',
    phone: '09289876543',
    address: '123 Rizal St., Ibabang Dupay',
    password: 'donor123',
    type: 'community',
    isAnonymous: true,
    strikes: 1,
    status: 'active',
    barangayId: 'brgy-001',
    createdAt: '2026-06-05T10:00:00Z',
  },
  {
    id: 'donor-003',
    name: 'Ana Garcia',
    phone: '09351112222',
    location: 'Tayabas City, Quezon',
    type: 'external',
    isAnonymous: false,
    strikes: 0,
    status: 'active',
    barangayId: 'brgy-001',
    createdAt: '2026-06-15T14:00:00Z',
  },
];

const seedNeeds = [
  {
    id: 'need-001',
    itemName: 'Canned Goods (Assorted)',
    category: 'Food',
    quantityNeeded: 50,
    quantityPledged: 15,
    quantityDelivered: 5,
    urgency: 'critical',
    dropOffPoint: 'Ibabang Dupay Covered Court',
    status: 'active',
    createdAt: '2026-06-18T06:00:00Z',
  },
  {
    id: 'need-002',
    itemName: '10L Drinking Water',
    category: 'Water',
    quantityNeeded: 100,
    quantityPledged: 30,
    quantityDelivered: 20,
    urgency: 'critical',
    dropOffPoint: 'Ibabang Dupay Covered Court',
    status: 'active',
    createdAt: '2026-06-18T06:30:00Z',
  },
  {
    id: 'need-003',
    itemName: 'Paracetamol (500mg)',
    category: 'Medicine',
    quantityNeeded: 200,
    quantityPledged: 40,
    quantityDelivered: 10,
    urgency: 'moderate',
    dropOffPoint: 'Barangay Health Center',
    status: 'active',
    createdAt: '2026-06-18T07:00:00Z',
  },
  {
    id: 'need-004',
    itemName: 'Blankets',
    category: 'Clothing',
    quantityNeeded: 80,
    quantityPledged: 20,
    quantityDelivered: 15,
    urgency: 'moderate',
    dropOffPoint: 'Ibabang Dupay Covered Court',
    status: 'active',
    createdAt: '2026-06-18T08:00:00Z',
  },
  {
    id: 'need-005',
    itemName: 'Hygiene Kit (Soap, Toothbrush, Shampoo)',
    category: 'Hygiene',
    quantityNeeded: 60,
    quantityPledged: 60,
    quantityDelivered: 60,
    urgency: 'stable',
    dropOffPoint: 'Barangay Hall',
    status: 'fulfilled',
    createdAt: '2026-06-17T10:00:00Z',
  },
];

const now = Date.now();
const seedPledges = [
  {
    id: 'pledge-001',
    needId: 'need-001',
    donorId: 'donor-001',
    quantity: 10,
    verificationCode: 'DMY-4821',
    qrData: 'DAMAYAN-PLEDGE-001-10-CANNED',
    status: 'verified_full',
    actualDelivered: 10,
    createdAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pledge-002',
    needId: 'need-002',
    donorId: 'donor-002',
    quantity: 15,
    verificationCode: 'DMY-7293',
    qrData: 'DAMAYAN-PLEDGE-002-15-WATER',
    status: 'reserved',
    actualDelivered: null,
    createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now + 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pledge-003',
    needId: 'need-001',
    donorId: 'donor-003',
    quantity: 5,
    verificationCode: 'DMY-1056',
    qrData: 'DAMAYAN-PLEDGE-003-5-CANNED',
    status: 'reserved',
    actualDelivered: null,
    createdAt: new Date(now - 23 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now + 1 * 60 * 60 * 1000).toISOString(), // expiring soon!
  },
];

const seedDonationHistory = [
  {
    id: 'history-001',
    pledgeId: 'pledge-001',
    donorId: 'donor-001',
    needId: 'need-001',
    itemName: 'Canned Goods (Assorted)',
    quantity: 10,
    verifiedAt: new Date(now - 46 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'qr',
  },
];

// ── Store ──────────────────────────────────────────────────
export const useStore = create(
  persist(
    (set, get) => ({
      // ── Barangay (single instance) ────────────────
      barangay: seedBarangay,
      currentUser: null, // { ...userData, userType: 'coordinator' | 'donor' }

      // ── Donors ────────────────────────────────────
      donors: seedDonors,

      // ── Needs ─────────────────────────────────────
      needs: seedNeeds,

      // ── Pledges ───────────────────────────────────
      pledges: seedPledges,

      // ── Donation History ──────────────────────────
      donationHistory: seedDonationHistory,

      // ── UI State ──────────────────────────────────
      toast: null,
      pledgeModal: null, // { needId } when open

      // ── Toast ─────────────────────────────────────
      showToast: (message, type = 'success') => {
        set({ toast: { message, type } });
        setTimeout(() => set({ toast: null }), 4000);
      },

      // ═══════════════════════════════════════════════
      // AUTH
      // ═══════════════════════════════════════════════

      loginAsCoordinator: (email, password) => {
        const { barangay } = get();
        if (barangay.email === email && barangay.password === password) {
          set({ currentUser: { ...barangay, userType: 'coordinator' } });
          return { success: true };
        }
        return { success: false, error: 'Invalid barangay email or password' };
      },

      loginAsDonor: (phone, password) => {
        const { donors } = get();
        const donor = donors.find(d => d.phone === phone && d.password === password);
        if (!donor) return { success: false, error: 'Invalid phone number or password' };
        if (donor.status === 'blocked') return { success: false, error: 'Your account has been restricted due to multiple failed pledges. Contact the barangay coordinator.' };
        if (donor.status === 'suspended') return { success: false, error: 'Your account is temporarily suspended. Please wait or contact the barangay coordinator.' };
        set({ currentUser: { ...donor, userType: 'donor' } });
        return { success: true };
      },

      registerDonor: (donorData) => {
        const { donors } = get();
        // Check if phone already registered
        const exists = donors.find(d => d.phone === donorData.phone);
        if (exists) return { success: false, error: 'This phone number is already registered' };

        const newDonor = {
          id: generateId('donor'),
          ...donorData,
          isAnonymous: false,
          strikes: 0,
          status: 'active',
          barangayId: 'brgy-001',
          createdAt: new Date().toISOString(),
        };

        set({ donors: [...donors, newDonor], currentUser: { ...newDonor, userType: 'donor' } });
        return { success: true, donor: newDonor };
      },

      logout: () => set({ currentUser: null }),

      // ═══════════════════════════════════════════════
      // NEEDS (Coordinator)
      // ═══════════════════════════════════════════════

      postNeed: ({ itemName, category, quantity, urgency, dropOffPoint }) => {
        const newNeed = {
          id: generateId('need'),
          itemName,
          category,
          quantityNeeded: quantity,
          quantityPledged: 0,
          quantityDelivered: 0,
          urgency,
          dropOffPoint,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ needs: [newNeed, ...state.needs] }));
        get().showToast(`Need posted: ${quantity}x ${itemName}`, 'success');
        return { success: true, need: newNeed };
      },

      updateNeed: (needId, updates) => {
        set(state => ({
          needs: state.needs.map(n => n.id === needId ? { ...n, ...updates } : n),
        }));
      },

      closeNeed: (needId) => {
        set(state => ({
          needs: state.needs.map(n => n.id === needId ? { ...n, status: 'closed' } : n),
        }));
        get().showToast('Need request closed', 'success');
      },

      // Manual adjustment for walk-in donations
      adjustNeedQuantity: (needId, deliveredAmount) => {
        set(state => ({
          needs: state.needs.map(n => {
            if (n.id !== needId) return n;
            const newDelivered = n.quantityDelivered + deliveredAmount;
            const isFulfilled = newDelivered >= n.quantityNeeded;
            return {
              ...n,
              quantityDelivered: newDelivered,
              status: isFulfilled ? 'fulfilled' : n.status,
            };
          }),
        }));
        get().showToast(`Manual adjustment: +${deliveredAmount} delivered`, 'success');
      },

      // ═══════════════════════════════════════════════
      // PLEDGES (Donors)
      // ═══════════════════════════════════════════════

      createPledge: (needId, donorId, quantity) => {
        const { needs, pledges } = get();
        const need = needs.find(n => n.id === needId);
        if (!need) return { success: false, error: 'Need not found' };

        // First-commit locking: check remaining
        const remaining = need.quantityNeeded - need.quantityPledged - need.quantityDelivered;
        if (quantity > remaining) {
          return { success: false, error: `Only ${remaining} remaining. Reduce your pledge quantity.` };
        }
        if (remaining <= 0) {
          return { success: false, error: 'This need has already been fully pledged.' };
        }

        const verificationCode = generateCode();
        const pledgeId = generateId('pledge');
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

        const newPledge = {
          id: pledgeId,
          needId,
          donorId,
          quantity,
          verificationCode,
          qrData: `DAMAYAN-${pledgeId}-${quantity}-${need.itemName.substring(0, 10).replace(/\s+/g, '')}`,
          status: 'reserved',
          actualDelivered: null,
          createdAt: createdAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };

        // Atomically update pledge + need quantity (first-commit lock)
        set(state => ({
          pledges: [...state.pledges, newPledge],
          needs: state.needs.map(n =>
            n.id === needId
              ? { ...n, quantityPledged: n.quantityPledged + quantity }
              : n
          ),
        }));

        return { success: true, pledge: newPledge };
      },

      // ═══════════════════════════════════════════════
      // VERIFICATION (Coordinator)
      // ═══════════════════════════════════════════════

      verifyPledge: (pledgeId, verificationType, actualQuantity = null) => {
        // verificationType: 'full' | 'partial' | 'reject'
        const { pledges, needs, donors } = get();
        const pledge = pledges.find(p => p.id === pledgeId);
        if (!pledge) return { success: false, error: 'Pledge not found' };
        if (pledge.status !== 'reserved') return { success: false, error: 'Pledge is not in reserved status' };

        const need = needs.find(n => n.id === pledge.needId);

        if (verificationType === 'full') {
          // Full match
          const delivered = pledge.quantity;
          set(state => ({
            pledges: state.pledges.map(p =>
              p.id === pledgeId ? { ...p, status: 'verified_full', actualDelivered: delivered } : p
            ),
            needs: state.needs.map(n => {
              if (n.id !== pledge.needId) return n;
              const newPledged = Math.max(0, n.quantityPledged - delivered);
              const newDelivered = n.quantityDelivered + delivered;
              const isFulfilled = newDelivered >= n.quantityNeeded;
              return { ...n, quantityPledged: newPledged, quantityDelivered: newDelivered, status: isFulfilled ? 'fulfilled' : n.status };
            }),
            donationHistory: [...state.donationHistory, {
              id: generateId('history'),
              pledgeId,
              donorId: pledge.donorId,
              needId: pledge.needId,
              itemName: need?.itemName || 'Unknown',
              quantity: delivered,
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'qr',
            }],
          }));
          get().showToast(`Donation verified: ${delivered}x ${need?.itemName}`, 'success');
          return { success: true };
        }

        if (verificationType === 'partial') {
          // Partial match — actualQuantity is what was really delivered
          const delivered = actualQuantity || 0;
          const returned = pledge.quantity - delivered;

          set(state => ({
            pledges: state.pledges.map(p =>
              p.id === pledgeId ? { ...p, status: 'verified_partial', actualDelivered: delivered } : p
            ),
            needs: state.needs.map(n => {
              if (n.id !== pledge.needId) return n;
              // Remove the full pledge from pledged, add actual delivered, return difference
              const newPledged = Math.max(0, n.quantityPledged - pledge.quantity);
              const newDelivered = n.quantityDelivered + delivered;
              const isFulfilled = newDelivered >= n.quantityNeeded;
              return { ...n, quantityPledged: newPledged, quantityDelivered: newDelivered, status: isFulfilled ? 'fulfilled' : n.status };
            }),
            donationHistory: [...state.donationHistory, {
              id: generateId('history'),
              pledgeId,
              donorId: pledge.donorId,
              needId: pledge.needId,
              itemName: need?.itemName || 'Unknown',
              quantity: delivered,
              verifiedAt: new Date().toISOString(),
              verifiedBy: 'manual',
            }],
          }));
          get().showToast(`Partial verification: ${delivered}/${pledge.quantity} delivered. ${returned} returned to pool.`, 'warning');
          return { success: true };
        }

        if (verificationType === 'reject') {
          // Reject — return all to pool, add strike
          set(state => ({
            pledges: state.pledges.map(p =>
              p.id === pledgeId ? { ...p, status: 'rejected', actualDelivered: 0 } : p
            ),
            needs: state.needs.map(n =>
              n.id === pledge.needId
                ? { ...n, quantityPledged: Math.max(0, n.quantityPledged - pledge.quantity) }
                : n
            ),
          }));
          get().addStrike(pledge.donorId);
          get().showToast('Donation rejected. Quantity returned to needs pool.', 'error');
          return { success: true };
        }

        return { success: false, error: 'Invalid verification type' };
      },

      // Look up pledge by verification code
      findPledgeByCode: (code) => {
        const { pledges } = get();
        return pledges.find(p => p.verificationCode === code && p.status === 'reserved');
      },

      // Look up pledge by QR data
      findPledgeByQR: (qrData) => {
        const { pledges } = get();
        return pledges.find(p => p.qrData === qrData && p.status === 'reserved');
      },

      // Fallback: search by phone or name
      findPledgesByDonorSearch: (searchTerm) => {
        const { donors, pledges } = get();
        const term = searchTerm.toLowerCase();
        const matchedDonors = donors.filter(d =>
          d.phone.includes(term) || d.name.toLowerCase().includes(term)
        );
        const donorIds = matchedDonors.map(d => d.id);
        return pledges.filter(p => donorIds.includes(p.donorId) && p.status === 'reserved');
      },

      // ═══════════════════════════════════════════════
      // EXPIRATION SYSTEM
      // ═══════════════════════════════════════════════

      expirePledges: () => {
        const { pledges, needs } = get();
        const now = new Date();
        let expiredCount = 0;

        const updatedPledges = pledges.map(p => {
          if (p.status === 'reserved' && new Date(p.expiresAt) <= now) {
            expiredCount++;
            return { ...p, status: 'expired' };
          }
          return p;
        });

        if (expiredCount > 0) {
          // Calculate how much to return to each need
          const returnsPerNeed = {};
          pledges.forEach(p => {
            if (p.status === 'reserved' && new Date(p.expiresAt) <= now) {
              returnsPerNeed[p.needId] = (returnsPerNeed[p.needId] || 0) + p.quantity;
            }
          });

          const updatedNeeds = needs.map(n => {
            if (returnsPerNeed[n.id]) {
              return { ...n, quantityPledged: Math.max(0, n.quantityPledged - returnsPerNeed[n.id]) };
            }
            return n;
          });

          // Add strikes for expired pledges
          const expiredDonorIds = pledges
            .filter(p => p.status === 'reserved' && new Date(p.expiresAt) <= now)
            .map(p => p.donorId);

          set({ pledges: updatedPledges, needs: updatedNeeds });

          // Add strikes for each expired pledge
          const uniqueDonorIds = [...new Set(expiredDonorIds)];
          uniqueDonorIds.forEach(donorId => get().addStrike(donorId));

          if (expiredCount > 0) {
            get().showToast(`${expiredCount} pledge(s) expired. Quantities returned to pool.`, 'warning');
          }
        }
      },

      // ═══════════════════════════════════════════════
      // STRIKE SYSTEM
      // ═══════════════════════════════════════════════

      addStrike: (donorId) => {
        set(state => ({
          donors: state.donors.map(d => {
            if (d.id !== donorId) return d;
            const newStrikes = d.strikes + 1;
            let newStatus = d.status;
            if (newStrikes >= 3) newStatus = 'blocked';
            else if (newStrikes >= 2) newStatus = 'suspended';
            return { ...d, strikes: newStrikes, status: newStatus };
          }),
        }));
      },

      // ═══════════════════════════════════════════════
      // DONOR FEATURES
      // ═══════════════════════════════════════════════

      toggleAnonymous: (donorId) => {
        set(state => ({
          donors: state.donors.map(d =>
            d.id === donorId ? { ...d, isAnonymous: !d.isAnonymous } : d
          ),
          currentUser: state.currentUser?.id === donorId
            ? { ...state.currentUser, isAnonymous: !state.currentUser.isAnonymous }
            : state.currentUser,
        }));
      },

      // Get donor's pledges
      getDonorPledges: (donorId) => {
        const { pledges } = get();
        return pledges.filter(p => p.donorId === donorId);
      },

      // Get donor's donation history
      getDonorHistory: (donorId) => {
        const { donationHistory } = get();
        return donationHistory.filter(h => h.donorId === donorId);
      },

      // Get donor by ID
      getDonor: (donorId) => {
        const { donors } = get();
        return donors.find(d => d.id === donorId);
      },

      // ═══════════════════════════════════════════════
      // PLEDGE MODAL
      // ═══════════════════════════════════════════════

      openPledgeModal: (needId) => set({ pledgeModal: { needId } }),
      closePledgeModal: () => set({ pledgeModal: null }),
    }),
    {
      name: 'damayan-match-storage',
      partialize: (state) => ({
        barangay: state.barangay,
        currentUser: state.currentUser,
        donors: state.donors,
        needs: state.needs,
        pledges: state.pledges,
        donationHistory: state.donationHistory,
      }),
    }
  )
);
