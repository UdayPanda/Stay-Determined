import { TodoProvider } from '../../contexts'
import { useState } from 'react'
import TodoForm from '../Todo/TodoForm'
import { apiClient } from '../../lib/apiClient'
import { ADD_TODO } from '../../utils/constants'
import Toast from '../Templates/Toast'

function AddTodo() {

    const [todos, setTodos] = useState([])
    const [toast, setToast] = useState({ show: false, message: '', type: '' });


    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };

    const addTodo = async (todo) => {
        try {
            const response = await apiClient.post(ADD_TODO, todo, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => [...prev, response.data.todo])
        } catch (error) {
            let errorMessage = "Something went wrong.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }

            showToast(errorMessage, 'error');
        }
    }

    return (

        <>
            <TodoProvider value={{ todos, addTodo }}>
                <h1 className="text-2xl text-white font-bold text-center m-10 mt-2">Add Task Todo</h1>
                <div className="w-[50%] mx-auto bg-blue-300 p-4 rounded-md relative mb-4">

                    <TodoForm />
                </div>

            </TodoProvider>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    show={toast.show}
                />
            )}
        </>
    )
}

export default AddTodo
