import { Router } from "express";
import { addExpanse, deleteExpanse, getExpanse } from "../controllers/ExpanseController.js";


const expanseRoute = Router()

expanseRoute.post('/add', addExpanse)
expanseRoute.post('/get', getExpanse)
expanseRoute.post('/delete', deleteExpanse)

export default expanseRoute