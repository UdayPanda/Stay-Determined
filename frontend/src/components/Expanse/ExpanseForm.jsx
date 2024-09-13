import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts'
import { apiClient } from '../../lib/apiClient'
import { ADD_EXPANSE, GET_BALANCE } from '../../utils/constants'
import { useExpanse } from '../../contexts/ExpanseContext.jsx'

function ExpanseForm({ onError }) {

    const { user } = useAuth()
    const userID = user?.user?.id || user?.id
    const { balance, setBalance } = useExpanse()
    const [party, setParty] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [category, setCategory] = useState('')
    const [loan, setLoan] = useState(false)
    const [todo, setTodo] = useState('')
    const [date, setDate] = useState('')

    const fetchBalance = async (userID) => {
        try {
            const response = await apiClient.post(GET_BALANCE, { user: userID }, { headers: { 'Content-Type': 'application/json' } })
            const data = response.data.balance
            setBalance(data)
        } catch (error) {
            let errorMessage = "Transactions failed to fetch.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }
            onError(errorMessage, 'error');
        }
    }

    const handleSave = async () => {
        try {
            const requestBody = {
                user: user?.user?.id || user?.id,
                party: party,
                description: description,
                amount: amount,
                debit: category === 'debit' ? true : false,
                credit: category === 'credit' ? true : false,
                category: loan ? 'loan' : null,
                date: date ? date : new Date().toISOString()
            }

            if (todo) {
                requestBody.todoID = todo;
            }

            await apiClient.post(ADD_EXPANSE, requestBody, { headers: { 'Content-Type': 'application/json' } })
            fetchBalance(userID)

            setParty('')
            setDescription('')
            setAmount(0)
            setCategory('')
            setLoan(false)
            setTodo('')
            setDate('')

        } catch (error) {
            let errorMessage = "Transactions failed to fetch.";
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }
            onError(errorMessage, 'error');
        }
    }

    useEffect(() => {

        if (userID) {
            fetchBalance(userID)
        }
    }, [user, balance])

    return (
        <div className='fixed w-[90%] bottom-6 flex items-center justify-between bg-[#e5e7eb] rounded-md p-4'>
            <div className='text-gray-700 font-semibold text-lg'>Balance : {balance}</div>


            <div className='grid justify-between w-[600px] gap-2 grid-cols-2 text-sm'>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Party: </label>
                    <input
                        type="text"
                        className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
                        required
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                    />
                </div>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Description: </label>
                    <input
                        type="text"
                        className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Amount: </label>
                    <input
                        type="text"
                        className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Task: </label>
                    <input
                        type="text"
                        className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                    />
                </div>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Loan: </label>

                    <label className="inline-flex items-center mb-5 cursor-pointer outline-none mr-52">
                        <input 
                        type="checkbox" value="" 
                        className="sr-only peer"
                        checked={loan}
                        onChange={() => setLoan(!loan)}
                        />
                            <div 
                            className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>                            
                    </label>

                </div>
                <div className='flex items-start justify-between'>
                    <label htmlFor="party">Type: </label>
                    <select
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className='w-36 text-center bg-white rounded-md'
                    >
                        <option value="">Select</option>
                        <option value="debit">Debit</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>

            </div>

            <div>
                <button
                    type='submit'
                    className='bg-green-500 px-3 rounded-md text-sm text-white'
                    onClick={handleSave}
                >Save</button>
            </div>
        </div>
    )
}

export default ExpanseForm
