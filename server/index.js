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

dotenv.config();

const app = express();
const httpServer = createServer(app);

const gemini = process.env.GEMINI_API_KEY;
const port = process.env.PORT || 3000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

connectDB();

const ai = new GoogleGenAI({ apiKey: gemini });

app.use(cors({ origin: clientOrigin, credentials: true }));

app.use(express.json());

app.use(cookieParser());
app.use('/auth', authRouter);

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

app.get('/ai-test', async (req, res) => {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Give 5 random countries",
    });
    res.json({text: interaction.output_text});
    console.log(interaction.output_text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to reach Gemini" });
  }
})

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
})