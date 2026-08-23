import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  // connect manually when the user actually joins a session
  autoConnect: false
});