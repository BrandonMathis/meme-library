# Meme Library Sync Strategy

## Vision

A local-first meme library app. Works fully offline with no accounts. Available on the App Store (iOS/macOS) and as a web app at a URL. Free tier is completely local. Optional paid "Pro" sync tier lets you keep your library in sync across devices — similar to how Excalidraw works (free local tool, paid Excalidraw+ for sync/collaboration).

**Target platforms**: iOS, macOS, Web. Nothing else.

## Current State

The app has **no persistence** — everything is in-memory `useState`. Any strategy requires adding local storage first. Data model is simple: `{ id, uri, tags, createdAt, isFavorite }` plus image files.

---

## The Product Model (Excalidraw-style)

### Free Tier (Local Only)

- App works 100% offline, no account, no sign-up
- iOS: data in local app storage (SQLite or file-based)
- macOS: same approach, local app storage
- Web: data in IndexedDB + image blobs in IndexedDB or Origin Private File System
- Each device is its own island — no sync, no network calls, fully private
- Import/export your library as a zip file (manual "sync" escape hatch)

### Pro Tier (Sync)

- Link your devices together — no account/email required
- All your memes stay in sync across iOS, macOS, and web
- Still local-first: everything works offline, sync happens when devices reconnect

---

## Sync Architecture Options for Pro Tier

### Option 1: CRDT + Relay Server (Recommended)

**How it works**: Each device maintains its own local database as the source of truth. Changes are tracked using CRDTs (Conflict-free Replicated Data Types) — a data structure that can be merged from any direction without conflicts. A lightweight relay server passes encrypted updates between your devices. The server never sees your data — it just forwards opaque blobs.

**Think of it like**: iMessage. Your devices talk to each other through Apple's servers, but Apple can't read your messages. Same idea — the relay passes data, but the content is encrypted and only your devices can read it.

**How devices link (no accounts)**:

1. Open the app on Device A, tap "Set up sync"
2. App generates a **sync key** (a random 256-bit key displayed as a QR code + human-readable words like "tiger-castle-rainbow-seven")
3. On Device B, tap "Join sync" and scan the QR code (or type the words)
4. Both devices now share the same encryption key and sync group ID
5. That's it. No email, no password, no account. The sync key IS your identity.

**Architecture**:

```
┌──────────┐     encrypted     ┌──────────────┐     encrypted     ┌──────────┐
│  iPhone   │ ──── deltas ───→ │ Relay Server │ ──── deltas ───→ │   Mac    │
│ (SQLite)  │ ←── deltas ──── │  (stateless)  │ ←── deltas ──── │ (SQLite) │
└──────────┘                   └──────────────┘                   └──────────┘
                                      ↕
                                encrypted deltas
                                      ↕
                               ┌──────────┐
                               │   Web    │
                               │(IndexedDB)│
                               └──────────┘
```

**CRDT library options**:

