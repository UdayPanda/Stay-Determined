import { TodoProvider } from '../../contexts'
import { useState } from 'react'
import TodoForm from '../Todo/TodoForm'
import { apiClient } from '../../lib/apiClient'
import { ADD_TODO } from '../../utils/constants'

function AddTodo() {

    const [todos, setTodos] = useState([])

    const addTodo = async (todo) => {
        try {
            const response = await apiClient.post(ADD_TODO, todo, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => [...prev, response.data.todo])
        } catch (error) {
            console.log('Failed to add todo.', error);
        }
    }

    return (
        <TodoProvider value={{ todos, addTodo }}>
            <div className="bg-slate-500 p-4 rounded-md relative mb-4">
                <TodoForm />
            </div>

        </TodoProvider>
    )
}

export default AddTodo
