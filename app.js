import cors from "cors"
import express from "express"; // dont care about ;
import connectMongo from "./db/mongoose.js";
const Port=3000
const app = express(); // yes
connectMongo();











app.listen(Port, ()=>{
    console.log(`server started on http://localhost:${Port}` )
})