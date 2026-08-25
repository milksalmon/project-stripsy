const CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const rooms = new Map();

export function generateRoomCode(length = 6) {
    let code;
    // guard to reset code if generated room code matches existing one.
    do {
        code = '';
        for (let i = 0; i < length; i++) {
        // Math floor to round decimal points to whole number.
        code += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
    } while (rooms.has(code))

    return code;
}

export function createRoom(socketId, username) {
    // room schema
    const room = {
        participants: [
            {
                socketId, 
                username, 
                isHost: true
            }
        ],
        timerDuration: 60,
        themePrompt: '',
        started: false
    };

    const code = generateRoomCode();
    rooms.set(code, room)

    // returning code for socket handler to send it back to client.
    return {code, room};
}

export function joinRoom( code, socketId, username ) {
    const room = rooms.get(code);

    // if room returns undefined
    if (!room) {
        return { error: 'Room not found.'}
    }

    const isDuplicate = room.participants.some(
        p => p.username.trim().toLowerCase() === username.trim().toLowerCase()
    );
    if (isDuplicate) {
        return { error: 'That name is already taken in this room.' };
    }

    room.participants.push({ socketId, username, isHost: false })
    return { room };
}

export function leaveRoom ( code, socketId ) {
    const room = rooms.get(code);

    if (!room) {
        return { closed: true };
    }

    const participant = room.participants.find(p => p.socketId === socketId);
    if (!participant) return { room };

    if (participant.isHost) {
        rooms.delete(code);
        return { closed: true };
    }

    room.participants = room.participants.filter(p => p.socketId !== socketId);
    return { room };
}

export function findRoomBySocket(socketId) {
    // For each content of entry of rooms
    for (const [code, room] of rooms.entries()) {
        // Search to match socketId in room map.
        if (room.participants.some(p => p.socketId === socketId)) {
            return code;
        }
    }
    return null;
}

export function updateRoomSettings(code, socketId, settings) {
    const room = rooms.get(code);
    if (!room) {
        return { error: 'Room not found.'};
    }

    const participant = room.participants.find(p => p.socketId === socketId);
    if (!participant || !participant.isHost) {
        return { error: 'Only the host can update settings.'};
    }

    if (settings.timerDuration !== undefined) room.timerDuration = settings.timerDuration;
    if (settings.themePrompt !== undefined) room.themePrompt = settings.themePrompt;

    return { room };
}

// For session
export function getRoom(code) {
    return rooms.get(code);
}

export function deleteRoom(code) {
    rooms.delete(code);
}