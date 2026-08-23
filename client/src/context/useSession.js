import { useContext } from 'react';
import { SessionContext } from './sessionContext.js';

export const useSession = () => useContext(SessionContext);