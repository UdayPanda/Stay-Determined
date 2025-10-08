import { Router } from "express";
import { createPlan, getAllPlans, updatePlan, deletePlan } from "../controllers/PlanController.js";


const planRoute = Router()

planRoute.post('/add', createPlan)
planRoute.post('/get', getAllPlans)
planRoute.put('/update', updatePlan)
planRoute.delete('/delete', deletePlan)

export default planRoute