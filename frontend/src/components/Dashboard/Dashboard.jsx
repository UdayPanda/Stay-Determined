import { TodoProvider } from '../../contexts'
import { useEffect, useState } from 'react'
import TodoForm from '../Todo/TodoForm'
import TodoItem from '../Todo/TodoItem'

function Dashboard() {

    const [todos, setTodos] = useState([])

    const addTodo = (todo) => {
        setTodos((prev) => [...prev, todo])
    }

    const updateTodo = (id, todo) => {
        setTodos((prev) => prev.map((prevTodo) =>  prevTodo.id === id ? todo : prevTodo ))
    }

    const removeTodo = (id) => {
        setTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id))
    }

    const toggleComplete = (id) => {
        setTodos((prev) => prev.map((prevTodo) =>  (prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo)))
    }

    useEffect(() => {
        const todos = JSON.parse(localStorage.getItem('todos'))

        if (todos && todos.length > 0) {
            setTodos(todos)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    return (
        <TodoProvider value={{ todos, addTodo, updateTodo, toggleComplete, removeTodo }}>
            <div className="bg-[#172842] min-h-screen py-8">
                <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
                    <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
                    <div className="mb-4">
                        <TodoForm />
                    </div>
                    <div className="flex flex-wrap gap-y-3">
                        {todos.map((todo) => (
                            <div className='w-full' key={todo.id}>
                                <TodoItem todo={todo} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TodoProvider>
    )
}

export default Dashboard
