# Sprint 1 Detailed Plan: Foundation & Design System

**Reference:** `EventSphere_PRD_v1.md`
**Goal:** Establish the design system, configure Tailwind CSS, and build all foundational, reusable UI components. By the end of this sprint, no complex pages will be built, but all the Lego blocks required to build them will be ready.

---

## 1. Tooling & Configuration Setup

### 1.1 Install Dependencies
- Navigate to the `client` directory.
- Install Tailwind CSS and its peers: `npm install -D tailwindcss postcss autoprefixer`
- Initialize Tailwind: `npx tailwindcss init -p`
- Install Toast notifications: `npm install react-hot-toast`
- Install SVG Icons: `npm install lucide-react`

### 1.2 Configure Tailwind Theme (`client/tailwind.config.js`)
We will map the PRD's exact design system to Tailwind's theme variables.
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2E6DAD',
        accent: '#4ECDC4',
        success: '#2ECC71',
        danger: '#E74C3C',
        warning: '#F39C12',
        surface: '#F8F9FA',
        'surface-elevated': '#FFFFFF',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6C757D',
        border: '#DEE2E6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Tailwind already uses an 8px base (e.g., p-2 = 8px, p-4 = 16px)
      }
    },
  },
  plugins: [],
}
```

### 1.3 Global CSS Cleanup (`client/src/index.css`)
- Remove all existing custom CSS that clashes with the new design system.
- Add Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-surface text-text-primary font-sans antialiased;
}
```

### 1.4 Global Toast Setup (`client/src/App.tsx`)
- Import `Toaster` from `react-hot-toast`.
- Place `<Toaster position="top-right" toastOptions={{ duration: 4000 }} />` immediately inside the main wrapper so it is globally available.

---

## 2. Building Reusable UI Components (`client/src/components/ui/`)

These components will be fully typed using TypeScript and will serve as the building blocks for all forms and cards.

### 2.1 `Button.tsx`
**Props:** `variant` (primary, secondary, danger), `isLoading` (boolean), `className`, and standard button props.
**Styling Rules:**
- Border-radius: 8px (`rounded-lg`)
- Padding: 12px 24px (`px-6 py-3`)
- Hover/Active states matching PRD specifications.
- If `isLoading` is true, disable the button and show a spinning SVG inside it.

### 2.2 `Input.tsx` & `Textarea.tsx`
**Props:** `label` (string), `error` (string), and standard input props.
**Styling Rules:**
- Border: `border-border`, rounded 8px.
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/15`.
- Error state: If `error` prop exists, turn border red (`border-danger`) and render the error string below the input in red text.

### 2.3 `SkeletonCard.tsx`
**Purpose:** Replaces the white "loading" screen with a shimmering placeholder.
**Implementation:**
- A `div` with `animate-pulse bg-gray-200 rounded-xl`.
- It will mimic the shape of the `EventCard` (a big rectangle for the image, a few thin rectangles for the text).

### 2.4 `Modal.tsx`
**Purpose:** A reusable dialog box (used later for confirming event deletion).
**Implementation:**
- Fixed full-screen backdrop with `bg-black/50`.
- Centered white card (`bg-surface-elevated`) with `z-50`.
- Props: `isOpen`, `onClose`, `title`, `children`.

---

## 3. Upgrading Global Layout Components

### 3.1 `Navbar.tsx`
- Refactor the current Navbar to use Tailwind.
- Background: `bg-primary` or white with `border-b`.
- Responsive: Ensure it collapses into a hamburger menu on mobile (`md:hidden`).
- Auth Logic: Maintain the `AuthContext` check to render the "Dashboard" and "Logout" buttons for logged-in users, and "Login/Signup" for guests.

### 3.2 `Footer.tsx`
- Simple redesign with Tailwind.
- Background: `bg-surface-elevated`.
- Text: `text-text-secondary`.
- Add author name and GitHub links as per PRD.

### 3.3 `ProtectedRoute.tsx`
- Verify it checks `AuthContext` correctly.
- Ensure it redirects to `/login` if no valid token exists.

### 3.4 `EventCard.tsx`
This is a complex component that will be used heavily in Sprints 2 and 3.
**Structure:**
- Wrapper: `bg-surface-elevated rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-border`.
- Image: `aspect-video object-cover w-full rounded-t-xl`.
- Content: Padding `p-4`.
- **Props required later:** `event` object, `compact` (boolean) for the dashboard view.

---

## 4. Verification & QA for Sprint 1

Before moving to Sprint 2, the following must be confirmed:
1. `npm run dev` starts successfully with Tailwind compiling.
2. No TypeScript errors exist in the new `ui/` components.
3. The Navbar and Footer render beautifully using the new color tokens.
4. We can temporarily drop a `<Button>`, `<Input>`, and `<SkeletonCard>` into `App.tsx` just to visually verify they match the design system, then remove them.

**Next Step after approval:** Execute all tasks above.
