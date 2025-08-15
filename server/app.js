const dotEnv = require('dotenv');
dotEnv.config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const hpp = require('hpp')
const ratelimit=require('express-rate-limit');
const router = require('./src/routes/api');
const userTaskRoutes = require('./src/routes/userTaskRoutes');
const seedRoles = require('./src/utility/seedRoles');

app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(mongoSanitize())
app.use(hpp())

// database config
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



// rate limit

let limiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max:100,
})

app.use(limiter)

// version api tag

app.use("/api/v1",router)
app.use("/api/v1", userTaskRoutes);

module.exports = app;