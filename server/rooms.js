class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        users: new Set(),
        drawings: [],
        history: []
      });
    }
    return this.rooms.get(roomId);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  addUserToRoom(roomId, userId) {
    const room = this.createRoom(roomId);
    room.users.add(userId);
    return room;
  }

  removeUserFromRoom(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.delete(userId);
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  getRoomUsers(roomId) {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.users) : [];
  }

  getAllRooms() {
    return Array.from(this.rooms.keys());
  }

  getRoomCount() {
    return this.rooms.size;
  }
}

module.exports = RoomManager;