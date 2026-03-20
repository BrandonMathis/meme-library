# Meme Library Sync Strategy

## Current State

Before we can sync anything, it's worth noting: **the app has no persistence at all right now**. Memes live in React `useState` — close the app, everything's gone. Any sync strategy requires adding local persistence first (AsyncStorage, SQLite, or file-based). That's a prerequisite for all options below.

**Data model** is simple: `{ id, uri, tags, createdAt, isFavorite }`. The actual image files are referenced by URI from the device's media library.

**Target platforms**: iOS, macOS, Web (Chrome). That's it.

---

## Option A: iCloud + CloudKit (Apple-Native Sync)

**How it works**: Use iCloud as the sync backbone. Store meme metadata in CloudKit (Apple's cloud database) and meme images in iCloud Drive. All Apple devices signed into the same iCloud account automatically stay in sync. For web, provide a read-only or limited-sync fallback via CloudKit JS (Apple's JavaScript SDK for CloudKit).

**What syncs where**:
- iOS ↔ macOS: Full automatic sync via CloudKit + iCloud Drive. This is how Apple Photos, Notes, etc. work.
- Web: CloudKit JS provides a web API to read/write CloudKit data, but requires Apple ID sign-in in the browser.

**Pros**:
- Zero infrastructure to manage — Apple hosts everything
- Native, seamless sync between iOS and macOS (feels like magic)
- No server costs for small-to-medium usage (free tier is generous)
- Privacy-friendly — data stays in the user's iCloud account
- Handles conflict resolution at the framework level
- Offline-first by design — syncs when connectivity returns

