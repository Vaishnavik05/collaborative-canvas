const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const DrawingState = require('./drawing-state');
const RoomManager = require('./rooms');

app.use(express.static(path.join(__dirname, '../client')));

const roomManager = new RoomManager();
const drawingStates = new Map();

function getDrawingState(roomId) {
  if (!drawingStates.has(roomId)) {
    drawingStates.set(roomId, new DrawingState());
  }
  return drawingStates.get(roomId);
}

io.on('connection', (socket) => {
  let currentRoom = 'default';
  let currentUser = null;

  socket.on('user-join', (userData) => {
    socket.join(currentRoom);
    const drawingState = getDrawingState(currentRoom);
    drawingState.addUser(socket.id, userData);
    currentUser = drawingState.users.get(socket.id);
    roomManager.addUserToRoom(currentRoom, socket.id);
    socket.emit('user-id', socket.id);
    socket.emit('initial-state', drawingState.getState());
    io.to(currentRoom).emit('users-update', drawingState.getUsers());
  });

  socket.on('draw-start', () => {
    getDrawingState(currentRoom).startNewStroke(socket.id);
  });

  socket.on('draw', (data) => {
    getDrawingState(currentRoom).addDrawing(data, socket.id);
    socket.to(currentRoom).emit('draw', data);
  });

  socket.on('draw-end', () => {
    getDrawingState(currentRoom).endStroke(socket.id);
  });

  socket.on('cursor-move', (data) => {
    socket.to(currentRoom).emit('cursor-move', {
      userId: socket.id,
      x: data.x,
      y: data.y,
      color: currentUser ? currentUser.color : '#000000'
    });
  });

  socket.on('undo', () => {
    const drawingState = getDrawingState(currentRoom);
    if (drawingState.undo()) {
      io.to(currentRoom).emit('redraw-canvas', drawingState.getAllStrokes());
    }
  });

  socket.on('redo', () => {
    const drawingState = getDrawingState(currentRoom);
    if (drawingState.redo()) {
      io.to(currentRoom).emit('redraw-canvas', drawingState.getAllStrokes());
    }
  });

  socket.on('clear-canvas', () => {
    getDrawingState(currentRoom).clearCanvas();
    io.to(currentRoom).emit('clear-canvas');
  });

  socket.on('disconnect', () => {
    const drawingState = getDrawingState(currentRoom);
    drawingState.removeUser(socket.id);
    roomManager.removeUserFromRoom(currentRoom, socket.id);
    io.to(currentRoom).emit('users-update', drawingState.getUsers());
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});