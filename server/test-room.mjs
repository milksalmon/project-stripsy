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

        host.emit('room:updateSettings', { code, settings: { timerDuration: 90 } }, (settingsResponse) => {
          console.log('Host update response:', JSON.stringify(settingsResponse, null, 2));
          // Testing as a guest
          guest.emit('room:updateSettings', { code, settings: { timerDuration: 10 } }, (rejectResponse) => {
            console.log('Guest update response (should error):', JSON.stringify(rejectResponse, null, 2));
            host.emit('room:updateSettings', { code, settings: { themePrompt: 'A heist gone wrong' } }, (themeResponse) => {
              console.log('Host theme update response:', JSON.stringify(themeResponse, null, 2));

              host.emit('room:updateSettings', { code: 'NOEXIST', settings: { timerDuration: 30 }}, (notFoundResponse) => {
                console.log('Update on nonexistent room (should error):', JSON.stringify(notFoundResponse, null, 2));
                host.disconnect();
                guest.disconnect();
              });
            });

          });
        });
      });
    });

    guest.on('room:updated', (room) => {
      console.log('Guest received room:updated:', JSON.stringify(room, null, 2));
    });

    
  });
});