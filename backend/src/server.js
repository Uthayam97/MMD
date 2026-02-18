const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const { setIO } = require("./socket");
const { parseOrigins } = require("./config/cors");

dotenv.config();

const port = process.env.PORT || 5000;
const socketOrigins = parseOrigins(process.env.SOCKET_CORS_ORIGIN || process.env.CORS_ORIGIN);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: socketOrigins.includes("*") ? "*" : socketOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Unauthorized socket"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.id || decoded?._id;
    if (!userId) {
      return next(new Error("Invalid token payload"));
    }

    socket.user = {
      ...decoded,
      id: userId.toString(),
    };
    return next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.user.id}`);
  if (socket.user.role === "admin") {
    socket.join("admins");
  }
});

setIO(io);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
