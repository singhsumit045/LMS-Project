# Live Class Architecture & Flow Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         TEACHER BROWSER (PC)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ PREVIEW STAGE                                                   │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Video Preview Dialog                         │                  │
│  │ ├─ getUserMedia() → Camera + Mic            │                  │
│  │ ├─ Display live video in dialog             │                  │
│  │ └─ User clicks "Join Class"                 │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  2️⃣ CONNECTION STAGE                                               │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Socket.IO Connection                        │                  │
│  │ ├─ Connect to ws://192.168.5.47:3000       │                  │
│  │ ├─ Send JWT token for auth                 │                  │
│  │ └─ Receive socket-authenticated event       │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  3️⃣ ROOM STAGE                                                     │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Join Live Class Room                        │                  │
│  │ ├─ Emit "join-live-class" event            │                  │
│  │ ├─ Get existing participants list          │                  │
│  │ └─ Receive "joined-live-class" event        │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  4️⃣ WEBRTC STAGE                                                   │
│  ┌──────────────────────────────────────────────┐                  │
│  │ WebRTC Peer Connections                    │                  │
│  │ ├─ For each student: createPeerConnection() │                  │
│  │ ├─ Send WebRTC offer                       │                  │
│  │ ├─ Receive WebRTC answer                   │                  │
│  │ ├─ Exchange ICE candidates                 │                  │
│  │ └─ Establish P2P connection                │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  5️⃣ CONNECTED STAGE                                                │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Live Classroom Ready                        │                  │
│  │ ├─ See own video in grid                   │                  │
│  │ ├─ See all student videos                  │                  │
│  │ ├─ Can toggle camera/mic                   │                  │
│  │ ├─ Can start screen share                  │                  │
│  │ └─ View participants list                  │                  │
│  └──────────────────────────────────────────────┘                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ WS Connection
                              ↕ WebRTC Data
┌─────────────────────────────────────────────────────────────────────┐
│                       NestJS BACKEND (Server)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  live-class.gateway.ts (Main Gateway)                              │
│  ├─ CORS: origin: process.env.FRONTEND_URL ✅                     │
│  ├─ handleConnection() → JWT verification                         │
│  ├─ handleJoinLiveClass() → Room management                       │
│  ├─ handleOffer() → Route WebRTC offer                            │
│  ├─ handleAnswer() → Route WebRTC answer                          │
│  └─ handleIceCandidate() → Route ICE candidates                   │
│                                                                      │
│  presence.gateway.ts (Presence Tracking)                          │
│  ├─ CORS: origin: process.env.FRONTEND_URL ✅                     │
│  ├─ handleConnection() → User online                              │
│  └─ handleDisconnect() → User offline                             │
│                                                                      │
│  main.ts (CORS Configuration)                                      │
│  └─ enableCors() → Uses process.env.FRONTEND_URL ✅               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
                              ↕ WS Connection
┌─────────────────────────────────────────────────────────────────────┐
│                        STUDENT BROWSER (Mobile)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1️⃣ NO PREVIEW (Student role)                                      │
│     Directly proceeds to connection                               │
│           ↓                                                          │
│  2️⃣ CONNECTION STAGE                                               │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Socket.IO Connection                        │                  │
│  │ ├─ Connect to ws://192.168.5.47:3000       │                  │
│  │ ├─ CORS check: ✅ Allows 192.168.5.47      │                  │
│  │ ├─ Send JWT token                         │                  │
│  │ └─ Receive socket-authenticated event      │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  3️⃣ ROOM STAGE                                                     │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Join Live Class Room                        │                  │
│  │ ├─ Emit "join-live-class" event            │                  │
│  │ ├─ Get teacher info                        │                  │
│  │ └─ Ready for WebRTC                        │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  4️⃣ WEBRTC STAGE                                                   │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Receive WebRTC Offer from Teacher           │                  │
│  │ ├─ Receive "webrtc-offer" event            │                  │
│  │ ├─ Create RTCPeerConnection                │                  │
│  │ ├─ Set remote description (offer)          │                  │
│  │ ├─ Create answer                           │                  │
│  │ ├─ Send answer back to teacher             │                  │
│  │ └─ Exchange ICE candidates                 │                  │
│  └──────────────────────────────────────────────┘                  │
│           ↓                                                          │
│  5️⃣ CONNECTED STAGE                                                │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Viewing Live Class                         │                  │
│  │ ├─ See teacher's video stream              │                  │
│  │ ├─ Can toggle own camera/mic               │                  │
│  │ └─ Optionally share own video              │                  │
│  └──────────────────────────────────────────────┘                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Event Flow Sequence

### Teacher Connection Sequence

