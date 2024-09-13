import { TodoProvider, useAuth } from '../../contexts'
import { useEffect, useState } from 'react'
import TodoItem from '../Todo/TodoItem'
import { apiClient } from '../../lib/apiClient'
import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from '../../utils/constants'
import Toast from '../Templates/Toast'

function AllTodos({ label }) {

    const [todos, setTodos] = useState([])
    const countCompleted = todos.filter((todo) => todo.completed).length
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    })
    const day = new Date(date).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [todoLabel, setTodoLabel] = useState(label)
    const { user } = useAuth()
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const labelInfo = {
        1: "Urgent but not Important",
        2: "Important but not Urgent",
        3: "Urgent and Important",
        4: "Other"
    }


    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };

    const todosFilterByLabelProvidedInProp = (fetchedTodos) => {

        if (fetchedTodos && Array.isArray(fetchedTodos)) {
            fetchedTodos = fetchedTodos.filter((todo) => todo.label === Number(todoLabel));
            setTodos(fetchedTodos)
        }

    }


    const fetchTodos = async (userId, date) => {

        try {
            const response = await apiClient.post(GET_TODOS, { user: userId, date }, { headers: { 'Content-Type': 'application/json' } })

            if (todoLabel && todoLabel > 0) {
                todosFilterByLabelProvidedInProp(response.data.todos)
            }
            else setTodos(response.data.todos)

        } catch (error) {
            let errorMessage = "Something went wrong.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }

            showToast(errorMessage, 'error');
        }

    }


    const updateTodo = async (id, todo) => {
        try {
            const response = await apiClient.post(UPDATE_TODO, { id, todo }, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => prev.map((prevTodo) => prevTodo._id === id ? response.data.todo : prevTodo))
        } catch (error) {
            let errorMessage = "Something went wrong.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }

            showToast(errorMessage, 'error');
        }
    }

    const removeTodo = async (id) => {

        try {
            await apiClient.delete(`${DELETE_TODO}/${id}`, { headers: { 'Content-Type': 'application/json' } })
            setTodos((prev) => prev.filter((prevTodo) => prevTodo._id !== id))
        } catch (error) {
            let errorMessage = "Something went wrong.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }

            showToast(errorMessage, 'error');
        }
    }

    const toggleComplete = async (id) => {
        const todo = todos.find((todo) => todo._id === id)
        if (todo) {
            updateTodo(id, { ...todo, completed: !todo.completed })
        }
    }

    useEffect(() => {

        const userID = user?.user?.id || user?.id

        if (userID) {
            fetchTodos(userID, date);
        }

        if (userID == undefined) {
            showToast("Please login again!", 'error')
        }

    }, [user, date, todoLabel])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!todos.some((todo) => {
                const todoDate = new Date(todo.date).toISOString().split('T')[0]; 
                return todoDate === date;
            })) {
                showToast("Please add todos.....", 'info');
            }
            
        }, 1000);
        return () => clearTimeout(timer);

    }, [todos])


    return (
        <>

            <h2 className='font-dancing-script absolute top-20 right-48 text-white text-2xl animate-fadeInSlide'>{days[day]}</h2>

            <input
                type="date"
                className='absolute outline-none top-20 right-10 bg-white text-gray-600 w-32 rounded-md p-1'
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <select className='rounded-md w-[150px] text-sm outline-none px-1 absolute top-40 right-10' onChange={(e) => setTodoLabel(e.target.value)}>
                <option value="0">filter</option>
                <option value="1">Urgent but not Important</option>
                <option value="2">Important but not Urgent</option>
                <option value="3">Urgent and Important</option>
                <option value="4">Other</option>
            </select>

            <h1 className="text-2xl text-white font-bold text-center mb-2 mt-2"> {label && label > 0 ? labelInfo[label] : 'All'} Task Todos</h1>

            <div className='text-gray-400 text-md mx-auto w-[60%]'>Total Todos {todos.length}/ Completed {countCompleted}</div>

            <TodoProvider value={{ todos, updateTodo, toggleComplete, removeTodo }}>
                <div className="flex flex-wrap gap-y-3 w-[60%] mx-auto mt-8">
                    {todos.map((todo) => (
                        <div className='w-full' key={todo._id}>
                            <TodoItem todo={todo} />
                        </div>
                    ))}
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
export default AllTodos
