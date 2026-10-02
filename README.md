# Fourth & Foreplay landing page

Recovered from AppDeploy landing version 1790919213941. React/Vite frontend with a Vercel Function for early-access signup.

Run `npm ci` and `npm run build`. Import `nicksbishop-cloud/fourth-and-foreplay-landing` into Vercel using the Vite preset and the repository root.

The signup endpoint forwards to the existing AppDeploy landing backend, preserving its existing early-access list. It reports success only after the backend confirms persistence. AppDeploy remains a dependency for signup until the list is migrated.

Real app screenshots and the supplied commercial are included. Illustrative scores were removed to avoid presenting them as live data.

Run `node scripts/check-signup.mjs` for bounded, mocked signup checks that never create a live waitlist entry. The browser preview still requires a visual check before deployment. See WORK_LOG_2026-10-02.md for verification evidence and remaining blockers.
