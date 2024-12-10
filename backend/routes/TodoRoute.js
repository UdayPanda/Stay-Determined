import { Router } from "express";
import { addTodo, getTodos, deleteTodo, updateTodo, getExpanseTodos, getLabelCounts } from "../controllers/TodoController.js";


const todoRoute = Router()

todoRoute.post('/add', addTodo)
todoRoute.post('/get', getTodos)
todoRoute.post('/count', getLabelCounts)
todoRoute.delete('/delete/:id', deleteTodo)
todoRoute.post('/update', updateTodo)
todoRoute.post('/loan', getExpanseTodos)

export default todoRoute
