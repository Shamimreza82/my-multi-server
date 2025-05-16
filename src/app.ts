import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { GoogleGenAI } from '@google/genai';
import { prisma } from './shared/config/db';
import { RootRouter } from './shared/rootRouter';
import { globalErrorHandler } from './shared/middlewares/globalErrorHandler';
import { seeds } from './shared/config/seeds';

dotenv.config();
seeds(); // seed your DB

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: '*',
    credentials: true,
}));

// Your existing REST endpoints
app.use('/api/v1', RootRouter);
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.nPM_PACKAGE_VERSION,
        environment: process.env.NODE_ENV,
        data: { message: 'API is up and running! 🚀' },
    });
});
app.use(globalErrorHandler);

// ————————————————
// Socket.IO integration
// ————————————————


const httpServer = http.createServer(app);


const io = new SocketIOServer(httpServer, {
    cors: { origin: '*', credentials: true },
});



io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Let client join a “room” named after the sessionId
    socket.on('join_session', (sessionId: string) => {
        if (!sessionId) return;
        socket.join(sessionId);
        console.log(`✅ Socket ${socket.id} joined session ${sessionId}`);
    });

    // Handle client asking the AI
    socket.on('ask_ai', async ({ sessionId, prompt }: { sessionId: string; prompt: string }) => {
        if (!sessionId || !prompt) {
            socket.emit('ai_error', 'sessionId and prompt are required');
            return;
        }

        try {
            // 1) Fetch last 5 messages
            const history = await prisma.message.findMany({
                where: { sessionId },
                orderBy: { createdAt: 'desc' },
                take: 5,
            });

            // 2) Build context array
            const contents = history
                .reverse()
                .flatMap(m => [
                    { role: 'user', content: m.prompt },
                    { role: 'assistant', content: m.response },
                ]);
            contents.push({ role: 'user', content: prompt });
            const formatted = contents.map(c => c.content);

            const myProfile = `
                    You are Shamim Reza, your are a full stack web developer.
                    you seeling service web developer.
                    your eamil: shamimrezaone@gmail.com 
                    your phone: +8801531297879
                   
                    Whenever the user says “how are you,” reply with: “i am fine—thank you! How can I help you today?” line.
                    Whenever the user says “who are you” reply with: “I am shamim reza full stack web developer how can i help” line.
 


                    rember dont code example answer only website related 
                    `;





            // 3) Call Gemini
            const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
            const aiResp = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [{ role: "user", parts: [{ text: `${myProfile}\n\nQuestion: ${formatted}` }] }],
            });
            const text = aiResp.text ?? '';

            // 4) Persist
            await prisma.message.create({ data: { sessionId, prompt, response: text } });

            // 5) Broadcast back to everyone in this session room
            io.to(sessionId).emit('ai_response', { text, sessionId });
        } catch (err) {
            console.error(err);
            socket.emit('ai_error', 'Internal Server Error');
        }
    });

    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Start listening on your HTTP+Socket server
const PORT = process.env.SPORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});


export default app