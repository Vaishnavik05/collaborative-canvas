class DrawingState {
  constructor() {
    this.strokes = [];
    this.undoneStrokes = [];
    this.users = new Map();
    this.currentStrokes = new Map();
  }

  addUser(userId, userData) {
    this.users.set(userId, {
      id: userId,
      color: userData.color || this.generateColor(),
      name: userData.name || `User ${this.users.size + 1}`
    });
  }

  removeUser(userId) {
    this.users.delete(userId);
    this.currentStrokes.delete(userId);
  }

  getUsers() {
    return Array.from(this.users.values());
  }

  startNewStroke(userId) {
    this.currentStrokes.set(userId, {
      id: Date.now() + '-' + userId,
      userId: userId,
      lines: [],
      timestamp: Date.now()
    });
  }

  addDrawing(drawData, userId) {
    const stroke = this.currentStrokes.get(userId);
    if (stroke) stroke.lines.push(drawData);
  }

  endStroke(userId) {
    const stroke = this.currentStrokes.get(userId);
    if (stroke && stroke.lines.length > 0) {
      this.strokes.push(stroke);
      this.currentStrokes.delete(userId);
      this.undoneStrokes = [];
    }
  }

  undo() {
    if (this.strokes.length > 0) {
      const removed = this.strokes.pop();
      this.undoneStrokes.push(removed);
      return removed;
    }
    return null;
  }

  redo() {
    if (this.undoneStrokes.length > 0) {
      const restored = this.undoneStrokes.pop();
      this.strokes.push(restored);
      return restored;
    }
    return null;
  }

  clearCanvas() {
    this.strokes = [];
    this.undoneStrokes = [];
    this.currentStrokes.clear();
  }

  getState() {
    return { strokes: this.strokes };
  }

  getAllStrokes() {
    return this.strokes;
  }

  generateColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = DrawingState;