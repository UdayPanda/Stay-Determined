import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div className="font-poppins mx-auto h-screen w-full max-w-7xl">
            <aside className="relative overflow-hidden text-black rounded-lg sm:mx-16 mx-2 sm:py-16">
                <div className="relative z-10 max-w-screen-xl px-4  pb-20 pt-10 sm:py-24 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-xl sm:mt-1 mt-80 space-y-8 text-center sm:text-justify sm:ml-auto">
                        <h2 className="text-4xl sm:text-3xl">
                            Master Your Day with Advanced Time Blocking!
                            <span className="hidden sm:block mt-4 text-xl">Break down your day into focused time blocks, optimized for peak productivity.
                            </span>
                        </h2>

                        <Link
                            className="inline-flex text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75"
                            to="/signup"
                        >
                            &nbsp; Get Started
                        </Link>
                    </div>
                </div>

                <div className="absolute inset-0 w-full sm:my-20 sm:pt-1 pt-12 h-full ">
                    <img className="w-96" src="https://i.ibb.co/5BCcDYB/Remote2.png" alt="image1" />
                </div>
            </aside>

        </div>
    );
}