```
Timeline                  Client Action              Server Response
────────────────────────────────────────────────────────────────────
   0ms  Component Mounts
          ├─ Check role = "teacher"
          ├─ Call openVideoPreview()
          │   └─ Show Dialog + video

 1000ms  User Clicks "Join Class"
          ├─ Close preview dialog
          ├─ Call connectSocket()
          └─ Create io() connection

 1500ms                                  ←─ CORS Check (ALLOW)
                                         ←─ Socket connects

 1600ms  Send auth token                 
          ├─ auth: { token, access_token }
          └─ Handshake complete

 1700ms                                  ←─ handleConnection() fires
                                         ←─ Verify JWT
                                         ←─ Emit socket-authenticated

 1800ms  Receive "socket-authenticated"
          ├─ setSocketConnected(true)
          ├─ Set userId, role
          └─ Call joinLiveClass()

 1900ms  Emit "join-live-class"
          └─ { liveClassId: X }

 2000ms                                  ←─ handleJoinLiveClass() fires
                                         ←─ Join room: "live-class-X"
                                         ←─ Get participants list
                                         ←─ Emit joined-live-class

 2100ms  Receive "joined-live-class"
          ├─ setJoined(true)
          ├─ Get participants array
          ├─ For each participant:
          │  └─ Call createOffer()
          └─ setConnecting(false)

 2200ms  Emit "webrtc-offer" to students
          └─ For each student WebRTC

 2300ms                                  ←─ Relay offers to students
                                         ←─ Students respond with answers

 2500ms  Receive "webrtc-answer"
          ├─ Set remote description
          └─ Connection established

 2600ms  Exchange ICE candidates        ←─ Route ICE packets

 3000ms  Status: "Connected" ✅
          └─ Video stream flowing
```

### Student Connection Sequence

```
Timeline                  Client Action              Server Response
────────────────────────────────────────────────────────────────────
   0ms  Component Mounts
          ├─ Check role = "student"
          └─ NO preview dialog (skip)

 500ms  Call connectSocket()
         └─ Create io() connection

1000ms                                  ←─ CORS Check (ALLOW from FRONTEND_URL)
                                        ←─ Socket connects

1100ms  Send auth token
         ├─ auth: { token, access_token }
         └─ Handshake complete

1200ms                                  ←─ handleConnection() fires
                                        ←─ Verify JWT
                                        ←─ Emit socket-authenticated

1300ms  Receive "socket-authenticated"
         ├─ setSocketConnected(true)
         ├─ Set userId, role
         └─ Call joinLiveClass()

1400ms  Emit "join-live-class"
         └─ { liveClassId: X }

1500ms                                  ←─ handleJoinLiveClass() fires
                                        ←─ Join room: "live-class-X"
                                        ←─ Notify teacher: participant-joined
                                        ←─ Emit joined-live-class

1600ms  Receive "joined-live-class"
         ├─ setJoined(true)
         └─ setConnecting(false)

1700ms  Receive "webrtc-offer" from teacher
         ├─ createPeerConnection()
         ├─ addIceCandidate handlers
         ├─ Set remote description (offer)
         ├─ Create answer
         └─ Emit "webrtc-answer"

1800ms                                  ←─ Relay answer back to teacher

2000ms  Start exchanging ICE candidates ←─ Route ICE candidates

2500ms  Status: "Connected" ✅
         └─ Receive teacher's video stream
```

---

## 🎬 Screen Share Flow

```
Timeline                  Action
────────────────────────────────────
   0ms  Teacher Clicks Screen Share
        └─ screenSharing = true

 100ms  Call startScreenShare()
        ├─ getDisplayMedia()
        └─ Browser shows dialog

 500ms  User Selects Screen
        ├─ Get screen stream
        └─ Replace video track in all connections

 600ms  For each RTCPeerConnection:
        ├─ Get videoSender
        ├─ sender.replaceTrack(screenTrack)
        └─ Send renegotiation (if needed)

 700ms  Status: Screen Share Active ✅
        ├─ Button turns GREEN
        └─ All students see screen

        [... Teacher can toggle back to camera ...]

2000ms  Teacher Clicks Screen Share Again
        ├─ stopScreenShare()
        └─ Stop screen stream

2100ms  Replace video track back with camera
        ├─ Get original camera track
        └─ sender.replaceTrack(cameraTrack)

2200ms  Status: Camera Active ✅
        ├─ Button turns GRAY
        └─ All students see camera again
```

---

## 📊 State Management

### Teacher Component State

