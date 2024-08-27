import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoute.js";
import todoRoute from "./routes/TodoRoute.js";


dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const db = process.env.DB_URL

app.use(express.json())

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  
}))

app.use('/api/auth', authRoute)
app.use('/api/todos', todoRoute)


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected..."))
    .catch((err)=> console.log(err));