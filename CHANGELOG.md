# 📦 Changelog

## [2.0.0] – 2025‑08‑03  
### 🌩 **Chrona UI 2.0 – Nimbus**  
_“Fast. Installable. Notified.”_

---

### 🚀 Highlights

- **Multi-Timer Support**  
  Manage multiple countdown timers at once in a sleek, swipeable carousel interface.  
  Easily add, rename, or delete timers with just a few clicks.

- **Installable Web App (PWA)**  
  Chrona can now be installed on desktop and mobile devices for a native-like experience.  
  Works offline and loads instantly after first use.

- **Push Notifications**  
  Stay updated even when Chrona is closed — get real-time alerts when your timers complete.

- **New Design Touches**  
  Refined UI, better animations, new icons, and full support for modern browser capabilities.

- **Smarter Deployments**  
  Moved to Cloudflare Pages for faster, more reliable frontend deployment.

---

## \[1.0.0] – 2025-05-12

### 🚀 Added

* **Authentication System**

    * Sign In and Sign Up forms with form validation using `react-hook-form` + `zod`
    * OAuth login support (Google, Facebook, LinkedIn) with popup-based flow
    * Global auth context with automatic token refresh (`useAuth` + `AuthProvider`)
* **Countdown Timer v2 Integration**

    * Supports `start`, `pause`, `resume`, `reset`, and `complete` operations
    * Full sync with backend timer model: `status`, `startAt`, `pausedAt`, etc.
* **UI Components**

    * Responsive **Navbar** with conditional rendering (auth-aware)
    * Auth modals, OAuth buttons, and dropdown menu for authenticated users
    * Polished forms, animations, and accessibility support

### 🛠️ Changed

* Updated `vite.config.ts` to inject runtime `BACKEND_APP_URL` using global constant
* Removed hardcoded `.env.production` reference to backend URL
* Replaced deprecated timer API logic with new `v2/countdown` endpoints
* Enhanced display logic for accurate timer states

### 🔧 CI/CD & DevOps

* Updated GitHub Actions workflows:

    * Inject secrets from Azure Key Vault
    * Deploy preview environments using **Azure Web Apps** with fallback logic
    * Set `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL` in **Key Vault**
    * Sync backend Container App environment on PR deploy/cleanup
* Local HTTPS support via `vite-plugin-mkcert`

---

**Full release notes** → [RELEASE\_NOTES.md](./RELEASE_NOTES.md)

---
