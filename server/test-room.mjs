import { io } from 'socket.io-client';

  const host = io('http://localhost:3000');

  host.on('connect', () => {
    host.emit('room:create', { username: 'Louis' }, (createResponse) => {
      console.log('Create response:', JSON.stringify(createResponse, null, 2));

      const { code } = createResponse;
      const guest = io('http://localhost:3000');

      guest.on('connect', () => {
        guest.emit('room:join', { code, username: 'Guest' }, (joinResponse) => {
          console.log('Join response:', JSON.stringify(joinResponse, null, 2));
          host.disconnect();
          guest.disconnect();
        });
      });
    });
  });