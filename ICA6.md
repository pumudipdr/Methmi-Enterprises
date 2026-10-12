# ICA 6: Admin Tours and Public Fleet

**Project:** Methmi Enterprises  
**Contribution scope:** Server data fetching, rendering, freshness, loading states and performance for `/admin/tours` and `/fleet`; individual ownership is listed below.

## 1. Production URL and member ownership

| Item | Value |
|---|---|
| Production website | https://methmi-enterprises-web.vercel.app |
| Owned page | https://methmi-enterprises-web.vercel.app/admin/tours |
| Contribution branch | `feature/ica6-admin-tours` |

| Member name | GitHub username | Owned ICA 6 route | Database-backed content |
|---|---|---|---|
| DinujaKuruppu | [dinujakuruppu](https://github.com/dinujakuruppu) | `/admin/tours` | Tours read from the Supabase `tours` table |
| pumudi | [pumudipdr](https://github.com/pumudipdr) | `/fleet` | Vehicles read directly from the Supabase `vehicles` table |

The production URL above is the URL recorded in the supplied Lighthouse reports. Final deployment and GitHub contribution evidence are tracked in Section 8.

## 2. Rendering mode and reason

| Route | Rendering mode | Cache configuration | Reason |
|---|---|---|---|
| `/admin/tours` | Dynamic | `dynamic = "force-dynamic"`, `revalidate = 0`; Supabase fetches use `cache: "no-store"` | The page requires authenticated admin access and must show current database content without sharing cached authenticated responses. |


## 3. Server data fetching

| Requirement | Implementation |
|---|---|
| Initial data fetched on the server | The async Server Component calls `getAdminToursPage(page)` before rendering and passes `initialTours` to the interactive component. |
| Direct data-function calls | The server-only helper queries Supabase directly. Initial page data does not travel through the application's own HTTP API. |
| Small client boundary | The route page remains a Server Component. Client state is used for CRUD forms, buttons, dialogs and list synchronization. |
| No initial browser data fetch | The client effect synchronizes new `initialTours` props; it does not fetch the initial list. |
| Pagination | The database query returns at most 12 tours per page using `.range()`. Previous/Next links navigate the pages. |
| Selected fields | The query selects `slug`, `name`, `duration`, `pickup_time`, `description`, `highlights`, `included`, `starting_price` and `image`. These fields support the cards and edit form. |
| Authentication and safe client props | The helper verifies the signed session, resolves the authenticated user and checks current admin membership before querying tours. Service credentials and authentication checks remain on the server. |
| Real database content | Tours come from Supabase; the initial list does not use mock records, local JSON records or fallback tour data. |


## 4. Caching and freshness after changes

Tour create, update and delete operations call `revalidateAfterTourChange()`. The server action rechecks admin authorization and invalidates:

- `/admin/tours` - the owned management page;
- `/admin` - dashboard counts;
- `/tours` - the public tours list;
- `/` - tour content on the home page.


## 5. Loading, error and empty states

| State | User-visible behavior |
|---|---|
| Initial loading | `loading.tsx` displays a six-card skeleton with `aria-busy`. The route segment can stream while the page waits for its data. |
| Page-data failure | `error.tsx` displays a generic message and a **Try Again** button calling `reset()`. |
| Empty tours list | The page displays **No tours yet. Add your first one.** |
| Saving or deleting | Buttons indicate the operation in progress; failures display safe messages. |
| Error details | The inspected route and API error paths do not display database error text or stack traces to users. |


## 6. Performance implementation and evidence

### Implemented optimizations

- Tour images use `next/image` with `fill`, responsive `sizes` and quality 75.
- The first tour image uses eager loading and high fetch priority; later tour images use lazy loading.
- The shared root layout loads Inter and Poppins through `next/font` with `display: "swap"`. Tailwind's body/display font classes use the corresponding CSS variables.
- Pagination limits initial tour data to 12 records, and field selection avoids fetching unnecessary columns.
- A migration creates `idx_tours_sort_order_slug` on `(sort_order, slug)`, matching the list query's ordering. Production application of the migration is pending verification.
- No heavy client-only chart, editor or map library was identified in this route that requires a dynamic import.

### Before and after Lighthouse results

The original reports record **mobile** runs of the production `/admin/tours` URL with simulated throttling. The reports are stored unchanged in `docs/lighthouse/`.

| Metric | Before | After |
|---|---:|---:|
| Performance score | 80 | 98 |
| Largest Contentful Paint | 5.109 s | 2.179 s |
| First Contentful Paint | 1.064 s | 1.054 s |
| Total Blocking Time | 73 ms | 21 ms |
| Cumulative Layout Shift | 0 | 0 |

| Report | Measurement time - Asia/Colombo, UTC+05:30 | File |
|---|---|---|
| Before | 9 October 2026, 17:10:03 | [Before Lighthouse report](docs/lighthouse/admin-tours-before.html) |
| After | 10 October 2026, 01:19:48 | [After Lighthouse report](docs/lighthouse/admin-tours-after.html) |

The saved after report meets both ICA 6 targets: **Performance >=80** and **LCP <2.5 seconds**. The recorded score improved by 18 points. These are saved report measurements; correspondence to the final release and incognito use remain pending verification.

## 7. Production build route table

The supplied build screenshot contains `ƒ /admin/tours`, indicating dynamic rendering:

![Build route table showing dynamic Admin Tours rendering](docs/ica6/build-route-table.png)

## 8.| Pull Request | [PR #46](https://github.com/ICT-Courses/in-course-assessment-ica-3-4-5-and-6-submissions-Tech-nova/pull/46) |

## 9. Files supporting this contribution

| File | Purpose |
|---|---|
| `frontend/src/app/admin/tours/page.tsx` | Server-rendered page, pagination links, dynamic mode and metadata. |
| `frontend/src/lib/server/admin-tours.ts` | Authorization and direct, paginated Supabase query. |
| `frontend/src/app/admin/tours/ToursAdminClient.tsx` | Interactive CRUD controls, image optimization and refresh behavior. |
| `frontend/src/app/admin/tours/actions.ts` | Authorized revalidation of affected pages. |
| `frontend/src/app/admin/tours/loading.tsx` | Loading skeleton. |
| `frontend/src/app/admin/tours/error.tsx` | Safe error screen and retry. |
| `backend/supabase/migrations/admin_tours_index.sql` | Index supporting tour-list ordering. |
| `frontend/src/app/layout.tsx` | Shared `next/font` integration. |
| `frontend/tailwind.config.ts` | Shared font-variable mapping. |
| `docs/lighthouse/admin-tours-before.html` | Original before measurement. |
| `docs/lighthouse/admin-tours-after.html` | Original after measurement. |
| `docs/ica6/build-route-table.png` | Supplied route-table screenshot. |


## 10. Public Fleet - pumudi (pumudipdr)

Production page: https://methmi-enterprises-web.vercel.app/fleet

| Route | Rendering mode | Reason |
|---|---|---|
| `/fleet` | ISR, 60-second revalidation | Public vehicle data is shared by visitors and changes occasionally. Admin vehicle edits also trigger immediate cache expiry. |

### Implementation

- The fleet Server Component calls `getFleet()` in `frontend/src/lib/server/fleet.ts` directly; initial data does not call this application's Express API.
- The server-only helper selects public fields from Supabase, orders by `sort_order` and `slug`, and limits the listing to 12 vehicles. If more exist, the page shows the total and a contact link for additional options.
- No mock or fallback vehicle records are served. Empty results and query failures have separate states.
- Only public vehicle data is cached; sessions and private admin records are not placed in the shared cache.
- After successful create, update or delete in the vehicle admin UI, an authenticated Server Action expires the `public-fleet` tag and calls `revalidatePath` for affected pages. The action verifies both the signed session and current database admin membership.
- If that separate refresh request fails, the UI says the change was saved and offers a refresh-only retry. Direct database/API edits outside this UI rely on time-based revalidation; an already-open visitor tab is not live-updated.
- `loading.tsx` supplies a skeleton when a render waits; cache hits may display immediately. `error.tsx` offers a safe retry, and an empty list shows a clear message.
- The existing first-image priority, responsive sizes and WhatsApp contrast changes are retained.
- `backend/supabase/migrations/fleet_order_index.sql` supplies the ordering index. Applying it to production remains a deployment step.

### Configuration and evidence still required

Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and the matching `ADMIN_SESSION_SECRET` in the Vercel frontend service. Values belong in environment settings, never this document or Git. These are the same server settings used by admin tours.

| Metric | Before | After |
|---|---:|---:|
| Performance | 98 | Pending production measurement |
| Accessibility | 96 | Pending production measurement |
| Best Practices | 100 | Pending production measurement |
| SEO | 100 | Pending production measurement |
| LCP | 2.2 seconds | Pending production measurement |

Before evidence: [Fleet before report](docs/lighthouse/fleet-before.html).

Save the real mobile incognito production after report as `docs/lighthouse/fleet-after.html`. Add a screenshot of the production hosting build table showing `/fleet` and its revalidation interval; the admin-tours screenshot above is not proof of the new fleet rendering mode.

Production verification remains pending: database content in page source, freshness after create/update/delete without hard refresh, unauthorized access, and loading/error/empty states. Add reviewed fleet PR links from pumudipdr's account. A local build is development validation, not the production evidence required by ICA6.

### Local fleet validation

Frontend and backend TypeScript checks passed. `npm run build` passed and reported `/fleet` as prerendered with `1m` revalidation. A read-only comparison confirmed all 7 current database vehicle names in the generated fleet HTML; the first-image high priority was retained and the prerender manifest reports 60 seconds. No database records were changed by validation. Authenticated mutation freshness still needs an end-to-end check after deployment.
