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
                            to={user ? "/" : "/signup"}
                            onClick={user ? logoutUser : null}
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

