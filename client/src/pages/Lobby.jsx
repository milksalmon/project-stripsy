import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { generateRoomCode } from '@/lib/generateRoomCode';
import ParticipantSlot  from '@/components/ParticipantSlot';
import SessionSettingsPanel from '@/components/SessionSettingsPanel';
import settingsIcon from '@/assets/icons/Settings.png';

  const Lobby = () => {
    const navigate = useNavigate();

    // Temporary values. Will be replaced later with Socket.IO.
    const [roomCode] = useState(() => generateRoomCode());
    const [panelCount] = useState(4);
    const [participants] = useState([
      { id: 1, name: 'Louis', host: true },
      { id: 2, name: 'George', host: false },
    ]);

    const [copied, setCopied] = useState(false);

    const copyRoomCode =async () => {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      // Change back to room code after a short time.
      setTimeout(() => setCopied(false), 1500)
    }


    return (



        <div className='flex flex-col items-center pt-12 gap-10'>

          <h1 className='text-9xl'>
            <span className='text-white'>STRIP</span>
            <span className='text-orange-400'>SY</span>
          </h1>

          <div className='flex flex-col items-center gap-1'>
            <span className=' text-orange-300 text-lg tracking-[0.2em]'>ROOM CODE</span>
            <span onClick={copyRoomCode} className=' text-white text-5xl cursor-pointer hover:text-orange-200 transition-colors'>{copied? 'COPIED!' : roomCode}</span>
          </div>

        <div className='flex items-start gap-2'>
          <div className='relative'>
            <div className='bg-maroon-card rounded-lg p-6 w-150'>
              <p className=' text-orange-300 text-center text-3xl mb-5'> {panelCount} PANELS, SEALED UNTIL REVEAL</p>

              <div className='grid grid-cols-4 gap-3 mb-5'>
                {Array.from({ length: panelCount }).map((_, i) => (
                  <ParticipantSlot key={i} number={i + 1} participant={participants[i]}/>
                ))}
              </div>

              <div className='flex gap-3'>
                {/* <button className='flex-initial rounded-md bg-maroon-slot text-orange-300 px-4 py-3 text-2xl'>COPY CODE</button> */}
                <button onClick={() => navigate('/canvas')} className='cursor-pointer flex-auto rounded-md text-maroon-card bg-orange-300 px-4 py-3 text-3xl'>START DRAWING!</button>
              </div>
            </div>

            <div className='absolute top-0 -right-2 translate-x-full'>
              <Popover>
                <PopoverTrigger className='bg-orange-300 text-maroon-card rounded-md p-3 cursor-pointer'>
                  <img src={settingsIcon} alt='SETTINGS' />
                </PopoverTrigger>
                <PopoverContent>
                  <SessionSettingsPanel onApply={(settings) => console.log(settings)} />
                </PopoverContent>
            </Popover>
            
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Lobby;