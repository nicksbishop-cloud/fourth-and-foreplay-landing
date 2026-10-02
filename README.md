# Fourth & Foreplay landing page

Live production page: https://fourth-and-foreplay-landing.vercel.app/

React/Vite frontend with a Vercel Function for early-access signup. Run `npm ci` and `npm run build`. Source is uploaded to `nicksbishop-cloud/fourth-and-foreplay-landing` on main. Initial Vercel production deployment used the prepared source ZIP with Vercel Drop. The GitHub repository is now connected to Vercel for automatic deployments. Build uses the Vite preset, repository root, and dist output.

The signup endpoint forwards to the existing AppDeploy landing backend, preserving its early-access list. It reports success only after the backend confirms persistence. AppDeploy remains a signup dependency until the list is migrated.

Provided logo, real app screenshots, and commercial are included. Illustrative scores were removed to avoid presenting them as live data.

Run `node scripts/check-signup.mjs` for mocked checks that never create a live waitlist entry. Live method/invalid-email checks and desktop rendering/video playback passed. User phone screenshot shows the signup section and successful signup confirmation. Full mobile visual checking and independent database inspection remain outstanding. See WORK_LOG_2026-10-02.md for evidence.