- **Automerge** — mature, great docs, built for exactly this use case. Has a binary sync protocol that's bandwidth-efficient. Works in JS/TS (React Native + web).
- **Yjs** — faster and lighter than Automerge, widely used (powers Notion's collab, Figma-like tools). Also JS/TS native.
- **lo-fi / lofi** — newer library built specifically for local-first apps with sync. Worth evaluating.

**Relay server**:

- Extremely simple — receives encrypted byte arrays, stores them briefly, forwards to other devices in the sync group
- Could be a single Cloudflare Worker, a tiny Fly.io app, or even a Supabase Realtime channel
- Zero knowledge of the data (end-to-end encrypted)
- Cheap to run — it's just passing messages, not processing them
- For images: relay stores encrypted image blobs temporarily until all devices have pulled them, then deletes

**Pros**:

- No accounts, no passwords, no email — sync key is the identity
- End-to-end encrypted — the server literally cannot read your memes
- CRDTs handle conflict resolution automatically (two devices edit the same meme? both changes merge cleanly)
- Works offline — changes queue up and sync when reconnected
- Server is dirt cheap (stateless message relay)
- All three platforms are first-class citizens
- The Excalidraw model — users understand "free = local, pro = sync"

**Cons**:

- CRDTs add library weight (~50-100KB for Automerge/Yjs)
- Image sync is the hard part — CRDT handles metadata easily, but syncing actual image files needs a blob storage/transfer layer on top
- Relay server is simple but still needs to exist and be maintained
- Sync key UX needs to be bulletproof — if you lose it, you lose sync (could offer key backup to iCloud Keychain)
- CRDT learning curve for the dev team

**Complexity**: Medium
**Cost**: Very low ($5-20/mo for relay server at small scale, scales linearly)

---

### Option 2: CloudKit as the Relay (Apple-Native)

**How it works**: Same local-first CRDT architecture, but instead of running your own relay server, use Apple's CloudKit as the transport layer. Devices signed into the same iCloud account automatically share a CloudKit container. Sync happens through CloudKit push notifications and shared records.

**How devices link**: They don't need to — if you're signed into the same iCloud account on all your Apple devices, CloudKit handles discovery automatically. For web, CloudKit JS requires an Apple ID sign-in.

**Architecture**:

```
┌──────────┐                  ┌──────────────┐                  ┌──────────┐
│  iPhone   │ ─── CRDT ────→ │   CloudKit    │ ─── CRDT ────→ │   Mac    │
│ (SQLite)  │ ←── sync ──── │  (Apple)      │ ←── sync ──── │ (SQLite) │
└──────────┘                  └──────────────┘                  └──────────┘
                                      ↕
                               CloudKit JS
                                      ↕
                               ┌──────────┐
                               │   Web    │
                               │(IndexedDB)│
                               └──────────┘
```

**Pros**:

- No relay server to build or maintain — Apple runs it
- Free tier is generous (10GB asset storage, 100MB database, per user)
- Native iOS/macOS integration is seamless
- Push notifications for real-time sync are built-in
- Users don't need to set up anything — iCloud "just works"
- Apple handles image storage too (CKAsset)

**Cons**:

- Requires Apple Developer account ($99/year)
- Web is second-class — users must sign in with Apple ID in the browser
- You're locked into Apple's infrastructure
- React Native ↔ CloudKit bridging requires native modules
- No encryption by default (Apple can see the data), though you could encrypt before storing
- Harder to offer on non-Apple platforms later if you expand
- Not truly "no account" — it uses the user's iCloud account implicitly

**Complexity**: Medium-High (native bridging)
**Cost**: $99/yr Apple Developer + iCloud storage (free for most users)

---

### Option 3: WebRTC Peer-to-Peer (Serverless Sync)

**How it works**: Devices connect directly to each other using WebRTC — the same technology that powers video calls in the browser. A tiny signaling server helps devices find each other initially, then they communicate peer-to-peer. No data ever passes through a server.

**How devices link**:

1. Device A creates a "sync room" and gets a room code
2. Device B enters the room code
3. The signaling server introduces them, then gets out of the way
4. All subsequent sync is direct, device-to-device

**Architecture**:

```
┌──────────┐                                          ┌──────────┐
│  iPhone   │ ◄════════ WebRTC P2P ════════════════► │   Mac    │
│ (SQLite)  │                                          │ (SQLite) │
└──────────┘                                          └──────────┘
      ▲                                                      ▲
      ║                    WebRTC P2P                        ║
      ╚═══════════════════════╦══════════════════════════════╝
                              ▼
                       ┌──────────┐
                       │   Web    │
                       │(IndexedDB)│
                       └──────────┘

      Signaling server only used for initial connection setup
```

**Pros**:

- Truly serverless for data transfer — devices talk directly
- Maximum privacy — data never touches a server
- Free (signaling server is trivial, could even use a free TURN service)
- WebRTC is supported on iOS (react-native-webrtc), macOS, and all browsers
- Low latency when devices are on the same network (uses LAN automatically)
- Can combine with CRDTs for robust conflict resolution

**Cons**:

- **Both devices must be online simultaneously** — this is the dealbreaker. If your phone syncs a meme while your Mac is asleep, the Mac doesn't get it until both are open at the same time
- WebRTC on React Native (`react-native-webrtc`) is a heavy dependency with native code
- NAT traversal can fail — some networks block P2P (needs TURN fallback, which means a server anyway)
- Connection setup is flaky compared to a relay (WebRTC negotiation has many failure modes)
- Syncing a large library on first connect could be slow
- No offline queuing without a relay buffer

**Complexity**: High
**Cost**: Near-zero (signaling is cheap, but TURN server needed as fallback adds cost)

---

## Comparison Matrix

| Criteria                       | 1: CRDT + Relay  | 2: CloudKit     | 3: WebRTC P2P    |
| ------------------------------ | ---------------- | --------------- | ---------------- |
| **No account required**        | Yes (sync key)   | No (iCloud)     | Yes (room code)  |
| **Web is first-class**         | Yes              | No              | Yes              |
| **Works when devices offline** | Yes (queues)     | Yes             | No (both online) |
| **Server cost**                | $5-20/mo         | $99/yr          | ~Free            |
| **Privacy**                    | E2E encrypted    | Apple sees data | Maximum (P2P)    |
| **Image sync**                 | Via relay        | CKAsset         | Direct P2P       |
| **Conflict resolution**        | CRDT (automatic) | CRDT or manual  | CRDT             |
| **Implementation effort**      | Medium           | Medium-High     | High             |
| **Scales to many users**       | Yes              | Yes             | Poorly           |
| **Future Android/Windows**     | Easy to add      | Very hard       | Easy to add      |
| **Monetizable as Pro feature** | Yes (relay cost) | Awkward         | Hard (no cost)   |

---

## Recommendation

**Option 1: CRDT + Relay Server** is the clear winner for this product vision.

Here's why:

1. **No accounts** — the sync key model is elegant and users understand it (Signal does the same thing for linked devices)
2. **Web is first-class** — no Apple ID sign-in, no second-class experience
3. **It's monetizable** — the relay server costs you money to run, which directly justifies a Pro tier. WebRTC is free so there's no natural paywall. CloudKit is tied to Apple so it feels weird to charge for.
4. **E2E encryption** — strong privacy story, which matters for a "local-first" brand
5. **CRDTs eliminate conflict headaches** — two devices edit the same meme's tags simultaneously? Both changes merge. No "last write wins" surprises.
6. **Future-proof** — if you ever want Android or Windows, nothing about this architecture is Apple-specific

**Suggested tech stack for sync**:

- **Local DB**: SQLite via `expo-sqlite` (iOS/macOS) + IndexedDB (web)
- **CRDT**: Automerge or Yjs for metadata sync
- **Relay**: Cloudflare Workers + Durable Objects (cheap, global, low-latency) or a simple WebSocket server on Fly.io
- **Image transfer**: Presigned URLs to R2/S3-compatible storage (encrypted blobs), or chunked transfer through the relay
- **Encryption**: libsodium (tweetnacl-js) for E2E encryption using the shared sync key

**Implementation phases**:

1. **Phase 1**: Add local persistence (SQLite + IndexedDB). App survives restarts.
2. **Phase 2**: Add CRDT layer on top of local storage. Changes tracked as CRDT operations.
3. **Phase 3**: Build relay server + device linking (sync key / QR code).
4. **Phase 4**: Image sync pipeline (encrypted blob upload/download).
5. **Phase 5**: Pro tier gating — free users get local-only, Pro users get sync.
