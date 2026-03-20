# Meme Library Sync Strategy

## Vision

A local-first meme library app. Works fully offline with no accounts. Available on the App Store (iOS/macOS) and as a web app hosted on EAS. Free tier is completely local. Optional paid "Pro" sync tier lets you keep your library in sync across devices — similar to how Excalidraw works (free local tool, paid Excalidraw+ for sync/collaboration).

**Target platforms**: iOS, macOS, Web. Nothing else.

## Current State

The app has **no persistence** — everything is in-memory `useState`. Any strategy requires adding local storage first. Data model is simple: `{ id, uri, tags, createdAt, isFavorite }` plus image files.

---

## The Product Model (Excalidraw-style)

### Free Tier (Local Only)

- App works 100% offline, no account, no sign-up
- iOS/macOS: data in local app storage (SQLite via `expo-sqlite`)
- Web: data in IndexedDB + image blobs in Origin Private File System or IndexedDB
- Each device is its own island — no sync, no network calls, fully private
- Import/export your library as a zip file (manual "sync" escape hatch)

### Pro Tier (Sync)

- Paid subscription managed entirely through Stripe
- The Stripe subscription IS the account — no separate auth system
- Log into your subscription on multiple devices to enable sync
- All your memes stay in sync across iOS, macOS, and web
- Still local-first: everything works offline, sync happens when devices reconnect
- Images stored in cloud object storage (Cloudflare R2), metadata synced via CRDT relay

---

## Hosting & Infrastructure

### EAS Hosting (Web + API)

