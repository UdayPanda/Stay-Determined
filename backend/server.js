import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoute.js";
import todoRoute from "./routes/TodoRoute.js";
import expanseRoute from "./routes/ExpanseRoute.js";
import noteRoute from "./routes/NoteRoute.js";
import planRoute from "./routes/PlanRoute.js";


dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const origin = process.env.ORIGIN
const db = process.env.DB_URL

app.use(cors({
    origin: 'https://stay-determined-frontend.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  
}));

app.options('*', cors({
    origin: 'https://stay-determined-frontend.onrender.com', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/todos', todoRoute)
app.use('/api/notes', noteRoute)
app.use('/api/expanse', expanseRoute)
app.use('/api/plans', planRoute)

app.listen(port, ()=>{
    console.log(`Server is running on origin: ${process.env.HOST} and port: ${port}`)
})

mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected..."))
    .catch((err)=> console.log(err));
