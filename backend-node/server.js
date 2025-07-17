const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Import routes
const promosRoutes = require("./routes/promos");
const articlesRoutes = require("./routes/articles");
const productsRoutes = require("./routes/products");
const sponsorsRoutes = require("./routes/sponsors");
const commentsRoutes = require("./routes/comments");
const settingsRoutes = require("./routes/settings");
const uploadRoutes = require("./routes/upload");

// Use routes
app.use("/api/promos", promosRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sponsors", sponsorsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
});

// Export for testing
module.exports = app;
