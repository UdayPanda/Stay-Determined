import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function Header() {

    const { user } = useAuth()

    const logoutUser = () => {
        localStorage.removeItem('token');
        window.location.reload();
    };

    return (
        <header className="font-poppins shadow sticky z-50 top-0">
            <nav className="bg-gray-200 border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img
                            src='https://cdn.pixabay.com/photo/2022/03/21/07/02/fire-7082466_1280.png'
                            className="h-5 md:h-8 lg:mr-3 lg:h-12"
                            alt="Logo"
                        />
                        <span className="font-dancing-script self-center text-xl lg:text-4xl sm:text-lg whitespace-nowrap">Stay Determined!</span>
                    </Link>
                    <div className="flex items-center lg:order-2">
                        <Link
                            to={user ? "/profile": "/login"}
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            {user ? 'Profile' : 'Login'}
                        </Link>
                        <Link
                            to={user ? "/" :"/signup"}
                            onClick={logoutUser}
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-2 lg:px-5 py-1 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            {user ? "Logout" : "Get Started"}
                        </Link>
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    to="/"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? 'text-orange-700' : 'text-gray-700'} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 ${isActive ? 'text-orange-700' : 'text-gray-700'} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

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
        const userID = user?.user?.id || user?.id

        if (userID) {
            fetchTodos(userID, date);
        }

        if (userID == undefined) {
            showToast("Please login again!", 'error')
        }

    }, [user, date]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!todos.some((todo) => {
                const todoDate = new Date(todo.date).toISOString().split('T')[0]; 
                return todoDate === date;
            })) {
                showToast("Please add todos.....", 'info');
            }
            
        }, 1000);

        const counts = todos.reduce((acc, todo) => {
            switch (todo.label) {
                case 1: acc.ubni++; break;
                case 2: acc.ibnu++; break;
                case 3: acc.unb++; break;
                case 4: acc.other++; break;
                default: break;
            }
            return acc;
        }, { ubni: 0, ibnu: 0, unb: 0, other: 0 });

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
    }, [chartData]);


    return (
        <>

            <h2 className='font-dancing-script absolute top-16 lg:top-20 right-44 lg:right-48 text-xl md:text-xl lg:text-2xl text-white animate-fadeInSlide'>{days[day]}</h2>

            <input
                type="date"
                className='absolute outline-none top-16 lg:top-20 right-6 lg:right-10 text-sm lg:text-md bg-white text-gray-600 w-32 rounded-md p-1'
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <h1 className="text-2xl text-white font-bold text-center m-5 mt-10 lg:mt-2">Manage Your Todos</h1>

            <div className='relative'>

                <div className='w-[75%] lg:w-[40%] text-white ml-[15%] lg:ml-[30%]'>
                    <PolarArea data={data} key={chartKey} options={options} />
                </div>

                <div className='absolute top-70 lg:top-80 right-20'>

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
