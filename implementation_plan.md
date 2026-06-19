# Implementation of HCI2-Evidence Requirements

This plan details the implementation of the missing features identified from the `HCI2-Evidence-1.pdf` research into the Damayan App. The goal is to address stakeholder pain points regarding transparency, operational efficiency, and error reduction.

> [!IMPORTANT]
> ## User Review Required
> Please review this plan carefully. This involves adding new pages (like a public Financial Ledger) and fundamentally changing how inventory is updated (requiring multi-tier approvals instead of direct edits). Once you approve, I will execute these changes.

## Open Questions
- For the **Offline Sync Queue**, I plan to implement a simplified version that queues failed actions in `localStorage` and retries them when the connection is restored. Is this approach acceptable for your current prototype scope?
- For the **Image Confirmation**, I will use a simulated file input (where users select an image but it just reads the local file URL for demo purposes). Is that acceptable?

---

## Proposed Changes

### State Management (`src/store.js`)
- **[MODIFY]** `store.js`
  - *Financial Transparency:* Add `financialLedger` state (total collected, list of expenditures) and actions (`addCashDonation`, `addExpenditure`).
  - *Inventory Enhancements:* Add `expirationDate` to items in the `initialInventory`.
  - *Multi-tier Approvals:* Add `inventoryReports` state for physical counts. Add actions `submitPhysicalCount` (for Ground Staff/Volunteers) and `approvePhysicalCount` (for Coordinators/Admins). Remove the direct `updateInventoryItem` function.
  - *Cross-Center Sharing:* Add action `transferSurplus` to move items between centers.
  - *Offline Sync:* Add an `actionQueue` state and an `executeSync` function to process queued actions when back online.

---

### Public & Donor Features
- **[NEW]** `src/pages/FinancialLedger.jsx`
  - Create a public-facing page showcasing total cash collected, a progress/usage bar, and a table of itemized expenditures for complete transparency.
- **[MODIFY]** `src/components/Navbar.jsx`
  - Add a navigation link to the new Financial Ledger page.
- **[MODIFY]** `src/pages/QRScanner.jsx`
  - Add a file upload input to capture an image as proof of delivery alongside the QR scan.

---

### Coordinator & Admin Features
- **[MODIFY]** `src/pages/CoordinatorDashboard.jsx`
  - *Inventory Table:* Update to display expiration dates. Color-code dates that are nearing expiration.
  - *Physical Count:* Replace direct inventory editing with a "Submit Physical Count" form.
  - *Cross-Center Sharing:* Add a "Transfer Surplus" modal allowing the coordinator to select another center, category, item, and quantity to transfer.
- **[MODIFY]** `src/pages/AdminDashboard.jsx`
  - Add an "Inventory Reports" section to review and approve/reject physical counts submitted by ground staff/coordinators.
- **[MODIFY]** `src/App.jsx`
  - Register the new `/ledger` route.

---

## Verification Plan

### Manual Verification
1. **Financial Ledger:** Log in as Donor, navigate to the Financial Ledger, and verify that the cash tracking metrics render correctly and clearly.
2. **Multi-tier Inventory:** Log in as a Coordinator, submit a physical count. Verify inventory does *not* update yet. Log in as Admin, approve the report, and verify the inventory updates.
3. **Cross-Center Transfer:** Log in as Coordinator, transfer surplus goods to another center. Check the destination center's inventory to ensure the items arrived.
4. **QR Image Upload:** Go to the Verify Drop-Off page, perform a scan, and verify an image upload prompt is included in the flow.
5. **Offline Sync:** Turn off network connection (or toggle the in-app offline state), perform an action (e.g., pledge), turn it back on, and verify the action syncs.
