/*const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const materiRoutes = require("./routes/materiRoutes");
const discussionAdminRoutes = require("./routes/admin/discussionAdminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const profileRoutes = require("./routes/profileRoutes");


// REGISTER ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/materi", materiRoutes);
app.use("/api/admin", discussionAdminRoutes);  // <-- INI YANG PENTING
app.use("/api/game", gameRoutes); 
app.use("/api/achievement", achievementRoutes);
app.use("/api/discussion", discussionAdminRoutes);
app.use("/api/profile", profileRoutes);
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
  origin: 'http://localhost:5173',  // Izinkan frontend
  credentials: true
}));

const badgeRoutes = require("./routes/badgeRoutes");
app.use("/api/badges", badgeRoutes); // Tambahkan ini untuk get all badges


module.exports = app;*/
