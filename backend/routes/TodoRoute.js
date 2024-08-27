import { Router } from "express";
import { addTodo, getTodos, deleteTodo, updateTodo } from "../controllers/TodoController.js";


const todoRoute = Router()

todoRoute.post('/add', addTodo)
todoRoute.post('/get', getTodos)
todoRoute.delete('/delete/:id', deleteTodo)
todoRoute.post('/update', updateTodo)

export default todoRoute