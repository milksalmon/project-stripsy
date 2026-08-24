import Session from '../models/session.js';
import { createRoom, joinRoom, findRoomBySocket, leaveRoom, updateRoomSettings, getRoom, deleteRoom } from '../state/rooms.js'
import { generateSessionContent } from '../services/gemini.js';

const MAX_PANELS = 4;

const registerSocketHandlers = (io, socket, ai) => {
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

    const panelOwners = assignPanelOwners(room.participants);

    let comicTitle, panelTitles;
    try {
      ({ comicTitle, panelTitles } = await generateSessionContent(ai, room.themePrompt, MAX_PANELS));
    } catch (err) {
      console.error(err);
      return callback({ error: 'Failed to generate comic content.' });
    }

    const session = await Session.create({
      roomCode: code,
      participants: room.participants.map(p => ({ username: p.username, accountId: null })),
      timerDuration: room.timerDuration,
      themePrompt: room.themePrompt,
      comicTitle,
      panelTitles,
      panels: panelOwners.map(ownerIndex => ({ strokes: [], ownerIndex })),
    });

    deleteRoom(code);

    io.to(code).emit('session:started', {
      sessionId: session._id,
      participants: room.participants,
      panelOwners,
      comicTitle,
      panelTitles,
      timerDuration: session.timerDuration,
    });

    callback({ sessionId: session._id });
  });


  socket.on('panel:submit', async ({ sessionId, panelIndex, strokes }, callback) => {
    try {
      const session = await Session.findById(sessionId);
      if (!session) return callback({ error: 'Session not found.' });

      session.panels[panelIndex].strokes = strokes;
      session.panels[panelIndex].submitted = true;
      await session.save();

      const allSubmitted = session.panels.every((p) => p.submitted);
      if (allSubmitted) {
        const code = session.roomCode;
        session.roomCode = undefined;
        await session.save();
        if (code) io.to(code).emit('session:revealed', { sessionId: session._id });
      }

      callback({});
    } catch (err) {
      console.error(err);
      callback({ error: 'Failed to submit panel.' });
    }
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

function assignPanelOwners(participants) {
  const n = participants.length;
  const base = Math.floor(MAX_PANELS / n);
  const remainder = MAX_PANELS % n;

  const shuffledIndices = participants.map((_, i) => i).sort(() => Math.random() - 0.5);

  const owners = [];
  shuffledIndices.forEach((participantIndex, i) => {
    const count = base + (i < remainder ? 1 : 0);
    for (let k = 0; k < count; k++) owners.push(participantIndex);
  });

  return owners.sort(() => Math.random() - 0.5);
}

export default registerSocketHandlers;
