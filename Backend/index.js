const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("./models/user");
const Note = require("./models/Note");

console.log("🔥🔥 INDEX.JS RUNNING 🔥🔥");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// ================== MONGODB ==================
mongoose
  .connect("mongodb://127.0.0.1:27017/notesapp")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================== NODEMAILER ==================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "samrajnaveen58@gmail.com",
    pass: "steumfbwhhsjyivt", // APP PASSWORD (no spaces)
  },
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/notes", verifyToken, async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// ================== TEST ==================
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/test-mail", async (req, res) => {
  try {
    await transporter.sendMail({
      from: "samrajnaveen58@gmail.com",
      to: "samrajnaveen58@gmail.com",
      subject: "Test Mail",
      text: "Hello bro 👋 Nodemailer working!",
    });

    res.send("Mail sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Mail failed");
  }
});

// ================== AUTH ==================

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Login success",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================== FORGOT PASSWORD (OTP) ==================

// SEND OTP
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOTP = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    await transporter.sendMail({
      from: "samrajnaveen58@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// VERIFY OTP & RESET PASSWORD
app.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.resetOTP !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset failed" });
  }
});

// ================== NOTES ==================

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.json(note);
});

app.put("/notes/:id", async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedNote);
});

app.delete("/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// ================== SERVER ==================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
