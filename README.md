# Collaborative Drawing Canvas

A real-time collaborative drawing application where multiple users can draw together on a shared canvas. Built with HTML5 Canvas, Socket.IO, and Express.

## Features

- **Real-time Collaboration**: See other users' drawings as they draw (stroke by stroke)
- **Drawing Tools**: 
  - Pen tool with customizable colors
  - Eraser tool
  - Adjustable brush size (1-50px)
- **Canvas Controls**:
  - Undo/Redo functionality (synced across all users)
  - Clear canvas (affects all users)
- **User Features**:
  - Online users panel showing all active users
  - Color-coded user cursors with real-time tracking
  - Automatic user identification with random colors
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Full touch gesture support for mobile/tablet drawing

## Setup Instructions

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or download the project**
```bash
cd collaborative-canvas
```

2. **Install dependencies and start the server**
```bash
cd server
npm install && npm start
```

3. **Open the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The server will be running on port 3000 by default

### Alternative: Development Mode
For auto-restart on file changes:
```bash
npm run dev
```

## Testing with Multiple Users

### Option 1: Multiple Browser Windows (Same Computer)
1. Start the server: `npm start`
2. Open `http://localhost:3000` in multiple browser windows/tabs
3. Draw in one window and watch it appear in real-time in the others

### Option 2: Multiple Devices (Same Network)
1. Start the server on your computer
2. Find your local IP address:
   - **Windows**: `ipconfig` (look for IPv4 Address)
   - **Mac/Linux**: `ifconfig` or `ip addr` (look for inet)
3. On other devices, open: `http://YOUR_IP_ADDRESS:3000`
4. All devices can now draw together in real-time

### Option 3: Incognito/Private Windows
- Open regular and incognito/private browser windows
- Each acts as a separate user
- Great for testing without multiple devices

## Project Structure

```
collaborative-canvas/
├── server/
│   ├── server.js           # Main server and Socket.IO logic
│   ├── drawing-state.js    # Drawing state management & undo/redo
│   ├── rooms.js            # Room management (multi-room support)
│   └── package.json        # Server dependencies
└── client/
    ├── index.html          # Main HTML structure
    ├── style.css           # Styling and responsive design
    ├── canvas.js           # Canvas drawing logic
    ├── websocket.js        # WebSocket client handling
    └── main.js             # App initialization & event handling
```

## How It Works

1. **Client connects** → Server assigns unique ID and color
2. **User draws** → Each stroke segment sent via WebSocket
3. **Server broadcasts** → All other users receive stroke data instantly
4. **Canvas renders** → Strokes appear in real-time for all users
5. **Actions sync** → Undo, redo, and clear operations affect all users

## Known Limitations/Bugs

### Current Limitations:
1. **No Persistence**: 
   - Drawings are lost when all users leave
   - No database integration 
   
2. **Single Room Only**: 
   - All users join the same default room
   - Multi-room UI not implemented 

3. **No Authentication**:
   - Users are identified by random names (User-XXX)
   - No login or user accounts

4. **Network Dependency**:
   - Requires stable connection for smooth drawing
   - High latency may cause drawing lag

5. **Canvas Size**:
   - Canvas is fixed to container size
   - No zoom or pan functionality
   - Resizing window clears the canvas 

### Potential Issues:
- **Undo/Redo**: Affects the most recent stroke globally (not per-user)
- **Performance**: May slow down with thousands of strokes (no optimization yet)
- **Browser Compatibility**: Tested on modern browsers (Chrome, Firefox, Safari, Edge)

## Technical Stack

### Frontend:
- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- Socket.IO Client
- Font Awesome Icons
- CSS3 (Flexbox, Grid)

### Backend:
- Node.js
- Express.js
- Socket.IO Server
- In-memory data storage

## Author

Built as a collaborative drawing application project.

---

**Enjoy drawing together!🎨**