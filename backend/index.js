import express, { json } from "express";
import { connect } from "mongoose";
import { configDotenv } from "dotenv";
import cors from "cors";

configDotenv();

const URI = process.env.URI;
const PORT = process.env.PORT || 8000;
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(json());
app.set("trust proxy", 1)
app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("<h1>The API is working Successfully</h1>");
});

try {
  await connect(URI);
  console.log("Database successfully connected");
  app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.log(error);
}