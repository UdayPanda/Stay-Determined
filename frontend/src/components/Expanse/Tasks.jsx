import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts'
import { GET_TODOS } from '../../utils/constants'
import { apiClient } from '../../lib/apiClient.js'

function Tasks({ onError }) {

    const { user } = useAuth()
    const [tasks, setTasks] = useState([])

    
    const labelInfo = {
        1: "Urgent but not Important",
        2: "Important but not Urgent",
        3: "Urgent and Important",
        4: "Other"
    }

    const fetchTasks = async (userID) => {
        try {

            const response = await apiClient.post(GET_TODOS, { user: userID, date: new Date().toISOString().split('T')[0] }, { headers: { 'Content-Type': 'application/json' } })

            const data = response.data.todos

            setTasks(data)

        } catch (error) {
            let errorMessage = "Tasks failed to fetch.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }
            onError(errorMessage, 'error');
        }
    }

    useEffect(() => {

        const userID = user?.user?.id || user?.id

        if (userID) {
            fetchTasks(userID);
        }

    }, [user])


    return (
        <div className='flex bg-[#e5e7eb] rounded-md h-80'>
            <div className='flex flex-col items-center gap-2 w-48 m-2 text-gray-700 overflow-y-scroll scrollbar-none'>
                <div className='font-semibold'>Tasks</div>

                {tasks && tasks.filter((task) => task.expanse === true).map((item) => (
                    <div className='relative p-1 w-full h-9 rounded-md shadow-md bg-[#e1d7b7]'>

                        <div className='text-gray-700 text-xs'>{item.title}</div>
                        <div className='absolute top-1 right-3 text-red-700 text-xs'>{item.reminder}</div>
                        <div className='flex absolute top-5 left-1'>
                            <p className='text-gray-600 w-44 h-3 overflow-hidden text-[10px]'>{labelInfo[item.label]}</p>
                        </div>

                    </div>
                ))}

           
            </div>
        </div>
    )
}

export default Tasks
