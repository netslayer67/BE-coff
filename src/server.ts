import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { initializeSocketIO } from './services/socket.service';
import connectDB from './config/db';
import config from './config';

const server = http.createServer(app);


// --- PERBAIKAN DI SINI ---
const allowedOrigins = [
    'http://localhost:5173',      // Untuk Vite standar
    'https://localhost:5173',     // Untuk jika Anda menggunakan SSL lagi
    'https://coffee-flame-five.vercel.app' // Untuk production
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Izinkan jika origin ada di dalam daftar, atau jika tidak ada origin (seperti dari Postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"]
  }
});

initializeSocketIO(io);

const startServer = async () => {
  await connectDB();
  server.listen(config.port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${config.port}`);
  });
};

startServer();