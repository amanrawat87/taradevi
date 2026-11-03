import mongoose from "mongoose";
import dns from "dns";

// ─── DNS Fix ─────────────────────────────────────────────────────────────────
// Local ISP/router DNS sometimes fails to resolve MongoDB Atlas SRV records.
// Force Google DNS in this process before any mongoose connection.
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Ignore in restricted environments
}

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ Warning: MONGODB_URI is not defined in environment variables.");
}

// Cache the connection across hot-reloads in Next.js development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || "taradevis_db",
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
