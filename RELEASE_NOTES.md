# 🕒 Chrona Frontend — v2.0.0 "Nimbus"

📅 **Release Date:** 2025‑08‑03
🏷️ **Version:** 2.0.0
🔗 **Full changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## 🌩️ Highlights

* 🎠 **Multi-Timer Support**
  A brand-new multi-timer experience lets users add, rename, and manage multiple timers through a swipeable carousel interface.
  Each timer functions independently and can be edited in place — no navigation needed.

* 📱 **Installable as a PWA**
  Chrona can now be installed to your **desktop or mobile home screen** for a native-like experience.

  * Install prompts for iOS Safari, macOS Safari, and Chromium browsers
  * Fully **offline-capable** after initial load (Workbox + service worker)

* 🔔 **Push Notifications**
  Get notified even when Chrona is closed.
  When a timer completes, a **browser notification** is triggered.

  * Auto-subscribe after login
  * Permissions are handled gracefully with in-app prompts

* ⚙️ **Smarter Deployment Pipeline**
  CI/CD now powered by **Cloudflare Pages** with full support for:

  * `VITE_BACKEND_API_URL` and `VITE_VPUBLIC_KEY` injection at build time
  * Secure secrets pulled from Azure Key Vault
  * Build-time environment validation via `scripts/test-env.js`
  * PR preview images still built and pushed to Azure ACR

---

## 🧪 Engineering Notes

* Added `TimerCarousel`, `CarouselScreen`, and `CountDownComponent` enhancements for lazy rendering
* Rewrote `useNotificationPermission` to support both internal and external state
* Implemented `useInstallPrompt`, `useIosInstall`, and `useSafariInstallBanner` for platform-specific install UX
* Introduced `sw.ts`, `vite-plugin-pwa`, and `virtual:pwa-register` for offline support and asset caching
* Locked `vite` to `6.3.4` for compatibility with PWA plugins
* Removed `.env` reliance for frontend config — now using `define()` injection

---

## 🧩 What’s Next

* Polish mobile timer layout and screen-fitting edge cases
* Add analytics for install events and push opt-ins
* Extend timer logic with recurring intervals and notification tones
* Improve accessibility for screen readers

---

---
# 🕒 Chrona Frontend — v1.0.0

📅 **Release Date:** 2025‑05‑12
🏷️ **Version:** 1.0.0
🔗 **Full changelog:** [CHANGELOG.md](./CHANGELOG.md)

---

## 🎉 Highlights

* ✅ **Authentication System (Email + OAuth)**

    * Sign Up, Sign In, and secure token refresh via `useAuth`
    * Google OAuth2 support

* ⏱️ **Timer v2 API Integration**

    * Full support for backend timer lifecycle: `start`, `pause`, `resume`, `reset`, and `complete`
    * Accurate synchronization across sessions

* 🧭 **Modern Navigation + State Handling**

    * Global Navbar with authentication awareness
    * Modal-based form flow for better UX
    * Real-time user state with React Context

* 🎨 **UI/UX Overhaul**

    * Mobile-first layout, dark mode, smooth transitions
    * Reusable components (forms, modals, buttons)
    * Accessibility improvements

* 🛠️ **CI/CD & DevOps**

    * Azure Web Apps PR Previews with fallback logic
    * Runtime secrets injection from Azure Key Vault
    * Dynamic `BACKEND_APP_URL` in Docker builds via Vite global constants

---

## 🚀 What's Next

* Robust unit and integration tests
* Timer history dashboard
* User profile management
* Session analytics + insights

---

**Live demo:**
🔗 [https://chrona.blueprime.app](https://chrona.blueprime.app)

---

**Every second counts. Chrona makes sure you never lose a moment.**

---
