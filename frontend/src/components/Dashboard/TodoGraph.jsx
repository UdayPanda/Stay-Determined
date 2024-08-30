import React, { useEffect, useState } from 'react'
import { PolarArea } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useAuth } from '../../contexts'
import { GET_TODOS } from '../../utils/constants';
import { apiClient } from '../../lib/apiClient';
import Toast from '../Templates/Toast';


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function TodoGraph() {

    const { user } = useAuth()
    const [todos, setTodos] = useState([])
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    })
    const day = new Date(date).getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const [chartData, setChartData] = useState({ ubni: 0, ibnu: 0, unb: 0, other: 0 });
    const [chartKey, setChartKey] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });


    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };


    const fetchTodos = async (userId, date) => {
        try {

            const response = await apiClient.post(GET_TODOS, { user: userId, date: date }, { headers: { 'Content-Type': 'application/json' } })

            setTodos(response.data.todos)

        } catch (error) {
            let errorMessage = "Something went wrong.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }

            showToast(errorMessage, 'error');
        }
    }

    useEffect(() => {
        const userID = user?.user?.id

        if (userID) {
            fetchTodos(userID, date);
        }
        if (user.id) {
            fetchTodos(user.id, date);
        }

        if (!userID && !user.id) {
            showToast("Please login again!", 'error')
        }

    }, [user, date]);

    useEffect(() => {

        const timer = setTimeout(() => {
            if (todos.filter((todo) => todo.date === date).length === 0) showToast("Please add todos.....", 'info');
        }, 1000);

        const counts = { ubni: 0, ibnu: 0, unb: 0, other: 0 };
        todos.forEach((todo) => {
            switch (todo.label) {
                case 1:
                    counts.ubni++;
                    break;
                case 2:
                    counts.ibnu++;
                    break;
                case 3:
                    counts.unb++;
                    break;
                case 4:
                    counts.other++;
                    break;
                default:
                    break;
            }
        });
        setChartData(counts);

        return () => clearTimeout(timer);

    }, [todos]);


    const data = {
        labels: ['Urgent but not Important', 'Important but not Urgent', 'Urgent and Important', 'Other'],
        datasets: [{
            label: "Todos",
            data: [chartData.ubni, chartData.ibnu, chartData.unb, chartData.other],
            backgroundColor: [
                'rgba(32, 163, 245)',
                'rgba(245, 32, 135)',
                'rgba(32, 245, 64)',
                'rgba(245, 188, 32)',
            ],
            borderColor: [
                'rgba(32, 163, 245)',
                'rgba(245, 32, 135)',
                'rgba(32, 245, 64)',
                'rgba(245, 188, 32)',
            ],
            borderWidth: 1,
            hoverBackgroundColor: [
                'rgba(32, 163, 245, 0.7)',
                'rgba(245, 32, 135, 0.7)',
                'rgba(32, 245, 64, 0.7)',
                'rgba(245, 188, 32, 0.7)',
            ]
        }]
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                grid: {
                    color: 'rgb(100, 116, 139)',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart',
            },
        },

    };

    useEffect(() => {
        const interval = setInterval(() => {
            setChartKey(prevKey => prevKey + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);



    return (
        <>

            <h2 className='font-dancing-script absolute top-20 right-48 text-white text-2xl animate-fadeInSlide'>{days[day]}</h2>

            <input
                type="date"
                className='absolute outline-none top-20 right-10 bg-white text-gray-600 w-32 rounded-md p-1'
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <h1 className="text-2xl text-white font-bold text-center m-5 mt-2">Manage Your Todos</h1>

            <div className='relative'>

                <div style={{ width: '40%', marginLeft: '30%', color: 'white' }}>
                    <PolarArea data={data} key={chartKey} options={options} />
                </div>

                <div className='absolute top-80 right-20'>

                    <div className='text-white text-md font-bold m-2'>Upcoming Todos: {todos.length}</div>

                    <div className='flex items-center justify-items-start gap-2'>
                        <div className='w-4 h-4 rounded-md bg-[#32A3F5]'></div>
                        <p className='text-white'>Urgent but not Important</p>
                    </div>

                    <div className='flex items-center justify-items-start gap-2'>
                        <div className='w-4 h-4 rounded-md bg-[#f52987]'></div>
                        <p className='text-white'>Important but not Urgent</p>
                    </div>

                    <div className='flex items-center justify-items-start gap-2'>
                        <div className='w-4 h-4 rounded-md bg-[#32C64A]'></div>
                        <p className='text-white'>Urgent and Important</p>
                    </div>

                    <div className='flex items-center justify-items-start gap-2'>
                        <div className='w-4 h-4 rounded-md bg-[#F5BC20]'></div>
                        <p className='text-white'>Other</p>
                    </div>
                </div>
            </div>

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

export default TodoGraph
