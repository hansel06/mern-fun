# Sprint 3 Detailed Plan: Protected Pages & Dashboard

**Reference:** `EventSphere_PRD_v1.md`
**Goal:** In this sprint, we will build all pages that require authentication (Dashboard, Profile, Create Event, Edit Event). We will also build the necessary backend API routes to support user-specific data fetching and account modifications.

---

## 1. Backend Upgrades (`server/`)

We need several new endpoints under a new `userRoutes.js` and `userController.js` to handle fetching a user's specific events and updating their profile.

### 1.1 Create `userController.js` and `userRoutes.js`
- **GET `/api/users/my-events`**:
  - Purpose: Fetch all events created by the logged-in user.
  - Logic: `Event.find({ createdBy: req.user.id }).sort({ date: 1 })`.
- **GET `/api/users/my-rsvps`**:
  - Purpose: Fetch all events the logged-in user has RSVPed to.
  - Logic: `Event.find({ attendees: req.user.id }).sort({ date: 1 })`.
- **PUT `/api/users/profile`**:
  - Purpose: Update the user's display name.
  - Logic: `User.findByIdAndUpdate(req.user.id, { name }, { new: true })`.
- **PUT `/api/users/password`**:
  - Purpose: Change password.
  - Logic: Verify `currentPassword` using bcrypt, then hash and save `newPassword`.

### 1.2 Update `server.js`
- Wire up the new `userRoutes` to the `/api/users` endpoint.

---

## 2. Frontend: Create & Edit Event (`client/src/pages/`)

### 2.1 `CreateEvent.tsx`
- **Layout:** A polished, single-column form centered on the page.
- **Fields:** Title, Category (select), Description, Date/Time, Location, Capacity, Image Upload.
- **Image Upload:** Create a visually distinct drag-and-drop zone.
- **AI Description Feature:** 
  - A button that calls `POST /api/events/generate-description`.
  - Requires Title and Location to be filled out.
  - Populates the Description field upon success.

### 2.2 `EditEvent.tsx`
- Identical layout to Create Event, but fetches the existing event data on mount and pre-populates the fields.
- Allows image replacement.
- Adds a **Delete Event** danger button at the bottom of the form (requires a confirmation step).

---

## 3. Frontend: User Dashboard (`client/src/pages/Dashboard.tsx`)

This is the central hub for logged-in users.

### 3.1 Dashboard Layout
- **Header:** "Welcome back, [Name]" with high-level stats (Total Hosted, Total RSVPs).
- **Tabs:** Two distinct tabs for "Hosting" and "Attending".

### 3.2 "Hosting" Tab
- Fetches data from `GET /api/users/my-events`.
- Renders events in a compact grid.
- Each card has quick-action buttons: **Edit** and **Delete**.
- **Empty State:** Clean illustration/message prompting them to create an event.

### 3.3 "Attending" Tab
- Fetches data from `GET /api/users/my-rsvps`.
- Renders events in a compact grid.
- Each card has a quick-action button: **Cancel RSVP**.
- **Empty State:** Clean illustration/message prompting them to browse events.

---

## 4. Frontend: Profile Settings (`client/src/pages/Profile.tsx`)

A dedicated page for account management.

### 4.1 Account Information
- Displays user's initials avatar, name, and email (email is read-only).
- **Edit Name Form:** Text input to update their display name.

### 4.2 Security Settings
- **Change Password Form:** Requires current password, new password, and confirm new password.
- Inline validation to ensure new passwords match before submission.

---

## Verification Plan
1. **Backend Routing:** Test the new `/api/users/*` endpoints using the frontend dashboard.
2. **Dashboard Logic:** Ensure events created by the user strictly appear in the "Hosting" tab, and RSVP'd events strictly appear in the "Attending" tab.
3. **Form Submissions:** Test creating an event with AI generation, editing it, and deleting it from the dashboard. Test password change functionality.
