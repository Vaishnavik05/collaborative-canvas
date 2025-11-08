class WebSocketClient {
  constructor() {
    this.socket = io();
    this.userId = null;
    this.userColor = null;
    this.setupSocketListeners();
  }

  setupSocketListeners() {
    this.socket.on('connect', () => {
      document.getElementById('connection-status').textContent = 'Connected';
      document.getElementById('connection-status').className = 'connected';
    });

    this.socket.on('disconnect', () => {
      document.getElementById('connection-status').textContent = 'Disconnected';
      document.getElementById('connection-status').className = 'disconnected';
    });

    this.socket.on('user-id', (id) => {
      this.userId = id;
    });

    this.socket.on('initial-state', (state) => {
      if (state.strokes && state.strokes.length > 0) {
        state.strokes.forEach(stroke => {
          if (window.canvas) window.canvas.drawStroke(stroke);
        });
      }
    });

    this.socket.on('users-update', (users) => {
      this.updateUsersList(users);
    });

    this.socket.on('draw', (data) => {
      if (window.canvas) window.canvas.drawRemoteLine(data);
    });

    this.socket.on('cursor-move', (data) => {
      this.updateRemoteCursor(data);
    });

    this.socket.on('clear-canvas', () => {
      if (window.canvas) window.canvas.clearCanvas();
    });

    this.socket.on('redraw-canvas', (strokes) => {
      if (window.canvas) window.canvas.redrawAllStrokes(strokes);
    });
  }

  joinRoom(userData) {
    this.userColor = userData.color;
    this.socket.emit('user-join', userData);
  }

  startDrawing() {
    this.socket.emit('draw-start');
  }

  sendDrawing(data) {
    this.socket.emit('draw', data);
  }

  endDrawing() {
    this.socket.emit('draw-end');
  }

  sendCursorPosition(x, y) {
    this.socket.emit('cursor-move', { x, y });
  }

  clearCanvas() {
    this.socket.emit('clear-canvas');
  }

  undo() {
    this.socket.emit('undo');
  }

  redo() {
    this.socket.emit('redo');
  }

  updateUsersList(users) {
    const usersList = document.getElementById('users-list');
    usersList.innerHTML = '';
    users.forEach(user => {
      const userItem = document.createElement('div');
      userItem.className = 'user-item';
      const colorDot = document.createElement('div');
      colorDot.className = 'user-color';
      colorDot.style.background = user.color;
      const userName = document.createElement('span');
      userName.className = 'user-name';
      userName.textContent = user.name;
      userItem.appendChild(colorDot);
      userItem.appendChild(userName);
      usersList.appendChild(userItem);
    });
  }

  updateRemoteCursor(data) {
    const cursorsContainer = document.getElementById('cursors');
    let cursor = document.getElementById(`cursor-${data.userId}`);
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = `cursor-${data.userId}`;
      cursor.className = 'cursor';
      cursor.style.background = data.color || '#FF6B6B';
      const label = document.createElement('div');
      label.className = 'cursor-label';
      label.textContent = data.userId.substring(0, 6);
      cursor.appendChild(label);
      cursorsContainer.appendChild(cursor);
    }
    cursor.style.left = data.x + 'px';
    cursor.style.top = data.y + 'px';
  }
}