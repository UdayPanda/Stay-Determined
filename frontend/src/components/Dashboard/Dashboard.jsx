import React, { useState } from 'react';
import Navbar from './Navbar';
import Home from './TodoGraph';
import AllTodos from './AllTodos';
import AddTodo from './AddTodo';
import '../../App.css'
import VitaminM from './VitaminM';


function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [stateDisplay, setStateDisplay] = useState('dashboard');

    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    const renderContent = () => {
        switch (stateDisplay) {
            case 'dashboard':
                return <Home />;
            case 'allTodos':
                return <AllTodos />;
            case 'addTodo':
                return <AddTodo />;
            case 'vitaminm':
                return <VitaminM />;
            default:
                return <Home />;
        }
    };

    return (
        <>
            <Navbar />
            <div className='absolute left-5 lg:left-32 top-16 lg:top-24'>
                <div>
                    <div className="burger-icon" onClick={toggleMenu}>
                        <div className={`line ${isOpen ? 'open' : ''}`}></div>
                        <div className={`line ${isOpen ? 'open' : ''}`}></div>
                        <div className={`line ${isOpen ? 'open' : ''}`}></div>
                    </div>
                    <nav className={`menu ${isOpen ? 'open' : ''}`}>
                        <ul>
                            <li className='cursor-pointer p-2 rounded-md hover:bg-slate-300' onClick={() => setStateDisplay('dashboard')}>Dashboard</li>
                            <li className='cursor-pointer p-2 rounded-md hover:bg-slate-300' onClick={() => setStateDisplay('allTodos')}>All Todos</li>
                            <li className='cursor-pointer p-2 rounded-md hover:bg-slate-300' onClick={() => setStateDisplay('addTodo')}>Add Todo</li>
                            <li className='cursor-pointer p-2 rounded-md hover:bg-slate-300' onClick={() => setStateDisplay('vitaminm')}>VitaminM</li>
                        </ul>
                    </nav>
                </div>
            </div>
            <div className={`font-poppins bg-[#172842] min-h-screen py-8`}>
                {renderContent()}
            </div>
        </>
    );
}

export default Dashboard;
