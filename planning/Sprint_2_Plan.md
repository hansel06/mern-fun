# Sprint 2 Detailed Plan: Public Pages & Backend Enhancements

**Reference:** `EventSphere_PRD_v1.md`
**Goal:** In this sprint, we will build all the public-facing pages (Landing, Events Feed, Event Detail, Login, and Signup). We will also upgrade the backend event queries to support search, filtering by category, and pagination.

---

## 1. Backend Upgrades (`server/`)

Before the frontend can filter or search events, the backend API must support it.

### 1.1 Update Event Model (`server/src/models/Event.js`)
- **Action:** Add a `category` field to the Mongoose schema.
- **Type:** String.
- **Enum:** `['Music', 'Tech', 'Sports', 'Networking', 'Art', 'Food', 'Other']`.
- **Default:** `'Other'` (so existing events don't break).

### 1.2 Enhance GET Events API (`server/src/controllers/eventController.js`)
- **Action:** Rewrite the `getEvents` function.
- **Features to add:**
  1. **Search:** If a `search` query is provided, use MongoDB regex `$or` to search both `title` and `location`.
  2. **Category Filter:** If a `category` query is provided, filter by it.
  3. **Pagination:** Read `page` and `limit` from queries. Use `.skip((page - 1) * limit).limit(limit)`.
  4. **Sorting:** Sort by `date` ascending (upcoming first).
- **Return format:** Change the response from just returning an array of events to returning an object: `{ events, totalCount, totalPages, currentPage }`.

---

## 2. Frontend: Landing Page (`client/src/pages/LandingPage.tsx`)

*Note: We need to create this new component and map it to the `/` route in `App.tsx` (replacing the current redirect to `/events`).*

### 2.1 Hero Section
- A massive headline with a gradient text effect.
- Two CTA buttons: "Browse Events" (Primary) and "Sign Up" (Secondary).

### 2.2 How It Works Section
- A 3-column grid explaining the app: 1. Create Event -> 2. Invite People -> 3. Track RSVPs.
- Use `lucide-react` icons for visual flair.

### 2.3 Featured Events Section
- Use a `useEffect` to call the new `/api/events?limit=3` endpoint.
- Render 3 `<EventCard />` components (built in Sprint 1).

---

## 3. Frontend: Events Feed (`client/src/pages/Events.tsx`)

This is the main browse page. We will completely redesign the current basic list.

### 3.1 Search & Filter Header
- A search input box using the `<Input />` component we built in Sprint 1.
- A `<select>` dropdown for Categories.
- State: `search`, `category`, `page`.

### 3.2 Dynamic Data Fetching
- Implement a `useEffect` that runs when `search`, `category`, or `page` changes.
- Add a 500ms debounce to the search input so we don't spam the backend while the user is typing.

### 3.3 The Events Grid
- A responsive CSS Grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
- **Loading State:** While fetching, render 6 `<SkeletonCard />` components.
- **Empty State:** If the API returns 0 events, show a friendly "No events found" message.
- **Loaded State:** Map through the returned events and render `<EventCard event={event} />`.

### 3.4 Pagination Controls
- "Previous" and "Next" buttons at the bottom of the grid, using the `totalPages` and `currentPage` returned from the API.

---

## 4. Frontend: Event Detail (`client/src/pages/EventDetail.tsx`)

This page will be split into a beautiful 2-column layout on desktop.

### 4.1 Left Column (Content)
- Massive cover image stretching across the container.
- Large title, date, and location headers.
- The full multi-line description.

### 4.2 Right Column (Sticky RSVP Card)
- A sticky card that stays on the screen as you scroll down the description.
- **Auth Logic:**
  - If NOT logged in: Show "Login to RSVP" button.
  - If logged in & NOT attending: Show Green "RSVP Now" button.
  - If logged in & attending: Show Red "Cancel RSVP" button.
  - If Event is full: Disable button and show "Event Full".
  - If User is the Creator: Hide RSVP buttons, show "Edit" and "Delete" buttons instead.

---

## 5. Frontend: Auth Pages (`Login.tsx` & `Signup.tsx`)

We will replace the current basic forms with polished, centered, glassmorphic cards.

- **Action:** Wrap the forms in a beautifully centered CSS flexbox container with a gradient background.
- **Action:** Replace native `<button>` and `<input>` with the reusable UI components we built in Sprint 1.
- **Action:** Ensure any backend login/signup errors are displayed cleanly below the inputs using the `error` prop on the `<Input />` component.

---

## Verification Plan
1. Test MongoDB search queries by typing in the search bar.
2. Ensure pagination buttons correctly load the next set of events.
3. Test all RSVP states on the Event Detail page (Creator view, Attendee view, Logged out view).
