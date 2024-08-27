import { TodoProvider, useAuth } from '../../contexts'
import { useEffect, useState } from 'react'
import TodoForm from '../Todo/TodoForm'
import TodoItem from '../Todo/TodoItem'
import { apiClient } from '../../lib/apiClient'
import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from '../../utils/constants'

function AllTodos() {

    const [todos, setTodos] = useState([])

    const { user } = useAuth()

    const fetchTodos = async (userId) => {
        try {
            const response = await apiClient.post(GET_TODOS, { user: userId }, { headers: { 'Content-Type': 'application/json' } })
            setTodos(response.data.todos)
        } catch (error) {
            console.log('Failed to fetch todos.', error)
        }
    }

    const updateTodo = async (id, todo) => {
        try {
            const response = await apiClient.post(UPDATE_TODO, { id, todo }, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => prev.map((prevTodo) => prevTodo._id === id ? response.data.todo : prevTodo))
        } catch (error) {
            console.log('Failed to update todo.', error);
        }
    }

    const removeTodo = async (id) => {

        try {
            await apiClient.delete(`${DELETE_TODO}/${id}`, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => prev.filter((prevTodo) => prevTodo._id !== id))
        } catch (error) {
            console.log('Failed to remove todo.', error);
        }
    }

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id)
        if (todo) {
            updateTodo(id, { ...todo, completed: !todo.completed })
        }
    }

    useEffect(() => {

        if (user) {
            fetchTodos(user.user.id)
        }

    }, [user])


    return (
        <TodoProvider value={{ todos, updateTodo, toggleComplete, removeTodo }}>
            <div className="flex flex-wrap gap-y-3">
                {todos.map((todo) => (
                    <div className='w-full' key={todo._id}>
                        <TodoItem todo={todo} />
                    </div>
                ))}
            </div>
        </TodoProvider>
    )

}
export default AllTodos
