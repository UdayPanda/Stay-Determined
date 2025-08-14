import React, { useState } from 'react'
import { apiClient } from '../../lib/apiClient.js'
import { SIGNUP_ROUTE } from '../../utils/constants.js'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../Templates/Toast.jsx'
import Loader from '../Templates/Loader.jsx'

function SignUp() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };

    const validSignUp = () => {

        const phoneNumberPattern = /^[0-9]{10}$/;

        if (!name.length || !phone.length || !password.length || !confirmPassword.length) {
            showToast("All fields are required", 'info')
            return false
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showToast("Invalid email format", 'error')
            return false
        }

        if (name.length < 3 || name.length > 50) {
            showToast("Name must be between 3 and 50 characters", 'error')
            return false
        }   

        if (name && !/^[a-zA-Z\s]+$/.test(name)) {
            showToast("Name can only contain letters and spaces", 'error')
            return false
        }

        if (password.length < 6) {
            showToast("Password must be at least 6 characters long", 'error')
            return false
        }

        if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/.test(password)) {
            showToast("Password must contain at least one uppercase letter, one lowercase letter, and one number", 'error')
            return false
        }

        if (!phoneNumberPattern.test(phone) || phone.startsWith("0") || phone == "" || phone.length !== 10 ) {
            showToast("Invalid phone number", 'error')
            return false
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match", 'error')
            return false
        }

        return true
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (validSignUp()) {
            try {

                const response = await apiClient.post(SIGNUP_ROUTE, { name, phone, email, password })
                
                showToast("Account created successfully", 'success')
                
                if (response.status === 201){
                    setLoading(false)
                    navigate("/login")
                  }

            } catch (error) {

                let errorMessage = "An error occurred during account creation";
                if (error.response) {

                    errorMessage = error.response.data.message || error.response.data.error || errorMessage;
                }

                setLoading(false)

                showToast(errorMessage, 'error');

            }
        }
    }

    return (
        <>
            <div className='absolute text-gray-600 inset-0 bg-black bg-opacity-15 backdrop-blur-md flex items-center justify-center'>
                <div className='w-[80%] lg:w-1/3 bg-white border-orange-700 rounded-xl p-4 px-8'>
                    <h1 className='text-center text-3xl font-bold text-orange-700'>Sign Up</h1>
                    <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='name'>Name
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='bg-gray-200 text-lg p-1 px-2 rounded-md outline-none'
                                type='text'
                                id='name'
                                value={name}
                                maxLength={50}
                                onChange={(e) => setName(e.target.value)}
                                required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='phone'>Phone Number
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='bg-gray-200 p-1 px-2 rounded-md outline-none'
                                type='text'
                                id='phone'
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='email'>Email</label>
                            <input
                                className='bg-gray-200 p-1 px-2 rounded-md outline-none'
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id='email' />
                        </div>
                        <div className='relative flex flex-col gap-1'>
                            <label htmlFor='password'>Password
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='bg-gray-200 p-1 px-2 rounded-md outline-none'
                                type={showPassword ? 'text' : 'password'}
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />

                            <button
                                type='button'
                                onClick={() => setShowPassword(prev => !prev)}
                                className='absolute text-orange-700 inset-y-0 top-6 right-2 flex items-center'
                            >{showPassword ? 'Hide' : 'Show'}</button>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='password'>Confirm Password
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='bg-gray-200 p-1 px-2 rounded-md outline-none'
                                type='text'
                                id='confirmpassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                        <button className='bg-orange-700 text-white p-1 px-2 rounded-md w-1/3 m-auto' type='submit'>Sign Up</button>
                        <p className='text-center'>Already have an account? <Link to="/login" className='text-orange-700 italic'>Login</Link></p>
                    </form>
                </div>
            </div>

            {loading ? <Loader/> : <div></div>}

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

export default SignUp
