import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';
// pass 1, 2, 3, or 4 as an arg
const PARTICIPANT_COUNT = Number(process.argv[2] ?? 1); 

const sockets = Array.from({ length: PARTICIPANT_COUNT }, () => io(SERVER_URL));

const wait = (event, socket) =>
new Promise((resolve) => socket.once(event, resolve));

async function run() {
await Promise.all(sockets.map((s) => wait('connect', s)));

const host = sockets[0];
const { code } = await new Promise((resolve) =>
    host.emit('room:create', { username: 'Host' }, resolve)
);
console.log('Room created:', code);

for (let i = 1; i < sockets.length; i++) {
    await new Promise((resolve) =>
    sockets[i].emit('room:join', { code, username: `Guest${i}` }, resolve)
    );
}
console.log(`${sockets.length} participant(s) in room`);

const result = await new Promise((resolve) =>
    host.emit('room:start', { code }, resolve)
);
console.log('room:start result:', result);

sockets.forEach((s) => s.disconnect());
}

run();