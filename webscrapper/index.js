import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import youtubeRoutes from "./routes/youtube.js"
import connectDB from "./db.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"
import User from "./models/User.js"
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// Connect DB
connectDB();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Max 10 attempts per 15 mins
  message: "Too many attempts, try again later."
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const allowedOrigins = process.env.ALLOWED_URL ? process.env.ALLOWED_URL.split(',') : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Login route

app.post("/login", authLimiter, async (req, res) => {
  try {
    // const { username, password } = req.body;
    const username = req.body.username ? String(req.body.username).trim() : null;
    const password = req.body.password ? String(req.body.password) : null;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Use schema method
    const isMatch = await user.comparePassword(password.trim());
    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    res.json({ success: true, accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error logging in" });
  }
});


// signup route 

app.post("/signup", authLimiter, async (req, res) => {
  try {
    const username = req.body.username ? String(req.body.username).trim() : null;
    const password = req.body.password ? String(req.body.password) : null;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const user = new User({
      username,
      password: password.trim()
    });

    await user.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});



app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(200).json({ accessToken: null, message: "No refresh token" });
  }

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) {
      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      return res.status(401).json({ accessToken: null });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, username: decoded.username },
      process.env.ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  });
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.json({ message: "Logged out successfully" });
});

app.use("/api/videos", youtubeRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));