```javascript
{
  // Connection State
  socketConnected: boolean,
  joined: boolean,
  connecting: boolean,
  
  // Media State
  localStream: MediaStream | null,
  cameraOn: boolean,
  micOn: boolean,
  
  // Preview State
  previewOpen: boolean,
  previewStream: MediaStream | null,
  
  // Screen Share State
  screenSharing: boolean,
  screenShareStream: MediaStream | null,
  
  // UI State
  settingsOpen: boolean,
  showParticipants: boolean,
  videoQuality: "480p" | "720p" | "1080p",
  
  // Data State
  liveClass: object,
  remoteParticipants: array,
  role: "teacher" | "student",
  userId: number,
  
  // Error State
  error: string,
  endingClass: boolean,
  
  // Notifications
  snackbar: {
    open: boolean,
    message: string,
    severity: "info" | "warning" | "error" | "success"
  }
}
```

---

## 🔐 Security Flow

```
Student Browser                         NestJS Backend
────────────────────────────────────────────────────────
Connect Request
    │
    ├─ Send: auth: { token, access_token }
    │
    └─────────────────────────→ receive token
                               ├─ Check if token exists
                               ├─ JwtService.verify(token)
                               ├─ Decode payload.sub (userId)
                               ├─ Decode payload.role (teacher/student)
                               │
                               ├─ IF invalid:
                               │  └─ Emit "socket-auth-error"
                               │     Disconnect socket
                               │
                               └─ IF valid:
                                  ├─ Attach user to socket
                                  ├─ Emit "socket-authenticated"
                                  └─ Accept socket connection
    │
    ←────────────────────────── socket-authenticated
    │
    └─ Now socket is trusted!
        Can join rooms + send events
```

---

## 📡 Message Types

### Socket.IO Events

**Emitted by Client**:
- `join-live-class` → Join room
- `leave-live-class` → Leave room
- `live-class-started` → Teacher starts class
- `live-class-ended` → Teacher ends class
- `webrtc-offer` → Send WebRTC offer
- `webrtc-answer` → Send WebRTC answer
- `webrtc-ice-candidate` → Send ICE candidate

**Received by Client**:
- `socket-authenticated` → Auth success
- `socket-auth-error` → Auth failed
- `joined-live-class` → Joined room successfully
- `participant-joined` → New participant joined
- `participant-left` → Participant left
- `webrtc-offer` → Receive offer from peer
- `webrtc-answer` → Receive answer from peer
- `webrtc-ice-candidate` → Receive ICE candidate
- `live-class-started` → Class started event
- `live-class-ended` → Class ended event
- `live-class-error` → Error event
- `disconnect` → Socket disconnected

---

## 🎯 Data Flow Summary

```
┌─────────────────────────────────────────┐
│   Teacher Loads Page                    │
├─────────────────────────────────────────┤
│   ├─ Load user profile (role check)     │
│   ├─ Load live class details            │
│   ├─ IF teacher: openVideoPreview()     │
│   └─ connectSocket()                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   WebRTC Peer Connections               │
├─────────────────────────────────────────┤
│   ├─ For each student:                  │
│   │  ├─ createPeerConnection()          │
│   │  ├─ Send offer                      │
│   │  ├─ Receive answer                  │
│   │  └─ Exchange ICE candidates         │
│   └─ All connections established        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Video Streaming                       │
├─────────────────────────────────────────┤
│   ├─ Teacher → Students (video/audio)   │
│   ├─ Students → Teacher (optional)      │
│   └─ Real-time media flow               │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│   Teacher Controls                      │
├─────────────────────────────────────────┤
│   ├─ Toggle camera/mic                  │
│   ├─ Start/stop screen share            │
│   ├─ View participants                  │
│   ├─ Check settings/status              │
│   └─ End class                          │
└─────────────────────────────────────────┘
```

---

## ✅ Verification Points

When everything is working:

```
✓ Teacher preview shows live camera feed
✓ Student connection doesn't get stuck
✓ WebRTC connections established for all peers
✓ Video/audio flows smoothly
✓ Screen share switches to teacher's screen
✓ Camera/mic toggles work correctly
✓ Participants list updates in real-time
✓ Settings show correct connection status
✓ No CORS errors in console
✓ No connection/authentication errors
```

---

## 🎓 Key Technical Points

1. **CORS with Environment Variables**
   - Single source of truth: `FRONTEND_URL`
   - Used by multiple gateways

2. **WebRTC Track Replacement**
   - For screen share: replace video track
   - For camera switch: replace video track back
   - No need to renegotiate entire connection

3. **Socket.IO Auth**
   - Token sent in handshake.auth
   - Verified with JWT service
   - Socket data attached with user info

4. **Room Management**
   - Teacher joins room immediately
   - Students added to same room
   - Room broadcasts to all members

5. **Real-time Participants List**
   - Updates from socket events
   - Triggers state update via callback
   - Component re-renders with new data
