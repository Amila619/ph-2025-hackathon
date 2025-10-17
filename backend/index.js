import express, { json } from "express";
import { connect } from "mongoose";
import { configDotenv } from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import authConfig from "./config/authConfig.js";

configDotenv();

const PORT = process.env.PORT || 8000;
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(json());
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(authConfig);

app.get("/hello", (req, res) => {
  res.send("<h1>The API is working Successfully</h1>");
});

app.use("/api/auth", authRouter);

try {
  // await connect(URI);
  // console.log("Database successfully connected");
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}