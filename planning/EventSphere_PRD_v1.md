# EventSphere — Product Requirements Document

**Version:** 1.0 — Initial PRD
**Author:** Hansel Thomas Dsouza
**Status:** Active Development

---

## Document Overview

| Field | Detail |
|---|---|
| **Project** | EventSphere — Full-Stack Event Management Platform |
| **Author** | Hansel Thomas Dsouza |
| **Version** | 1.0 — Initial PRD |
| **Scope** | Frontend upgrade + new pages + UI/UX polish + feature additions |
| **Target** | Internship-ready production deployment |
| **Tech Stack** | React 18 + TypeScript, Node.js, Express.js, MongoDB Atlas, Cloudinary, Gemini AI |
| **Frontend** | https://hansel-event-platform.vercel.app |
| **Backend** | https://mern-fun-backend.onrender.com |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Goals & Success Criteria](#3-goals--success-criteria)
4. [Pages & Routes — Full Specification](#4-pages--routes--full-specification)
   - 4.1 [Landing Page](#41---landing-page-public)
   - 4.2 [Events Feed](#42-events--events-feed-public)
   - 4.3 [Event Detail](#43-eventsid--event-detail-public)
   - 4.4 [Create Event](#44-eventscreate--create-event-protected)
   - 4.5 [Edit Event](#45-eventsidedit--edit-event-protected--creator-only)
   - 4.6 [Dashboard](#46-dashboard--user-dashboard-protected)
   - 4.7 [Profile](#47-profile--profile--settings-protected)
5. [Design System](#5-design-system)
6. [Navigation & Routing](#6-navigation--routing)
7. [Backend Additions Required](#7-backend-additions-required)
8. [Implementation Plan](#8-implementation-plan)
9. [Frontend State Management](#9-frontend-state-management)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Quick Reference Checklist](#12-quick-reference-checklist)

---

## 1. Executive Summary

EventSphere is a full-stack MERN event management platform currently deployed to production. The backend is architecturally solid — featuring JWT authentication, atomic MongoDB RSVP concurrency control, Cloudinary image hosting, and Gemini AI description generation. However, the frontend currently presents as a single-page interface and lacks the visual depth and multi-page structure expected of a production product.

This PRD defines all work required to elevate EventSphere from a functional prototype into a polished, internship-grade product. The plan covers seven new/redesigned pages, a consistent design system, UX improvements, and backend enhancements — all scoped to be achievable within a focused development sprint.

---

## 2. Current State Analysis

### 2.1 What Already Works

The following backend features are complete and production-tested:

- JWT-based authentication — signup, login, token middleware
- Full Event CRUD — create, read, update, delete with ownership checks
- Atomic RSVP system — race-condition-safe using MongoDB `findOneAndUpdate` with `$expr`
- Image upload — Cloudinary integration via Multer middleware
- AI description generation — Google Gemini API integration
- Protected routes — JWT middleware on all write operations
- Production deployment — Render (backend) + Vercel (frontend) + MongoDB Atlas

### 2.2 Current Gaps

| Area | Current State | Required State |
|---|---|---|
| Frontend pages | Effectively 1 page | 7 distinct pages with routing |
| Landing page | None | Hero, features, CTA, social proof |
| User dashboard | None | Hosting tab + Attending tab |
| Profile page | None | Account settings, password change |
| Search / filter | None | Search bar + category + date filters |
| Visual design | Basic / inconsistent | Polished design system, consistent UI |
| Empty states | None | Illustrated empty states for all lists |
| Loading states | None | Skeleton loaders on all data fetches |
| Toast notifications | None | Success/error feedback on all actions |
| Pagination | None | Paginated events feed |
| Past event handling | Partial | Visual badges + RSVP lock on past events |

---

## 3. Goals & Success Criteria

### 3.1 Primary Goals

1. Ship a visually polished multi-page React application that demonstrates product thinking, not just technical ability.
2. Implement all 7 planned pages with consistent layout, navigation, and state management.
3. Add search, filtering, and pagination to the events feed so it scales.
4. Build a user dashboard that gives logged-in users clear ownership of their events and RSVPs.
5. Establish a design system (colors, typography, spacing) applied consistently across all pages.

### 3.2 Success Criteria

| Criteria | Measurement |
|---|---|
| All 7 pages built and routed | Navigate to every route without 404 |
| Auth flow complete | Signup → Login → Protected page → Logout works end-to-end |
| Dashboard functional | User sees only their events under Hosting; only their RSVPs under Attending |
| Search works | Searching by title or location returns correct filtered results |
| No blank loading states | Every async data fetch shows a skeleton loader |
| Mobile responsive | All pages usable on 375px viewport without horizontal scroll |
| Toast notifications | Every RSVP, create, delete, login action shows feedback toast |

---

## 4. Pages & Routes — Full Specification

### 4.1 `/` — Landing Page (Public)

**Purpose:** First impression of the product. Convert visitors into signups. This is the most important page visually — it sets the tone for the entire application.

#### Sections

| Section | Content | Priority |
|---|---|---|
| Navbar | Logo left · Events, Login, Sign Up links right · Collapses to hamburger on mobile | Must-Have |
| Hero | Bold headline, 1-line subheading, two CTAs (Browse Events / Sign Up). Background: subtle gradient or abstract pattern | Must-Have |
| How it works | 3-step row: Create Event → Invite People → RSVP. Icon + title + description per step | Must-Have |
| Featured events | 3 event cards pulled from the real API (most recent upcoming events) | Must-Have |
| AI description callout | Highlight the Gemini AI feature with a visual showing auto-generated text | Nice-to-Have |
| Footer | Copyright, author name, GitHub link, tech stack badges | Must-Have |

#### Acceptance Criteria

- Hero CTA "Browse Events" navigates to `/events`
- Hero CTA "Get Started" navigates to `/signup`
- Featured events section fetches from `GET /api/events` (limit 3, sort by date)
- Navbar Sign Up / Login buttons visible when logged out; replaced by avatar/dashboard when logged in
- Full mobile responsive

---

### 4.2 `/events` — Events Feed (Public)

**Purpose:** Central browsing hub. All users (logged in or not) can browse and search events. This page must feel fast and scannable.

#### Layout

- Top: search bar (full-width on mobile, 60% on desktop) + filter row below it
- Filter row: Category dropdown, Date picker (from/to), Sort (Newest / Upcoming / Most RSVPs)
- Results: responsive grid — 1 col mobile, 2 col tablet, 3 col desktop
- Bottom: pagination controls (previous / page numbers / next)

#### Event Card Component

- Event image (cover, aspect ratio 16:9, object-fit cover)
- Category badge (top-left corner, color-coded by category)
- Title (2-line clamp with ellipsis)
- Date + location row with icons
- Attendees count / capacity bar (visual progress bar: x/y spots filled)
- Past event: grey overlay + "Event Ended" badge
- Full card clickable → navigates to `/events/:id`

#### Search & Filter — Technical Approach

- Frontend: controlled state for `searchQuery`, `category`, `dateFrom`, `dateTo`, `sortBy`, `page`
- On filter change: debounce 300ms then re-fetch from API with query params
- Backend: update `GET /api/events` to accept `?search=&category=&page=&limit=10`
- MongoDB: use regex for text search on title + location; add index on date field
- Pagination: return `{ events, totalCount, currentPage, totalPages }` from API

#### Empty & Loading States

- Loading: show 6 skeleton cards (grey pulsing rectangles matching card dimensions)
- No results: illustration + "No events found" + clear filters button
- Error: error message + retry button

---

### 4.3 `/events/:id` — Event Detail (Public)

**Purpose:** Full detail view of a single event. Primary conversion point for RSVPs. The atomic RSVP system on the backend is a key technical story — the UI must surface capacity clearly.

#### Layout — Two Column (Desktop)

- Left column (65%): hero image, title, description, date/time, location
- Right column (35%): RSVP card (sticky on scroll) with capacity, attendee list preview, action button
- Mobile: stacks to single column, RSVP card moves above description

#### RSVP Card States

| State | UI |
|---|---|
| Logged out | RSVP button → redirects to `/login` with `returnUrl` param |
| Logged in, spot available | Green RSVP button showing spots remaining |
| Logged in, already RSVPed | Red Cancel RSVP button |
| Event full | Disabled button — "Event Full" + visual capacity bar at 100% |
| Past event | Disabled button — "Event Ended" with grey styling |
| User is creator | No RSVP button — show Edit Event and Delete Event buttons instead |

#### Acceptance Criteria

- RSVP and Cancel actions call correct API endpoints and update UI immediately without page reload
- Capacity bar updates after RSVP action
- Delete event shows confirmation dialog before calling `DELETE /api/events/:id`
- After delete, redirect to `/events` with success toast
- Edit button navigates to `/events/:id/edit`

---

### 4.4 `/events/create` — Create Event (Protected)

**Purpose:** Form for creating a new event. The AI description generation is a standout feature that must be prominently surfaced here.

#### Form Fields

| Field | Type | Validation |
|---|---|---|
| Event title | Text input | Required, 3–100 chars |
| Category | Select dropdown | Required — Music, Tech, Sports, Networking, Art, Food, Other |
| Description | Textarea (min 4 rows) | Required, 20–2000 chars |
| Date & time | DateTime picker | Required, must be in the future |
| Location | Text input | Required |
| Capacity | Number input | Required, min 1, max 10000 |
| Event image | File upload with drag-and-drop | Required, image only, max 5MB, preview on select |

#### AI Description Feature

- Button: "Generate with AI" placed below the description textarea
- Requires: title and location to be filled before enabling the button
- On click: show loading spinner inside button, disable form inputs
- On success: populate textarea with generated description, show toast "Description generated!"
- On error: show toast "AI generation failed, please try manually"
- User can edit the generated description freely after it populates

#### Image Upload UX

- Drag-and-drop zone with dashed border + upload icon + hint text
- On file select: show preview image inside the zone
- Show file name and size below preview
- Client-side validation: reject non-image files and files > 5MB with inline error message

---

### 4.5 `/events/:id/edit` — Edit Event (Protected + Creator Only)

**Purpose:** Allow event creators to modify their events. Pre-populates all fields with existing data.

#### Behaviour

- On mount: fetch event by ID, populate all form fields with existing values
- Image field: show existing image as preview; user can replace by selecting a new file
- If logged-in user is not the event creator: redirect to `/events/:id` with error toast
- Submit: calls `PUT /api/events/:id` with changed fields only
- On success: redirect to `/events/:id` with "Event updated!" toast
- Danger zone: Delete event button at bottom of form, styled in red, requires confirmation modal

---

### 4.6 `/dashboard` — User Dashboard (Protected)

**Purpose:** Personal hub for the logged-in user. Shows their created events and their RSVPs in two tabs. This is a critical page for making the app feel complete.

#### Layout

- Top: greeting with user name ("Welcome back, Hansel") + quick stats strip
- Stats strip: Total events hosted | Total RSVPs | Upcoming events
- Tab bar: Hosting / Attending (active tab underlined, highlighted)
- Content area below tabs: scrollable list of event cards (compact variant)

#### Hosting Tab

- Fetch: `GET /api/users/my-events` (filter events where `createdBy === currentUser._id`)
- Card shows: title, date, attendees count / capacity, Edit button, Delete button
- Empty state: "You haven't created any events yet" + Create Event button
- Upcoming vs past events separated by a section divider

#### Attending Tab

- Fetch: `GET /api/users/my-rsvps` (filter events where `attendees` includes `currentUser._id`)
- Card shows: title, date, location, Cancel RSVP button
- Empty state: "You haven't RSVPed to any events yet" + Browse Events button
- Past attended events shown in a greyed-out section below active ones

#### New Backend Routes Required

- `GET /api/users/my-events` — returns events where `createdBy: req.user.id`
- `GET /api/users/my-rsvps` — returns events where `attendees: { $in: [req.user.id] }`
- Both routes are protected (require JWT middleware)

---

### 4.7 `/profile` — Profile & Settings (Protected)

**Purpose:** Account management. Allows users to update their name and password. Simple but necessary for the app to feel complete.

#### Sections

- Account info card: avatar (initials-based), display name, email (read-only)
- Edit name form: text input with Save button
- Change password form: current password, new password, confirm new password
- Danger zone: Delete account button (red, requires typing "DELETE" to confirm)

#### New Backend Routes Required

- `PUT /api/users/profile` — update name (protected)
- `PUT /api/users/password` — change password, requires current password verification (protected)

#### Acceptance Criteria

- Name update reflects immediately in navbar without page reload
- Password change: if current password is wrong, show "Incorrect current password" inline error
- All success/error states shown as toasts

---

## 5. Design System

A consistent design system is what separates a project from a product. All components must adhere to this system without exception.

### 5.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary | `#1E3A5F` | Primary buttons, headings, navbar background |
| Primary Light | `#2E6DAD` | Hover states, links, active tabs |
| Accent | `#4ECDC4` | CTAs, highlights, capacity bar fill |
| Success | `#2ECC71` | RSVP button, success toasts |
| Danger | `#E74C3C` | Cancel RSVP, delete, error states |
| Warning | `#F39C12` | Past event badge, near-capacity indicator |
| Surface | `#F8F9FA` | Page backgrounds |
| Surface Elevated | `#FFFFFF` | Cards, modals, dropdowns |
| Text Primary | `#1A1A2E` | Headings, body text |
| Text Secondary | `#6C757D` | Captions, subtitles, meta info |
| Border | `#DEE2E6` | Card borders, dividers, input borders |

### 5.2 Typography

| Element | Size | Weight |
|---|---|---|
| Page heading (H1) | 2.5rem / 40px | 700 |
| Section heading (H2) | 1.75rem / 28px | 600 |
| Card title (H3) | 1.25rem / 20px | 600 |
| Body text | 1rem / 16px | 400 |
| Caption / meta | 0.875rem / 14px | 400 |
| Button label | 0.9rem / 14px | 500 |
| Badge / tag | 0.75rem / 12px | 600 |

Font family: Inter or system-ui fallback stack.

### 5.3 Spacing Scale

Use an 8px base grid. All margins, paddings, and gaps must be multiples of 8:
`4 · 8 · 16 · 24 · 32 · 48 · 64 · 96px`

### 5.4 Component Specs

#### Buttons

- **Primary:** filled background (Primary color), white text, border-radius 8px, padding 12px 24px
- **Secondary:** outlined, Primary color border and text, transparent background
- **Danger:** filled background (Danger color), white text
- All buttons: hover state darkens 10%, active state darkens 20%, disabled state 50% opacity
- Loading state: replace label with spinner, disable pointer events

#### Cards

- Border-radius: 12px
- Box-shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Hover: shadow lifts to `0 4px 16px rgba(0,0,0,0.12)`, `translateY(-2px)` transition
- Border: `1px solid var(--border)`

#### Form Inputs

- Border: `1px solid var(--border)`, border-radius 8px, padding 12px 16px
- Focus: border color changes to Primary, `box-shadow: 0 0 0 3px rgba(30,58,95,0.15)`
- Error state: border color Danger, red helper text below input
- Labels: always visible above input (never placeholder-only labels)

#### Toast Notifications

- Library: `react-hot-toast` or equivalent
- Position: top-right
- Auto-dismiss: 4 seconds
- Types: success (green), error (red), info (blue), loading (spinner)
- All API actions (RSVP, create, edit, delete, login, logout) must trigger a toast

#### Skeleton Loaders

- Use for every page that fetches remote data
- Match the rough dimensions of the content they replace
- Animate with a shimmer (CSS animation sweeping left-to-right)
- Never show a blank white page — skeleton appears immediately while fetching

---

## 6. Navigation & Routing

### 6.1 Route Table

| Route | Component | Auth Required | Notes |
|---|---|---|---|
| `/` | LandingPage | No | Public entry point |
| `/events` | EventsFeed | No | Public browse |
| `/events/:id` | EventDetail | No | Public view |
| `/events/create` | CreateEvent | Yes | Redirect to `/login` if no token |
| `/events/:id/edit` | EditEvent | Yes | Also checks creator ownership |
| `/dashboard` | Dashboard | Yes | Redirect to `/login` if no token |
| `/profile` | Profile | Yes | Redirect to `/login` if no token |
| `/login` | LoginPage | No | Redirect to `/dashboard` if already logged in |
| `/signup` | SignupPage | No | Redirect to `/dashboard` if already logged in |

### 6.2 Navbar States

| State | Items |
|---|---|
| Logged out | Logo · Events · Login · Sign Up (filled button) |
| Logged in | Logo · Events · Dashboard · [Avatar dropdown: Profile / Logout] |

### 6.3 Protected Route Implementation

- Create a `ProtectedRoute` wrapper component
- Check for valid token in `AuthContext` (or localStorage fallback)
- If no token: redirect to `/login?returnUrl=/intended-path`
- After login: redirect back to the `returnUrl`
- If token is expired (API returns 401): clear token, redirect to `/login` with "Session expired" toast

---

## 7. Backend Additions Required

The existing backend is solid. The following additions are needed to support new frontend pages.

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `GET /api/events` | GET | No | Add: `?search`, `?category`, `?page`, `?limit`, `?sort` query params |
| `GET /api/users/my-events` | GET | Yes | New: return events created by `req.user.id` |
| `GET /api/users/my-rsvps` | GET | Yes | New: return events where `attendees` includes `req.user.id` |
| `PUT /api/users/profile` | PUT | Yes | New: update user display name |
| `PUT /api/users/password` | PUT | Yes | New: change password with current password verification |
| `DELETE /api/users/account` | DELETE | Yes | New: delete user account and their events |

### 7.1 Events Query Enhancement

The existing `GET /api/events` endpoint must be enhanced:

- Add text search: regex on `title` and `location` fields if `search` param present
- Add category filter: exact match on `category` field if provided
- Add pagination: `skip = (page-1) * limit`, apply `limit`
- Add sorting: date ascending (upcoming), date descending (newest), attendee count
- Return envelope: `{ events, totalCount, totalPages, currentPage }`
- Add MongoDB indexes on: `{ date: 1 }`, `{ category: 1 }`, `{ title: 'text', location: 'text' }`

### 7.2 Category Field

Add a `category` field to the Event model:

- Type: `String`, required
- Enum: `['Music', 'Tech', 'Sports', 'Networking', 'Art', 'Food', 'Other']`
- Default: `'Other'` for backwards compatibility with existing events

---

## 8. Implementation Plan

Work is organized into 4 sprints. Each sprint delivers a shippable increment. Complete sprints in order — later sprints depend on earlier ones.

---

### Sprint 1 — Foundation & Design System

**Goal:** Establish the design system and global components so every page built in later sprints looks consistent from day one.

| Task | Effort | Notes |
|---|---|---|
| Install & configure Tailwind CSS | 2h | Set up theme config with color tokens |
| Install react-hot-toast | 30min | Wire into App.tsx root |
| Verify react-router-dom v6 routing | 30min | Confirm existing routing works |
| Build Navbar component — logged out + logged in states | 3h | Use AuthContext for conditional rendering |
| Build Footer component | 1h | Copyright, links |
| Build ProtectedRoute wrapper | 1h | Redirects to /login with returnUrl |
| Build Button component — Primary, Secondary, Danger, Loading | 2h | Reusable, typed props |
| Build Input + Textarea components with error state | 2h | Used in all forms |
| Build EventCard component (full + compact variants) | 3h | Full for feed, compact for dashboard |
| Build SkeletonCard component | 1h | Used when loading events |
| Build Modal/Dialog component | 2h | Used for delete confirmations |
| Set up global CSS variables from design system | 1h | Map to Tailwind theme |

**Sprint 1 Total Estimate: ~18 hours**

---

### Sprint 2 — Public Pages

**Goal:** Build all public-facing pages. These require no new backend work except the events query enhancement.

| Task | Effort | Notes |
|---|---|---|
| Enhance GET /api/events with search + category + pagination | 3h | Backend — do this first |
| Add category field to Event model | 1h | With default for existing docs |
| Build Landing page — Navbar + Hero section | 3h | CTA buttons, responsive layout |
| Build Landing page — How it works section | 2h | 3-step icon row |
| Build Landing page — Featured events (live API data) | 2h | Fetch 3 most recent upcoming events |
| Build Landing page — Footer | 1h | |
| Build Events Feed — layout + search bar + filter row | 4h | Controlled state, debounced fetch |
| Build Events Feed — results grid + pagination controls | 3h | Responsive grid, prev/next |
| Build Events Feed — skeleton loaders + empty state | 2h | |
| Build Event Detail — two column layout | 3h | Hero image, description, location |
| Build Event Detail — RSVP card with all state variants | 3h | See state table in section 4.3 |
| Build Login + Signup pages (redesign) | 3h | Polished form, validation, redirect |

**Sprint 2 Total Estimate: ~30 hours**

---

### Sprint 3 — Protected Pages

**Goal:** Build all pages that require authentication. Requires new backend routes for dashboard.

| Task | Effort | Notes |
|---|---|---|
| Add GET /api/users/my-events route | 1h | Backend |
| Add GET /api/users/my-rsvps route | 1h | Backend |
| Add PUT /api/users/profile route | 1h | Backend |
| Add PUT /api/users/password route | 2h | Backend — bcrypt compare + hash |
| Build Create Event — form layout | 3h | All fields, validation, image preview |
| Build Create Event — AI description button | 2h | Loading state, error handling |
| Build Create Event — drag-and-drop image upload | 3h | Preview, validation |
| Build Edit Event — pre-populate form | 3h | Fetch on mount, same form as create |
| Build Dashboard — layout + stat strip | 2h | |
| Build Dashboard — Hosting tab | 3h | Fetch my-events, compact cards, empty state |
| Build Dashboard — Attending tab | 3h | Fetch my-rsvps, cancel RSVP inline |
| Build Profile — account info + edit name | 2h | |
| Build Profile — change password form | 2h | |

**Sprint 3 Total Estimate: ~28 hours**

---

### Sprint 4 — Polish & QA

**Goal:** No new features. This sprint is entirely for quality — fixing edge cases, mobile responsiveness, and final polish.

| Task | Effort | Notes |
|---|---|---|
| Mobile responsiveness audit — all 7 pages at 375px | 3h | Fix any layout breaks |
| Add page transitions (framer-motion fade-in) | 2h | Apply to all page-level components |
| Add loading states to all buttons during async ops | 2h | Spinner replaces label |
| Toast notifications audit — verify all actions have toast | 1h | Checklist against success criteria |
| Empty states audit — all list pages have illustrated empty states | 2h | |
| Error boundary — add React error boundary at router level | 1h | Friendly fallback UI on crash |
| 404 page — not found route | 1h | Friendly message + back to home link |
| Cross-browser test (Chrome, Firefox, Safari) | 2h | Fix any compatibility issues |
| Lighthouse audit — fix performance/accessibility issues | 2h | Target: 90+ on all metrics |
| Final README update — screenshots, live URL, tech stack | 1h | |

**Sprint 4 Total Estimate: ~17 hours**

---

## 9. Frontend State Management

### 9.1 Existing

- `AuthContext` — manages user token and user object across the app. Already implemented.

### 9.2 New State Requirements

| State | Location | Approach |
|---|---|---|
| Event list + filters + pagination | EventsFeed component | Local useState + useEffect fetch |
| Single event detail | EventDetail component | Local useState + fetch on mount |
| Dashboard events | Dashboard component | Local useState per tab |
| Form state (create/edit) | Form components | Local useState per field + validation |
| Toast state | Global (App.tsx) | react-hot-toast handles internally |

> **Note:** React Context API is sufficient for this app's scale. Redux or Zustand are not needed. If the app grows beyond 15+ components sharing state, consider migrating to Zustand + React Query for server state caching.

---

## 10. Non-Functional Requirements

| Requirement | Target | Notes |
|---|---|---|
| Mobile responsiveness | All pages usable at 375px+ | No horizontal scroll on any page |
| Page load time | < 3s on 3G | Vercel CDN + code splitting help significantly |
| Accessibility | WCAG AA basics | Alt text on all images, label on all inputs, keyboard nav on forms |
| TypeScript coverage | All new components typed | No `any` types — use proper interfaces |
| Error handling | All API calls wrapped in try/catch | User sees toast, never a white crash screen |
| Token expiry | Graceful handling | 401 response → clear token → redirect to login with message |
| API loading UX | No blank states | Skeleton on initial load, spinner on actions |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Render free tier cold starts (backend) | High | Medium | Add "API loading..." state; Render spins down after 15min inactivity |
| Time overrun on polish sprint | Medium | Low | Sprint 4 is all optional improvements — ship sprints 1–3 first |
| MongoDB Atlas free tier limits | Low | Medium | M0 tier is sufficient for demo scale; add indexes to prevent slow queries |
| Gemini AI API quota | Low | Low | Rate limit the generate button to once per 10 seconds in the UI |
| Image upload size on Cloudinary free tier | Low | Low | Client-side validation already enforces 5MB limit |

---

## 12. Quick Reference Checklist

Use this checklist to track completion. Check off each item as it is completed and verified.

### Pages

- [ ] Landing page complete and deployed
- [ ] Events feed with search + filter + pagination
- [ ] Event detail with all RSVP states
- [ ] Create event with AI description + image upload
- [ ] Edit event with pre-populated form
- [ ] Dashboard with Hosting + Attending tabs
- [ ] Profile with name edit + password change
- [ ] Login page (redesigned)
- [ ] Signup page (redesigned)
- [ ] 404 page

### Components

- [ ] Navbar — logged out + logged in states
- [ ] Footer
- [ ] ProtectedRoute wrapper
- [ ] EventCard — full variant
- [ ] EventCard — compact variant (dashboard)
- [ ] SkeletonCard loader
- [ ] Button — all variants + loading state
- [ ] Input + Textarea with error state
- [ ] Modal / confirmation dialog
- [ ] Toast notifications wired globally

### Backend

- [ ] `GET /api/events` — enhanced with search, category, pagination
- [ ] Category field added to Event model
- [ ] `GET /api/users/my-events`
- [ ] `GET /api/users/my-rsvps`
- [ ] `PUT /api/users/profile`
- [ ] `PUT /api/users/password`

### Quality

- [ ] Mobile responsive at 375px — all pages
- [ ] All async actions show toast notification
- [ ] All loading states show skeleton or spinner
- [ ] TypeScript — no `any` types in new code
- [ ] Error boundary at router level
- [ ] README updated with screenshots

---

*EventSphere PRD v1.0 — Hansel Thomas Dsouza*
