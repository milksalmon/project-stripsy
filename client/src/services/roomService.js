import { socket } from '../socket.js';

export const createRoom = (username, accountId = null) =>
    new Promise((resolve, reject) => {
        socket.emit('room:create', { username, accountId }, (res) => {
            if (res.error) reject(res);
            else resolve(res);
        });
    });

export const joinRoom = (code, username, accountId = null) =>
    new Promise((resolve, reject) => {
        socket.emit('room:join', { code, username, accountId }, (res) => {
            if (res.error) reject(res);
            else resolve(res);
        });
    });

export const leaveRoom = (code) =>
    new Promise((resolve) => {
      socket.emit('room:leave', { code }, () => resolve());
    });

export const updateRoomSettings = (code, settings) =>
    new Promise((resolve, reject) => {
        socket.emit('room:updateSettings', { code, settings }, (res) => {
            if (res.error) reject(res);
            else resolve(res);
        });
    });

export const deriveIsHost = (room) => {
    const me = room.participants.find(p => p.socketId === socket.id);
    return me ? me.isHost : false;
};

export const startSession = (code) =>
new Promise((resolve, reject) => {
    socket.emit('room:start', { code }, (res) => {
    if (res.error) reject(res);
    else resolve(res);
    });
});