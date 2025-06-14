import dotenv from "dotenv";
dotenv.config({ path: "./.env" })

import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import connectDatabase from "./db/db.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: [process.env.FRONTEND_URL, "http://localhost:5173"], credentials: true }))

app.get("/", (req, res) => {
    res.send("<h1>AUTHENTICATION MODULE IN REACT</h1>");
})

import AuthRoutes from "./routes/auth.routes.js";
app.use("/api/v1/auth", AuthRoutes);

connectDatabase().then(() => {
    app.listen(3000, () => {
        console.log("SERVER IS LISTENING ON PORT : http://localhost:3000");
    });
})