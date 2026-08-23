import Session from '../models/session.js';
import { createRoom, joinRoom, findRoomBySocket, leaveRoom, updateRoomSettings, getRoom, deleteRoom } from '../state/rooms.js'

const registerSocketHandlers = (io, socket) => {
  socket.on('room:create', ({ username }, callback) => {
    const { code, room } = createRoom(socket.id, username);
    socket.join(code);
    callback({ code, room });
  })

  socket.on('room:join', ({ code, username }, callback) => {
    const result = joinRoom(code, socket.id, username);
    if (result.error) {
      callback(result);
      return;
    }
    socket.join(code);
    callback({ room: result.room });
    socket.to(code).emit('room:updated', result.room);
  });

  socket.on('room:leave', ( { code }, callback) => {
    handleLeave(socket, code);
    if (callback) callback({});
  });

  socket.on('disconnect', () => {
    // Take searched socket and disconnect
    const code = findRoomBySocket(socket.id);
    if (code) handleLeave(socket, code);
  });

  socket.on('room:updateSettings', ({ code, settings }, callback) => {
    const result = updateRoomSettings(code, socket.id, settings);

    if (result.error) {
      callback(result);
      return;
    }
    callback({ room: result.room });

    socket.to(code).emit('room:updated', result.room);
  })

  socket.on('room:start', async ({ code }, callback) => {
    const room = getRoom(code);
    if (!room) return callback({ error: 'Room not found.' });

    const participant = room.participants.find(p => p.socketId === socket.id);
    if (!participant || !participant.isHost) {
      return callback({ error: 'Only the host can start the session.' });
    }

    const shuffled = [...room.participants].sort(() => Math.random() - 0.5);

    const session = await Session.create({
      roomCode: code,
      participants: shuffled.map(p => ({ username: p.username, accountId: null })),
      timerDuration: room.timerDuration,
      themePrompt: room.themePrompt,
      panels: shuffled.map(() => ({ strokes: [] })),
    });

    deleteRoom(code);

    io.to(code).emit('session:started', {
      sessionId: session._id,
      participants: shuffled,
      timerDuration: session.timerDuration,
    });

    callback({ sessionId: session._id });
  });
};

// Closing room
function handleLeave(socket, code) {
  const result = leaveRoom(code, socket.id)
  socket.leave(code);

  if (result.closed) {
    // Socket closes room if host leaves
    socket.to(code).emit('room:closed');
  } else {
    // Keep room if not host
    socket.to(code).emit('room:updated', result.room)
  }
}

export default registerSocketHandlers;
