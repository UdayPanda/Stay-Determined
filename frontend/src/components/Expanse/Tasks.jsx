import { useEffect, useState } from 'react'
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

    const toggleTask = (taskId) => {
    // setTasks((prev) => ({
    //   ...prev,
    //   tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    // }))
    console.log(taskId);
    
  }


    return (
        <div className=''>
            {tasks.map((task) => (
                <div key={task.id} className="mb-3 last:mb-0 p-2 rounded-lg hover:bg-purple-500/5 transition-colors">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span
                      className={`text-sm transition-all ${task.completed ? "text-slate-500 line-through" : "text-slate-300"}`}
                    >
                      {task.title}
                    </span>
                  </label>
                </div>
              ))}

              {/* {tasks && tasks.filter((task) => task.expanse === true).map((item) => (
                <div key={item.id} className="mb-3 last:mb-0 p-2 rounded-lg hover:bg-purple-500/5 transition-colors">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleTask(item.id)}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span
                      className={`text-sm transition-all ${item.completed ? "text-slate-500 line-through" : "text-slate-300"}`}
                    >
                      {item.title}
                    </span>
                  </label>
                </div>
              ))} */}
        </div>
    )
}

export default Tasks
