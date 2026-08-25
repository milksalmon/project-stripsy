import { socket } from '../socket.js';

export const submitPanel = (sessionId, panelIndex, strokes) =>
new Promise((resolve, reject) => {
    socket.emit('panel:submit', { sessionId, panelIndex, strokes }, (res) => {
        if (res.error) reject(res);
        else resolve(res);
    });
});