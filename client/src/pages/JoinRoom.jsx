import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '@/context/useRoom.js';
import { socket } from '@/socket.js';
import { createRoom, joinRoom, deriveIsHost } from '@/services/roomService.js';

const JoinRoom = () => {
const navigate = useNavigate();
const { setRoom, setCode, setIsHost } = useRoom();

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
    setError('');
    try {
        const { room } = await joinRoom(roomCode.trim().toUpperCase(), username.trim());
        enterRoom(roomCode.trim().toUpperCase(), room);
    } catch (err) {
        setError(err.error ?? 'Could not join room.');
    }
};

const handleCreate = async () => {
    setError('');
    try {
        const { code, room } = await createRoom(username.trim());
        enterRoom(code, room);
    } catch (err) {
        setError(err.error ?? 'Could not create room.');
    }
};

return (
    <div className='flex items-center justify-center gap-24 pt-32'>
    <div className='flex flex-col gap-2'>
        <h1 className='text-8xl'>
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
            disabled={!roomCode.trim() || !username.trim()}
            className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
        >
        JOIN ROOM
        </button>

        <p className='text-peach text-center'>OR</p>

        <button
            onClick={handleCreate}
            disabled={!username.trim()}
            className='cursor-pointer rounded-md bg-peach text-maroon-card px-4 py-3 text-2xl disabled:opacity-50 disabled:cursor-not-allowed'
        >
        CREATE A NEW ROOM
        </button>

        <p className='text-white text-center text-sm mt-2'>
            HAVE AN ACCOUNT? <span className='text-peach'>LOG IN</span>
        </p>
    </div>
    </div>
);
};

export default JoinRoom;