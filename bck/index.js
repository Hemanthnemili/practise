import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import userRouter from "./routes/user.js";
dotenv.config();

connectDb();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at server http://localhost: ${PORT}`);
});
