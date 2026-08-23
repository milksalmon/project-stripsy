import { useEffect, useState } from 'react';
import { socket } from '../socket.js';
import { RoomContext } from './roomContext.js';
import { deriveIsHost } from '../services/roomService.js';

export const RoomProvider = ({ children }) => {
    const [room, setRoom] = useState(null);
    const [code, setCode] = useState(null);
    const [isHost, setIsHost] = useState(false);

    useEffect(() => {
        const handleUpdated = (updatedRoom) => {
            console.log('room:updated fired', updatedRoom)
            setRoom(updatedRoom);
            setIsHost(deriveIsHost(updatedRoom));
        };
        const handleClosed = () => {
            console.log('room:closed fired')
            setRoom(null);
            setCode(null);
            setIsHost(false);
        };

        socket.on('room:updated', handleUpdated);
        socket.on('room:closed', handleClosed);

        return () => {
            socket.off('room:updated', handleUpdated);
            socket.off('room:closed', handleClosed);
        };
    }, []);

    return (
        <RoomContext.Provider value={{ room, setRoom, code, setCode, isHost, setIsHost }}>
            {children}
        </RoomContext.Provider>
    )
}