The web app and sync API are both hosted on **EAS Hosting** (Expo's cloud platform, built on Cloudflare Workers).

**What EAS gives us**:

- **Web app hosting**: Deploy the Expo Router web build via `eas deploy` — static or server-rendered
- **API routes**: Files ending with `+api.ts` in the `app/` directory become serverless edge endpoints — this IS our sync relay server
- **Edge deployment**: Runs on Cloudflare's global network, low latency everywhere
- **Single deploy**: App and API ship together in one `eas deploy` command
- **Monitoring**: Built-in crash logs, request metrics, console output in EAS dashboard

**What EAS does NOT give us** (yet):

- No managed database (KV store and blob storage are in development but not available)
- No persistent server-side storage — we need external services for that

### External Services

| Service                  | Purpose                                 | Why this one                                                                 |
| ------------------------ | --------------------------------------- | ---------------------------------------------------------------------------- |
| **Cloudflare R2**        | Image blob storage                      | S3-compatible, no egress fees, same network as EAS Hosting (Cloudflare)      |
| **Stripe**               | Subscription billing + identity         | No separate auth needed, Customer Portal handles everything                  |
| **Turso or PlanetScale** | Sync metadata persistence (server-side) | Edge-friendly SQLite (Turso) or MySQL. Stores CRDT sync state per subscriber |

**Why Cloudflare R2 over S3**: EAS Hosting runs on Cloudflare Workers. R2 is Cloudflare's object storage. Calling R2 from a Cloudflare Worker is a local binding — no network hop, no egress fees. It's the natural pairing.

---

## Sync Architecture: CRDT + EAS API Relay

Each device maintains its own local database as the source of truth. Changes are tracked using CRDTs (Conflict-free Replicated Data Types). The EAS-hosted API relay passes updates between devices. Images are uploaded to R2 and referenced by URL.

### Architecture

```
┌──────────┐                ┌─────────────────────────┐                ┌──────────┐
│  iPhone   │ ── deltas ──→ │   EAS Hosting           │ ── deltas ──→ │   Mac    │
│ (SQLite)  │ ←─ deltas ── │   (+api.ts routes)      │ ←─ deltas ── │ (SQLite) │
└──────────┘                │                         │                └──────────┘
                            │   ┌───────────────┐     │
                            │   │ Turso/Planet  │     │
                            │   │ (sync state)  │     │
                            │   └───────────────┘     │
                            │                         │
                            │   ┌───────────────┐     │
                            │   │ Cloudflare R2 │     │
                            │   │ (image blobs) │     │
                            │   └───────────────┘     │
                            └─────────────────────────┘
                                       ↕
                                    deltas
                                       ↕
                                ┌──────────┐
                                │   Web    │
                                │(IndexedDB)│
                                └──────────┘
```

### How Sync Works

1. User adds a meme on their iPhone
2. CRDT library (Automerge or Yjs) records the change as a delta
3. Image is uploaded to R2 (gets a URL back)
4. Delta (metadata + image URL) is POSTed to the EAS API relay (`/api/sync+api.ts`)
5. Relay stores the delta in Turso, keyed by the user's subscription ID
6. Other devices poll or connect via WebSocket to pull new deltas
7. Each device applies incoming deltas to its local CRDT state — conflicts resolve automatically
8. Images are fetched from R2 by URL and cached locally

### CRDT Library Choice

- **Automerge** — mature, great docs, binary sync protocol, built for this exact use case
- **Yjs** — faster and lighter, widely used (Notion, etc.), also JS/TS native
- Either works. Recommend evaluating both with a small prototype.

---

## Subscription & Identity: Stripe as the Account

The core principle: **the Stripe subscription IS the user's account**. There is no separate auth database, no user table, no password, no OAuth. Stripe manages everything about the customer — we just check "does this person have an active subscription?"

### How It Works

**Signing up for Pro**:

1. User taps "Upgrade to Pro" in the app
2. App opens a Stripe Checkout session (web view / browser redirect)
3. User pays with card → Stripe creates a Customer + Subscription
4. Stripe redirects back to the app with a session ID
5. App calls our API to exchange the session ID for a **device token** — a signed JWT containing the Stripe Customer ID and subscription status
6. Token stored locally on the device. This is the "login."

**Logging in on another device**:

1. User taps "I have a Pro subscription" on a new device
2. App asks for their email (the one they used at checkout)
3. Our API sends a **magic link** to that email (via Stripe's email or our own via Resend/Postmark)
4. User taps the link → app receives a callback → API issues a device token
5. Device is now linked to the subscription. Sync begins.

**Why magic link, not password**:

- No password database to secure or breach
- Email is already known to Stripe (it's the customer email)
- It's the pattern Signal, Notion, and Slack use for low-friction auth
- One fewer thing to build and maintain

**Managing the subscription**:

- All subscription management (cancel, update payment, view invoices) happens in the **Stripe Customer Portal**
- We link to it from the app's settings screen: `Settings → Manage Subscription → opens Stripe Portal`
- We never build billing UI ourselves — Stripe handles it all

### What We Store Server-Side

| Data                | Where                    | Purpose                                      |
| ------------------- | ------------------------ | -------------------------------------------- |
| Stripe Customer ID  | Turso                    | Link devices to a subscription               |
| Device tokens       | Turso                    | Track which devices belong to which customer |
| CRDT sync deltas    | Turso                    | Queue deltas for offline devices             |
| Image blobs         | Cloudflare R2            | Shared image storage for synced memes        |
| Subscription status | Stripe (source of truth) | Checked via webhook or API call              |

### Stripe Webhooks

Our EAS API listens to Stripe webhooks to stay in sync with subscription state:

- `customer.subscription.created` → Enable sync for this customer
- `customer.subscription.deleted` → Disable sync, stop accepting new deltas (local data remains)
- `customer.subscription.updated` → Handle plan changes
- `invoice.payment_failed` → Grace period, then disable sync

### Apple App Store Considerations

**Important**: As of the Epic v. Apple ruling (2025), iOS apps in the US can link to external payment (Stripe) without using Apple's In-App Purchase. This means:

- We can use **Stripe directly** for subscriptions on iOS (2.9% fee vs Apple's 30%)
- We link out to a Stripe Checkout page from the app
- No need to implement StoreKit or Apple IAP
- This works in the US; other regions may still require IAP (evaluate per-market)

If we want to maximize reach globally, a hybrid approach is possible: offer Apple IAP in regions that require it, Stripe everywhere else. But for launch (US-first), Stripe-only is simpler and dramatically cheaper.

---

## API Routes (EAS Hosting)

All server-side logic lives in Expo Router API routes (`+api.ts` files), deployed to EAS Hosting.

```
app/
├── api/
│   ├── auth/
│   │   ├── magic-link+api.ts     # Send magic link email
│   │   └── verify+api.ts         # Verify magic link, issue device token
│   ├── sync/
│   │   ├── push+api.ts           # Receive CRDT deltas from a device
│   │   ├── pull+api.ts           # Send queued deltas to a device
│   │   └── ws+api.ts             # WebSocket for real-time sync (if supported)
│   ├── images/
│   │   ├── upload+api.ts         # Generate R2 presigned upload URL
│   │   └── [id]+api.ts           # Proxy or redirect to R2 for download
│   └── stripe/
│       ├── checkout+api.ts       # Create Stripe Checkout session
│       ├── portal+api.ts         # Generate Stripe Customer Portal link
│       └── webhook+api.ts        # Handle Stripe webhook events
```

**Every route** checks the device token (JWT) before doing anything. No valid token = 401. The token contains the Stripe Customer ID, so we always know who's syncing.

---

## Data Flow: Full Lifecycle

### Free User

```
1. Opens app
2. Adds memes → stored in local SQLite/IndexedDB
3. Tags, favorites, deletes → all local
4. Closes app → data persists locally
5. No network calls ever made
```

### Pro User (First Device)

```
1. Taps "Upgrade to Pro"
2. → Stripe Checkout (pays)
3. → Redirect back to app with session ID
4. → App calls /api/auth/verify → gets device token
5. → App enables sync engine
6. Existing local memes are pushed as CRDT deltas to /api/sync/push
7. Images uploaded to R2 via /api/images/upload (presigned URL)
8. Done — this device is the initial source of truth
```

### Pro User (Adding a Second Device)

```
1. Installs app on new device
2. Taps "I have Pro" → enters email
3. → Magic link sent → taps link → device token issued
4. → App calls /api/sync/pull → receives all CRDT deltas
5. → CRDT state rebuilt locally from deltas
6. → Images fetched from R2, cached locally
7. Both devices now in sync — future changes flow both ways
```

### Pro User (Day-to-Day Sync)

```
1. Adds a meme on iPhone (offline on subway)
2. CRDT delta queued locally
3. Phone reconnects to internet
4. Delta pushed to /api/sync/push
5. Mac app polls /api/sync/pull (or receives via WebSocket)
6. Mac applies delta → meme appears
7. User favorites the meme on Mac → delta flows back to iPhone
```

---

## Comparison: Why This Architecture

| Alternative considered          | Why we didn't choose it                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| iCloud/CloudKit                 | Web is second-class, Apple lock-in, implicit iCloud "account"         |
| WebRTC P2P                      | Devices must be online simultaneously, no async sync                  |
| Anonymous sync keys (no Stripe) | No billing mechanism, can't gate Pro features, can't send magic links |
| Firebase/Supabase               | Adds a full BaaS dependency, overkill for a relay, not edge-native    |
| Self-hosted server              | Users don't want to run servers; we're building a product, not a tool |

---

## Implementation Phases

### Phase 1: Local Persistence

- Add `expo-sqlite` for iOS/macOS persistence
- Add IndexedDB wrapper for web persistence
- Meme data + image file references survive app restarts
- No networking, no sync — just durable local storage

### Phase 2: CRDT Layer

- Integrate Automerge or Yjs
- Wrap meme CRUD operations to produce CRDT deltas
- Local operations generate deltas that are stored locally (prep for sync)
- Test: make changes on one device, export CRDT state, import on another — they merge

### Phase 3: EAS API + Stripe

- Set up EAS Hosting with API routes
- Implement Stripe Checkout, webhook handling, and Customer Portal link
- Implement magic link auth (email → verify → device token)
- Set up Turso for server-side sync state storage
- Set up Cloudflare R2 bucket for image blobs

### Phase 4: Sync Engine

- Implement push/pull API routes for CRDT deltas
- Build client-side sync engine (push local deltas, pull remote deltas, apply)
- Image upload to R2 via presigned URLs
- Image download + local caching
- Handle offline queuing and reconnection

### Phase 5: Polish & Ship

- Pro upgrade flow in the app UI
- "I have Pro" / magic link login flow
- Settings → Manage Subscription (Stripe Portal)
- Sync status indicator in the app
- Conflict resolution testing (simultaneous edits from multiple devices)
- Error handling, retry logic, edge cases
