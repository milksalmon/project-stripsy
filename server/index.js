import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connect.js'
import registerSocketHandlers from './sockets/index.js'
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import sessionsRouter from './routes/sessions.js';
import historyRouter from './routes/history.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const gemini = process.env.GEMINI_API_KEY;
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

connectDB();

const ai = new GoogleGenAI({ 
  apiKey: gemini,
  httpOptions: {
    retryOptions: { attempts: 1 },
  },
});

app.use(cors({ origin: clientOrigin, credentials: true }));

app.use(express.json());

app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/sessions', sessionsRouter);
app.use('/history', historyRouter);

// Socket.IO listener
const io = new Server(httpServer, {
  cors: {
    origin: clientOrigin,
  },
});

// Calls handshake with register socket.io
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  registerSocketHandlers(io, socket, ai);

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
})