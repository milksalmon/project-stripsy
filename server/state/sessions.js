// socketId -> { sessionId, panelIndices }
const socketSessions = new Map(); 

export function registerSessionParticipant(socketId, sessionId, panelIndices) {
    socketSessions.set(socketId, { sessionId, panelIndices });
}

export function getSessionForSocket(socketId) {
    return socketSessions.get(socketId);
}

export function clearSessionSocket(socketId) {
    socketSessions.delete(socketId);
}