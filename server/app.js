const dotEnv = require('dotenv');
dotEnv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const ratelimit = require('express-rate-limit');

const auth = require('./src/routes/auth');
const router = require('./src/routes/api');
const userRoutes = require('./src/routes/userRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const managerRoutes = require('./src/routes/managerRoutes');
const seedRoles = require('./src/utility/seedRoles');

// ------------------- CORS -------------------
const allowedOrigins = [
  'http://localhost:5173',         // local dev
  'https://taskly24.netlify.app'  // production frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ------------------- Security & Middleware -------------------
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(hpp());

// ------------------- Database config -------------------
const { DB_USERNAME, DB_PASSWORD } = process.env;

let url = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.zvfpf6i.mongodb.net/Demo?retryWrites=true&w=majority&appName=Cluster0`;

(async () => {
  try {
    await mongoose.connect(url);
    console.log("Database connected successfully");
    await seedRoles();
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

// ------------------- Rate limit -------------------
let limiter = ratelimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

app.use(limiter);

// ------------------- Routes -------------------
app.use("/api/v1", auth);
app.use("/api/v1", managerRoutes);
app.use("/api/v1", router);
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);

module.exports = app;
