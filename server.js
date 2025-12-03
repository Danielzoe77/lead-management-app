require("./config/dotenv"); // Load environment variables
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");


const app = express();
connectDB(); // Connect to MongoDB


// Allow CORS
app.use(cors({
  origin: ["https://lead-management-web-zeta.vercel.app/", "http://localhost:3000","http://192.168.52.126:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middlewares
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    // Check MongoDB connection state
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
      // Connected
      await mongoose.connection.db.admin().ping();
      res.status(200).json({
        status: "OK 👍",
        DB: "✅ connected",
        dbHost: mongoose.connection.host,
      });
    } else if (connectionState === 2) {
      // Connecting
      res.status(200).json({
        status: "OK 👍",
        DB: "⏳ connecting",
        dbHost: mongoose.connection.host,
      });
    } else {
      // Disconnected or disconnecting
      res.status(500).json({
        status: "FAIL 👎",
        DB: "❌ disconnected",
        connectionState: connectionState,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "FAIL 👎",
      DB: "❌ disconnected",
      error: err.message || "Unknown error",
      connectionState: mongoose.connection.readyState,
    });
  }
});

// Routes importing
const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/lead");
// const postRoutes = require("./routes/post.routes");
// const moodRoutes = require("./routes/mood.routes");
// const journalRoutes = require("./routes/journal.routes");
// const supportRoutes = require("./routes/support.routes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/lead", leadRoutes);
// app.use("/api/moods", moodRoutes);
// app.use("/api/journals", journalRoutes);
// app.use("/api/support", supportRoutes);

app.get("/", (req, res) => {
  res.send("Hello lead-management app is live!");
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️ Port ${PORT} is in use. Trying a different port...`);
    const fallbackPort = PORT + 1;
    app.listen(fallbackPort, () => {
      console.log(`🚀 Server is now running on port ${fallbackPort}`);
    });
  } else {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
});

