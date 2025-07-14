import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { initializeSocketIO } from './services/socket.service';
import connectDB from './config/db';
import config from './config';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Ganti dengan domain frontend Anda di produksi
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