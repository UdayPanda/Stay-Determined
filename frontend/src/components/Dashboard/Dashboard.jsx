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
import Navbar from './Navbar'
import { GET_TODOS } from '../../utils/constants';
import { apiClient } from '../../lib/apiClient';


ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function Dashboard() {

    const { user } = useAuth()
    const [todos, setTodos] = useState([])
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    })
    const [chartData, setChartData] = useState({ ubni: 0, ibnu: 0, unb: 0, other: 0 });
    const [selectedLabel, setSelectedLabel] = useState(0);
    const [chartKey, setChartKey] = useState(0);

    const fetchTodos = async (userId) => {
        try {

            const response = await apiClient.post(GET_TODOS, { user: userId, date: date }, { headers: { 'Content-Type': 'application/json' } })

            setTodos(response.data.todos)

            // console.log(response.data.todos);
            // console.log(date);

        } catch (error) {
            console.log('Failed to fetch todos.', error)
        }
    }

    useEffect(() => {
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
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const chartElement = elements[0];
                const index = chartElement.index;
                setSelectedLabel(index + 1);
            }
        },
    };

    useEffect(() => {
        if (user) {
            fetchTodos(user.user.id, date);
        }
    }, [user, date]);

    useEffect(() => {
        const interval = setInterval(() => {
            setChartKey(prevKey => prevKey + 1); key
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Navbar />

            <div className="font-poppins bg-[#172842] h-[95vh] py-8">

                <input
                    type="date"
                    className='absolute outline-none top-20 right-10 bg-white text-gray-600 w-32 rounded-md p-1'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <h1 className="text-2xl text-white font-bold text-center mb-2 mt-2">Manage Your Todos</h1>

                <div style={{ width: '40%', marginLeft: '30%', color: 'white' }}>
                    <PolarArea data={data} key={chartKey} options={options} />
                </div>

            </div>

        </>
    )
}

export default Dashboard
