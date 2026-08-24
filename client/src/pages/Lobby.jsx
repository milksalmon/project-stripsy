import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { useRoom } from '@/context/useRoom.js';
import { leaveRoom, updateRoomSettings } from '@/services/roomService.js';
import ParticipantSlot from '@/components/ParticipantSlot';
import SessionSettingsPanel from '@/components/SessionSettingsPanel';
import settingsIcon from '@/assets/icons/settings.png';
import { startSession } from '../services/roomService.js';
import { useSession } from '../context/useSession.js';

const MAX_PANELS = 4;

const Lobby = () => {
  const navigate = useNavigate()
  const { sessionId } = useSession();
  const { room, code, isHost, setRoom, setCode, setIsHost } = useRoom();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!room || !code) navigate('/');
  }, [room, code, navigate]);

  useEffect(() => {
    if (sessionId) navigate('/canvas');
  }, [sessionId, navigate]);

  if (!room || !code) return null;

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleStart = async () => {
    try {
      await startSession(code);
    } catch (err) {
      console.error(err.error ?? 'Could not start session.');
    }
  };

  const handleLeave = async () => {
    await leaveRoom(code);
    setRoom(null);
    setCode(null);
    setIsHost(false);
    navigate('/');
  };

  const handleApplySettings = ({ timer, theme }) => {
      updateRoomSettings(code, { timerDuration: timer, themePrompt: theme })
        .then(({ room }) => setRoom(room))
        .catch((err) => console.error(err.error ?? 'Could not update settings.'));
  };

  return (
    <div className='flex flex-col items-center pt-12 gap-10'>
      <button onClick={handleLeave} className='cursor-pointer absolute top-6 left-6 text-white text-3xl'>
        ←
      </button>

      <h1 className='text-9xl'>
        <span className='text-white'>STRIP</span>
        <span className='text-orange-400'>SY</span>
      </h1>

      <div className='flex flex-col items-center gap-1'>
        <span className='text-peach text-lg tracking-[0.2em]'>ROOM CODE</span>
        <span onClick={copyRoomCode} className='text-white text-5xl cursor-pointer hover:text-orange-200 transition-colors'>
          {copied ? 'COPIED!' : code}
        </span>
      </div>

      <div className='flex items-start gap-2'>
        <div className='relative'>
          <div className='bg-maroon-card rounded-lg p-6 w-150'>
            <p className='text-peach text-center text-3xl mb-5'>{MAX_PANELS} PANELS, SEALED UNTIL REVEAL</p>

            <div className='grid grid-cols-4 gap-3 mb-5'>
              {Array.from({ length: MAX_PANELS }).map((_, i) => (
                <ParticipantSlot key={i} number={i + 1} participant={room.participants[i]} />
              ))}
            </div>

            <div className='flex gap-3'>
              {isHost ? (
                <button onClick={handleStart} className='cursor-pointer flex-auto rounded-md text-maroon-card bg-peach px-4 py-3 text-3xl'>
                  START DRAWING!
                </button>
              ) : (
                <button disabled className='flex-auto rounded-md text-white/60 bg-maroon-slot px-4 py-3 text-3xl cursor-not-allowed'>
                  WAITING FOR HOST TO START
                </button>
              )}
            </div>
          </div>

          {isHost && (
            <div className='absolute top-0 -right-2 translate-x-full'>
              <Popover>
                <PopoverTrigger className='bg-peach text-maroon-card rounded-md p-3 cursor-pointer'>
                  <img className='w-7.5' src={settingsIcon} alt='SETTINGS' />
                </PopoverTrigger>
                <PopoverContent>
                  <SessionSettingsPanel
                    timerDuration={room.timerDuration}
                    themePrompt={room.themePrompt}
                    onApply={handleApplySettings}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lobby;