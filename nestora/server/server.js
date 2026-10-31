
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import propertyRoutes from "./routes/properties.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (for example, health checks) and configured origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to Nestora API!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Nestora API is running!",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Nestora API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
