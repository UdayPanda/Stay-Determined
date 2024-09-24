import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/AuthRoute.js";
import todoRoute from "./routes/TodoRoute.js";
import expanseRoute from "./routes/ExpanseRoute.js";


dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const origin = process.env.ORIGIN
const db = process.env.DB_URL

app.use(express.json())

app.use(cors({
    origin: origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,  
    app.options('*', cors(corsOptions)); 
}))

app.use('/api/auth', authRoute)
app.use('/api/todos', todoRoute)
app.use('/api/expanse', expanseRoute)

app.listen(port, ()=>{
    console.log(`Server is running on origin: ${origin} and port: ${port}`)
})

mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected..."))
    .catch((err)=> console.log(err));
