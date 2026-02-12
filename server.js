require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const sequelize = require("./config/db");
const dashboardRoutes = require("./routes/dashboardRoutes");

require("./models/User");
require("./models/Materi");
require("./models/MateriSection");
require("./models/UserMateriProgress");
require("./models/DiscussionRoom");
require("./models/DiscussionMessage");
require("./models/Badge");
require("./models/UserMateriProgress");



console.log("JWT SECRET:", process.env.JWT_SECRET);


const models = require("./models"); 
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173", methods: ["GET","POST"] } });
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/static", require("./routes/staticRoutes"));
app.use("/api/materi", require("./routes/materiRoutes"));
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));
app.use("/api/achievement", require("./routes/achievementRoutes"));
app.use("/api/game", require("./routes/gameRoutes"));
app.use("/api/discussion", require("./routes/discussionRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/achievement", require("./routes/achievementRoutes")); 
app.use("/api/badges", require("./routes/badgeRoutes")); 
app.use("/api/profile", require("./routes/profileRoutes"));



// admin routes
app.use("/api/admin/users", require("./routes/admin/userAdminRoutes"));
app.use("/api/admin/materi", require("./routes/admin/materiAdminRoutes"));
app.use("/api/admin/submissions", require("./routes/admin/submissionAdminRoutes"));
app.use("/api/admin/discussion", require("./routes/admin/discussionAdminRoutes"));
app.use("/api/admin/achievement", require("./routes/admin/achievementAdminRoutes"));
app.use("/api/admin/leaderboard", require("./routes/admin/leaderboardAdminRoutes"));
app.use("/api/admin/minigame", require("./routes/admin/miniGameAdminRoutes"));
app.use("/api/admin/profile", require("./routes/admin/adminProfileRoutes"));
app.use("/api/admin/badges", require("./routes/admin/badgeAdminRoutes"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/admin", require("./routes/admin/adminRoutes"));
app.use("/api/admin/students", require("./routes/admin/studentAdminRoutes")); 

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    etag: false,
    lastModified: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) {
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Type", "video/mp4");
      }
    },
  })
);




const gameRoutes = require("./routes/gameRoutes");
app.use("/api/game", gameRoutes);




const videoRoutes = require("./routes/videoRoutes");

app.use("/api/video", videoRoutes);





// socket logic
io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  /* ================= JOIN ROOM ================= */
  socket.on("joinRoom", async ({ roomId, userId }, cb) => {
    try {
      const room = await models.DiscussionRoom.findByPk(roomId);
      if (!room) {
        return cb && cb({ status: false, message: "Room tidak ditemukan" });
      }

      const roomKey = `room-${roomId}`; 
      socket.join(roomKey);

      cb && cb({ status: true });

      console.log(`User ${userId} joined room-${roomId}`);  
    } catch (err) {
      console.error("joinRoom error:", err);
      cb && cb({ status: false, message: "Server error" });
    }
  });

  /* ================= LEAVE ROOM ================= */
  socket.on("leaveRoom", ({ roomId, userId }) => {
    socket.leave(`room-${roomId}`);  
    console.log(`User ${userId} left room-${roomId}`);
  });

  /* ================= SEND MESSAGE ================= */
  socket.on("sendMessage", async ({ roomId, userId, message }) => {
    try {
      if (!message || !message.trim()) return;

      const msg = await models.DiscussionMessage.create({
        roomId,
        userId,
        message,
      });

      const user = await models.User.findByPk(userId);

      io.to(`room-${roomId}`).emit("newMessage", { 
        id: msg.id,
        roomId,
        userId,
        userName: user.name,
        userInitial: user.name.charAt(0).toUpperCase(),
        message: msg.message,
        createdAt: msg.createdAt,
      });

      if (message === "[REQUEST_CLUE]") {
  const [[{ used }]] = await sequelize.query(
    `SELECT COUNT(*) AS used 
     FROM discussion_messages 
     WHERE roomId = ? AND message = '[REQUEST_CLUE]'`,
    { replacements: [roomId] }
  );

  io.to(`room-${roomId}`).emit("clue_update", {
    used,
    max: 3
  });
}


    } catch (err) {
      console.error("sendMessage socket error:", err);
    }
    
  });

  socket.on("admin_request_clue", async ({ roomId }) => {
  try {
    const [[{ used }]] = await sequelize.query(
      `SELECT COUNT(*) AS used 
       FROM discussion_messages 
       WHERE roomId = ? AND message = '[REQUEST_CLUE]'`,
      { replacements: [roomId] }
    );

    socket.emit("clue_update", {
      used,
      max: 3
    });

  } catch (err) {
    console.error("admin_request_clue error:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("socket disconnected:", socket.id);
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected and synced");
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log("Server running on http://localhost:" + PORT));
  } catch (err) {
    console.error("DB connection error:", err);
  }
})();