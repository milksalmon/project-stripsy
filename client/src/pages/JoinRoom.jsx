import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/useRoom.js';
import { socket } from '@/socket.js';
import { createRoom, joinRoom, deriveIsHost } from '@/services/roomService.js';
import LoadingIndicator from '@/components/LoadingIndicator';
import AuthMenu from '@/components/AuthMenu';
import { useAuth } from '@/context/useAuth.js';

const JoinRoom = () => {
    const navigate = useNavigate();
    const { setRoom, setCode, setIsHost } = useRoom();
    const { user } = useAuth();

    const [ isJoining, setIsJoining ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(false);

    useEffect(() => {
        socket.connect();
    }, []);

    const [roomCode, setRoomCode] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const enterRoom = (code, room) => {
        setRoom(room);
        setCode(code);
        setIsHost(deriveIsHost(room));
        navigate('/lobby');
    };

    const handleJoin = async () => {
        setIsJoining(true);
        setError('');
        try {
            const { room } = await joinRoom(roomCode.trim().toUpperCase(), username.trim(), user?.id ?? null);
            enterRoom(roomCode.trim().toUpperCase(), room);
        } catch (err) {
            setError(err.error ?? 'Could not join room.');
        } finally {
            setIsJoining(false);
        }
    };

    const handleCreate = async () => {
        setIsCreating(true);
        setError('');
        try {
            const { code, room } = await createRoom(username.trim(), user?.id ?? null);
            enterRoom(code, room);
        } catch (err) {
            setError(err.error ?? 'Could not create room.');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className='relative flex items-center justify-center gap-24 min-h-screen'>
        <div className='absolute top-6 right-6'>
            <AuthMenu />
        </div>
        <div className='flex flex-col gap-2'>
            <h1 className='flex text-8xl items-center justify-center'>
            <span className='text-white'>STRIP</span>
            <span className='text-orange-400'>SY</span>
            </h1>
            <p className='text-peach text-xl tracking-widest'>4 PANELS, SEALED UNTIL REVEAL</p>
        </div>

        <div className='bg-maroon-card rounded-lg p-8 w-100 flex flex-col gap-4'>
            <h2 className='text-white text-3xl text-center mb-2'>JOIN A ROOM</h2>

            <div className='flex flex-col gap-1'>
            <label className='text-peach text-sm tracking-[0.15em] text-center'>ROOM CODE</label>
            <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder='E.G. NITW42'
                className='bg-maroon-slot rounded-md px-4 py-3 text-white placeholder-white/40 text-center'
            />
            </div>

            <div className='flex flex-col gap-1'>
            <label className='text-peach text-sm tracking-[0.15em] text-center'>YOUR NAME IN THIS ROOM</label>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='bg-maroon-slot rounded-md px-4 py-3 text-white text-center'
            />
            </div>

            {error && <p className='text-orange-300 text-sm text-center'>{error}</p>}

            <button
                onClick={handleJoin}
                disabled={!roomCode.trim() || !username.trim()  || isJoining || isCreating}
                className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
            {isJoining? <LoadingIndicator/> : 'JOIN ROOM'}
            </button>

            <p className='text-peach text-center'>OR</p>

            <button
                onClick={handleCreate}
                disabled={!username.trim()  || isJoining || isCreating}
                className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
            >
            {isCreating? <LoadingIndicator/> : 'CREATE A NEW ROOM'}
            </button>
        </div>
        </div>
    );
};

export default JoinRoom;