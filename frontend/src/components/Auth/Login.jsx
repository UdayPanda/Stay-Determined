import React, { useState } from 'react'
import { apiClient } from '../../lib/apiClient'
import { LOGIN_ROUTE } from '../../utils/constants'
import Toast from '../Templates/Toast.jsx'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'


function Login() {

    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate()
    const { login } = useAuth()


    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

    };


    const validLogin = () => {

        const phoneNumberPattern = /^[0-9]{10}$/;

        if (!phone.length || !password.length) {
            showToast("All fields are required", 'info')
            return false
        }

        if (!phoneNumberPattern.test(phone)) {
            showToast("Invalid phone number", 'error')
            return false
        }

        return true
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (validLogin()) {
            try {

                const response = await apiClient.post(LOGIN_ROUTE, {phone,email, password})
                localStorage.setItem("token", response.data.token)
                
                showToast("Logged in successfully", 'success')

                login(response.data)

                if(response.status === 200){
                    navigate('/dashboard')
                }

            } catch (error) {

                let errorMessage = "An error occurred during account creation";
                if (error.response) {
                    errorMessage = error.response.data.message || error.response.data.error || errorMessage;
                }

                showToast(errorMessage, 'error');

            }
        }
    }


    return (
        <>
            <div className='absolute text-gray-600 inset-0 bg-black bg-opacity-15 backdrop-blur-md flex items-center justify-center'>
                <div className='w-1/3 bg-white border-orange-700 rounded-xl p-4 px-8'>
                    <h1 className='text-center text-3xl font-bold text-orange-700'>Login</h1>
                    <form onSubmit={handleLogin} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor='phone'>Phone Number
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                className='bg-gray-200 p-1 px-2 rounded-md outline-none'
                                type='text'
                                id='phone'
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
                        <button className='bg-orange-700 text-white p-1 px-2 rounded-md w-1/3 m-auto' type='submit'>Login</button>
                    </form>
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

export default Login
