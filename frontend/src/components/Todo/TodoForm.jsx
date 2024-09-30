import React, { useState } from 'react'
import { useAuth, useTodo } from '../../contexts';
import Toast from '../Templates/Toast';

function TodoForm() {

    const [todo, setTodo] = useState("")
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    })
    const [isCompleted, setIsCompleted] = useState(false)
    const [label, setLabel] = useState("")
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const { addTodo } = useTodo()
    const { user } = useAuth()
    const userID = user?.user?.id || user?.id

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };

    const add = (e) => {
        e.preventDefault()

        if (!todo) return

        if (user) {
            addTodo({
                title: todo,
                user: userID,
                completed: isCompleted,
                date: date,
                label: label,
                scheduledFor: new Date().now,
                reminder: false,
                reminderTime: new Date().now
            })
            setTodo("")
            setIsCompleted(false)
            setDate(date)
            setLabel("")
        }
        else {
            showToast("Please login to add todo", 'error')
        }
    }

    return (
        <>
            <form onSubmit={add} className="flex">

                <div className='flex flex-col items-center justify-center gap-3'>

                    <input
                        type="date"
                        className='absolute top-4 right-4 text-sm lg:text-md bg-white text-gray-600 w-32 rounded-md p-1'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Write Todo..."
                        className="w-full mt-12 ml-0 lg:ml-5 border border-black/10 rounded-md px-3 outline-none duration-150 bg-white py-1.5"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                    />

                    <input
                        type="checkbox"
                        className='absolute top-4 left-4 w-4 transform scale-150 text-blue-600'
                        value={isCompleted}
                        checked={isCompleted}
                        onChange={() => setIsCompleted(!isCompleted)}
                    />

                    <label
                        className="ml-0 lg:ml-20 font-semibold text-xl"
                    >
                        Label:
                    </label>

                    <div className='grid grid-cols-2 gap-3 ml-0 lg:ml-2 items-center justify-center m-auto w-full text-sm lg:text-xl'>
                        <div>
                            <input type='radio' name='label' value='1' checked={label === '1'} onChange={(e) => setLabel(e.target.value)} />
                            <label htmlFor="1" className='ml-2 text-[#32A3F5] font-bold'>Urgent but not important</label>
                        </div>

                        <div>
                            <input type='radio' name='label' value='2' checked={label === '2'} onChange={(e) => setLabel(e.target.value)} />
                            <label htmlFor="2" className='ml-2 text-[#f52987] font-bold'>Important but not urgent</label>
                        </div>

                        <div>
                            <input type='radio' name='label' value='3' checked={label === '3'} onChange={(e) => setLabel(e.target.value)} />
                            <label htmlFor="3" className='ml-2 text-[#32C64A] font-bold'>Urgent and important</label>
                        </div>

                        <div>
                            <input type='radio' name='label' value='4' checked={label === '4'} onChange={(e) => setLabel(e.target.value)} />
                            <label htmlFor="4" className='ml-2 text-[#F5BC20] font-bold'>Other</label>
                        </div>
                    </div>

                    <button type="submit" className="mt-8 ml-0 lg:ml-20 rounded-md px-2 lg:px-3 py-0 lg:py-1 bg-green-600 text-sm lg:text-xl text-white">
                        Add
                    </button>
                </div>
            </form>

            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    duration={3000}
                    show={toast.show}
                />
            )}
        </>
    );
}

export default TodoForm;