**Cons**:
- Requires an Apple Developer account ($99/year)
- Locks you into the Apple ecosystem (fine for now since we're only targeting Apple + web)
- CloudKit JS for web requires users to sign in with their Apple ID — clunky UX
- React Native doesn't have first-class CloudKit support — you'd need a native module (Swift bridge) or an existing community library like `react-native-cloud-store` for iCloud Drive
- Image sync through iCloud Drive can be slow for large libraries
- Web experience will always be second-class compared to native

**Complexity**: Medium-High (native module bridging required)

---

## Option B: Bonjour/mDNS Local Network Sync (AirDrop-style)

**How it works**: Devices discover each other on the same local Wi-Fi network using Bonjour (Apple's zero-config networking / mDNS). Once discovered, they establish a direct peer-to-peer connection and sync meme data + images over the local network. Think of it like AirDrop but for your meme library.

**Architecture**:
- Each device runs a lightweight HTTP server (or WebSocket server) when sync mode is active
- Devices advertise themselves via Bonjour/mDNS
- When two devices find each other, they compare libraries and exchange diffs
- Images transfer directly device-to-device over LAN

**What syncs where**:
- iOS ↔ macOS: Bonjour discovery + direct transfer. Works great on the same network.
- Web: The browser can connect to a discovered device's local server (e.g., `http://192.168.1.x:PORT`), but **browsers cannot advertise themselves via Bonjour**. The native app would need to act as the server, and the web app connects to it.

**Pros**:
- Completely local — no cloud, no server, no internet required
- Fast transfers (LAN speed, not limited by upload bandwidth)
- Maximum privacy — data never leaves your network
- No ongoing costs whatsoever
- Cool factor — feels like AirDrop

**Cons**:
- Only works when devices are on the same network (no sync from coffee shop to home)
- Requires a native module for Bonjour/mDNS on iOS (`react-native-zeroconf` or similar)
- Web browsers are limited — can't do mDNS discovery, so the web app needs the native app's IP/port manually or via QR code
- Conflict resolution is entirely on you to build
- Need to handle the embedded HTTP/WebSocket server (e.g., `react-native-http-bridge` or similar)
- Both devices must be open and active simultaneously to sync
- No background sync — the app must be in the foreground (iOS restriction)

**Complexity**: High (networking, discovery, server, conflict resolution all from scratch)

---

## Option C: Shared Folder Sync (iCloud Drive / File-Based)

**How it works**: Instead of a database sync protocol, simply store the entire meme library as files in a shared folder on iCloud Drive (or any synced folder). The library is a JSON file for metadata + image files in a subfolder. iCloud Drive handles syncing the folder across devices automatically.

**Architecture**:
- `MemeLibrary/library.json` — contains all meme metadata
- `MemeLibrary/images/` — contains all meme image files (copied from media library)
- This folder lives in iCloud Drive, which syncs automatically across Apple devices
- On web, access via iCloud Drive web or CloudKit JS

**What syncs where**:
- iOS ↔ macOS: Automatic via iCloud Drive folder sync. Both read/write the same files.
- Web: Could access via iCloud.com Drive, but programmatic access from a web app is limited. CloudKit JS could work as a bridge.

**Pros**:
- Conceptually very simple — it's just files in a folder
- iCloud Drive handles all the sync mechanics
- Works offline — edit locally, syncs when connected
- No server, no API, minimal infrastructure
- Easy to debug — you can literally open the JSON file and look at it
- Could work with other folder-sync services (Dropbox, etc.) in the future

**Cons**:
- Conflict resolution for the JSON file is a real problem — if two devices edit simultaneously, one wins and one loses (last-write-wins). Could mitigate by using one-file-per-meme instead of a single JSON.
- Requires copying images out of the media library into the shared folder (duplicating storage)
- iCloud Drive file access from React Native requires native bridging (`react-native-cloud-store`)
- Web access to iCloud Drive is very limited programmatically
- File-based sync is not real-time — iCloud Drive syncs on its own schedule
- Large image libraries will eat up iCloud storage quota

**Complexity**: Low-Medium (simple concept, but native bridging still needed for iCloud Drive access)

---

## Option D: Self-Hosted Lightweight Server on Your Mac

**How it works**: Run a small sync server on your Mac (could be a simple Node.js/Express or Go server, or even a SQLite-backed service). All devices point to this server over your local network. The Mac is the "source of truth." The server could also be exposed via Tailscale or similar for sync outside the home network.

**Architecture**:
- Mac runs a lightweight sync server (e.g., Node + SQLite + image storage)
- iOS app and web app connect to `http://<mac-ip>:PORT` or a Tailscale address
- REST API or WebSocket for real-time sync
- Server stores all meme metadata + images

**What syncs where**:
- iOS ↔ Mac ↔ Web: All sync through the central server. Works on the same network by default, or anywhere via Tailscale/Cloudflare Tunnel.
- Optionally, the Mac app could just BE the server (Electron/Tauri app that also serves the API)

**Pros**:
- Full control over sync logic
- Works identically across all three platforms (iOS, web, macOS) — no second-class citizens
- Can extend to work outside local network via Tailscale (still "no cloud" in the traditional sense)
- Simple REST API — easy to build and debug
- Real-time sync possible via WebSockets
- No Apple Developer account required

**Cons**:
- You have to run and maintain a server process on your Mac
- If the Mac is off or the server isn't running, no sync
- Need to handle the server lifecycle (auto-start, crash recovery)
- Building a proper sync protocol with conflict resolution is non-trivial
- Security considerations — exposing a server on your network
- More moving parts than a pure-local solution

**Complexity**: Medium (server is simple, but it's another thing to maintain)

---

## Comparison Matrix

| Criteria                    | A: iCloud/CloudKit | B: Bonjour/LAN | C: Shared Folder | D: Self-Hosted Server |
|-----------------------------|-------------------|-----------------|-------------------|-----------------------|
| **No internet required**    | No                | Yes             | No (for sync)     | Yes (LAN) / No (Tailscale) |
| **No server to maintain**   | Yes               | Yes             | Yes               | No                    |
| **Web support quality**     | Okay (Apple ID)   | Limited         | Poor              | Excellent             |
| **Real-time sync**          | Near-real-time    | Yes (when open) | No                | Yes                   |
| **Background sync (iOS)**   | Yes               | No              | Yes               | Limited               |
| **Conflict resolution**     | Built-in          | DIY             | DIY               | DIY                   |
| **Privacy**                 | Good (iCloud)     | Excellent       | Good (iCloud)     | Excellent             |
| **Implementation effort**   | Medium-High       | High            | Low-Medium        | Medium                |
| **Works across networks**   | Yes               | No              | Yes               | With Tailscale        |
| **Apple ecosystem lock-in** | Yes               | No              | Partial           | No                    |
| **Ongoing costs**           | $99/yr dev acct   | None            | iCloud storage    | None                  |

---

## My Recommendation

**For your specific needs (iOS + macOS + Web, local-first, same user across devices):**

**Start with Option C (Shared Folder)** as the simplest path to get sync working between iOS and macOS. Use a one-file-per-meme approach (each meme is a JSON file + its image) to avoid JSON merge conflicts. This gets you 80% of the way with 20% of the effort.

**Then layer on Option D (Self-Hosted Server)** for web support, since web has the weakest iCloud Drive integration. A tiny server on the Mac could watch the same iCloud Drive folder and serve it to the web app via a REST API — giving you the best of both worlds.

But if **web is a first-class priority equal to iOS/macOS**, skip straight to **Option D** and build a lightweight local server. It's the only option that treats all three platforms equally.
