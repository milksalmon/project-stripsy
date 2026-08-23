import { useContext } from 'react';
import { RoomContext } from './roomContext.js';

export const useRoom = () => useContext(RoomContext);
