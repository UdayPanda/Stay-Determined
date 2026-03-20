import { Router } from "express";
import { addExpanse, bulkAddExpanse, deleteExpanse, getBalance, getExpanse } from "../controllers/ExpanseController.js";


const expanseRoute = Router()

expanseRoute.post('/add', addExpanse)
expanseRoute.post('/bulk', bulkAddExpanse)
expanseRoute.post('/get', getExpanse)
expanseRoute.post('/balance', getBalance)
expanseRoute.delete('/delete', deleteExpanse)

export default expanseRoute