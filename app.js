import express from "express";
import connectMongo from "./db/mongoose.js";
import cors from "cors"
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import mainRouter from "./routes/main.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express(); 
connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("<h1>This is the backend for FAPS Desafio 2024</h1>");
});
app.use(authRouter);
app.use(mainRouter);

app.listen(PORT, ()=>{
    console.log(`server started on http://localhost:${PORT}` )
})