import { useEffect, useState } from 'react';
import { socket } from '../socket.js';
import { SessionContext } from './sessionContext.js';

export const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(null);
    const [comicTitle, setComicTitle] = useState(null);
    const [panelTitles, setPanelTitles] = useState([]);
    const [myPanelIndices, setMyPanelIndices] = useState([]);

    useEffect(() => {
        const handleStarted = ({ sessionId, participants, panelOwners, comicTitle, panelTitles }) => {
            const myParticipantIndex = participants.findIndex(p => p.socketId === socket.id);
            const indices = panelOwners
            .map((ownerIndex, panelIndex) => (ownerIndex === myParticipantIndex ? panelIndex : null))
            .filter((i) => i !== null);

            setSessionId(sessionId);
            setComicTitle(comicTitle);
            setPanelTitles(panelTitles);
            setMyPanelIndices(indices);
        };

        socket.on('session:started', handleStarted);
        return () => socket.off('session:started', handleStarted);
    }, []);

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, comicTitle, setComicTitle, panelTitles, setPanelTitles, myPanelIndices, setMyPanelIndices }}>
            {children}
        </SessionContext.Provider>
    )
}