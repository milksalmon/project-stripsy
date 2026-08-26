import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SERVER_URL, {
  // connect manually when the user actually joins a session
  autoConnect: false
});