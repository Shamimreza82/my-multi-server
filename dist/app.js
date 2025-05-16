"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const genai_1 = require("@google/genai");
const db_1 = require("./shared/config/db");
const rootRouter_1 = require("./shared/rootRouter");
const globalErrorHandler_1 = require("./shared/middlewares/globalErrorHandler");
const seeds_1 = require("./shared/config/seeds");
dotenv_1.default.config();
(0, seeds_1.seeds)(); // seed your DB
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
// Your existing REST endpoints
app.use('/api/v1', rootRouter_1.RootRouter);
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
app.use(globalErrorHandler_1.globalErrorHandler);
// ————————————————
// Socket.IO integration
// ————————————————
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*', credentials: true },
});
io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);
    // Let client join a “room” named after the sessionId
    socket.on('join_session', (sessionId) => {
        if (!sessionId)
            return;
        socket.join(sessionId);
        console.log(`✅ Socket ${socket.id} joined session ${sessionId}`);
    });
    // Handle client asking the AI
    socket.on('ask_ai', (_a) => __awaiter(void 0, [_a], void 0, function* ({ sessionId, prompt }) {
        var _b;
        if (!sessionId || !prompt) {
            socket.emit('ai_error', 'sessionId and prompt are required');
            return;
        }
        try {
            // 1) Fetch last 5 messages
            const history = yield db_1.prisma.message.findMany({
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
                   ----------
                    Whenever the user says “how are you,” reply with: “i am fine—thank you! How can I help you today?” line.
                    Whenever the user says “who are you” reply with: “I am shamim reza full stack web developer how can i help” line.
 


                    rember dont code example answer only website related 
                    `;
            // 3) Call Gemini
            const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
            const aiResp = yield ai.models.generateContent({
                model: 'gemini-2.0-flash',
                contents: [{ role: "user", parts: [{ text: `${myProfile}\n\nQuestion: ${formatted}` }] }],
            });
            const text = (_b = aiResp.text) !== null && _b !== void 0 ? _b : '';
            // 4) Persist
            yield db_1.prisma.message.create({ data: { sessionId, prompt, response: text } });
            // 5) Broadcast back to everyone in this session room
            io.to(sessionId).emit('ai_response', { text, sessionId });
        }
        catch (err) {
            console.error(err);
            socket.emit('ai_error', 'Internal Server Error');
        }
    }));
    socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});
// Start listening on your HTTP+Socket server
const PORT = process.env.SPORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
exports.default = app;
