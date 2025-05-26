import express from "express";
import "dotenv/config";
import nodeloggerg from "nodeloggerg";
import path from "path";
import url from "url";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Exclude password from queries by default
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
  tasks: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      completed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      dueDate: { type: Date, default: null },
      priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
    },
  ],
  tokens: [{ type: String }],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema);

const logger = nodeloggerg({
  serverConfig: {
    startWebServer: true,
    authEnabled: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
    enableRealtime: true,
    enableSearch: true,
  },
  enableMetrics: true,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const apiRouter = express.Router();
const authRouter = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"))
);

authRouter.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = new User({ username, password, email });
    await user.save();

    // Generate a token for the user
    const token = crypto.randomBytes(16).toString("hex");
    user.tokens.push(token);
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: user.select("-password").select("-tokens"),
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate a token for the user
    const token = crypto.randomBytes(16).toString("hex");
    user.tokens.push(token);
    await user.save();
    res.status(200).json({
      message: "Login successful",
      user: user.select("-password").select("-tokens"),
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.use("/auth", authRouter);

app.use("/api", apiRouter);

app.all("*path", (req, res) => {
  res
    .status(404)
    .sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server is running on port ${process.env.PORT || 3000}`);
});
