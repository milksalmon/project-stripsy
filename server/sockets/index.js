import { createRoom, joinRoom, findRoomBySocket, leaveRoom, updateRoomSettings } from '../state/rooms.js'

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

  socket.on('room:leave', ({ code }) => handleLeave(socket, code));

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
