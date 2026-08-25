import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket.js';
import { SessionContext } from './sessionContext.js';

export const SessionProvider = ({ children }) => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState(null);
    const [comicTitle, setComicTitle] = useState(null);
    const [panelTitles, setPanelTitles] = useState([]);
    const [myPanelIndices, setMyPanelIndices] = useState([]);
    const [timerDuration, setTimerDuration] = useState(null);

    useEffect(() => {
        const handleStarted = ({ sessionId, participants, panelOwners, comicTitle, panelTitles, timerDuration }) => {
            const myParticipantIndex = participants.findIndex(p => p.socketId === socket.id);
            const indices = panelOwners
            .map((ownerIndex, panelIndex) => (ownerIndex === myParticipantIndex ? panelIndex : null))
            .filter((i) => i !== null);

            setTimerDuration(timerDuration);
            setSessionId(sessionId);
            setComicTitle(comicTitle);
            setPanelTitles(panelTitles);
            setMyPanelIndices(indices);
        };

        const handleRevealed = ({ sessionId: revealedId }) => {
            setSessionId(revealedId);
            navigate('/reveal');
        };

        socket.on('session:started', handleStarted);
        socket.on('session:revealed', handleRevealed);
        return () => {
            socket.off('session:started', handleStarted);
            socket.off('session:revealed', handleRevealed);
        }
    }, [navigate]);

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, comicTitle, setComicTitle, panelTitles, setPanelTitles, myPanelIndices, setMyPanelIndices, timerDuration, setTimerDuration }}>
            {children}
        </SessionContext.Provider>
    )
}