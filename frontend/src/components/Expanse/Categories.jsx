import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts'
import { GET_EXPANSE } from '../../utils/constants'
import { apiClient } from '../../lib/apiClient'
import { useExpanse } from '../../contexts/ExpanseContext'

function Categories(onError) {

  const { user } = useAuth()
  const { expanses, setExpanses, balance } = useExpanse()

  const fetchTransaction = async (userID) => {
    try {

      const response = await apiClient.post(GET_EXPANSE, { user: userID }, { headers: { 'Content-Type': 'application/json' } })

      const data = response.data.expanse

      setExpanses(data)

    } catch (error) {
      let errorMessage = "Categories failed to fetch.";
      if (error.response) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
      }
      onError(errorMessage, 'error');
    }
  }

  useEffect(() => {

    const userID = user?.user?.id || user?.id

    if (userID) {
      fetchTransaction(userID);
    }

  }, [user, balance])

  if(!expanses){
    return (
      <div className='flex bg-[#e5e7eb] rounded-md h-80 m-4'>
      <div className='flex flex-col items-center gap-2 w-48 mr-2 text-gray-700 overflow-y-scroll scrollbar-none'>

        <div className='mt-1 font-semibold'>Payment</div>

          <h1>Loading...</h1>
        </div>
        <hr className='w-[1px] h-full bg-gray-500' />
        <div className='flex flex-col items-center gap-2 w-48 mr-2 text-gray-700 overflow-y-scroll scrollbar-none'>

          <div className='mt-1 font-semibold'>Receipt</div>
          <h1>Loading...</h1>

          </div>
      </div>
      )
  }

  return (
    <div className='flex bg-[#e5e7eb] rounded-md h-80 m-4'>
      <div className='flex flex-col items-center gap-2 w-48 m-2 text-gray-700 overflow-y-scroll scrollbar-none'>

        <div className='font-semibold'>Payment</div>

        {expanses && expanses.filter((item) => item.category === 'loan' && item.credit === true).map((item) => (
          <div key={item.id} className='relative p-1 w-full h-12 rounded-md shadow-md bg-sky-300 m-1.5'>
            <div className='text-gray-700 text-xs'>{item.party}</div>
            <div className='absolute top-1 right-3 text-red-500 text-xs'>{item.amount}</div>
            <div className='absolute top-8 right-3 text-gray-700 text-[10px]'>{new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}, &nbsp;
              {new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
            <div className='flex absolute top-5 left-1'>
              <p className='text-gray-600 w-44 h-4 overflow-hidden text-[10px]'>{item.description}</p>
            </div>
          </div>
        ))}

      </div>
      <hr className='w-[1px] h-full bg-gray-500' />
      <div className='flex flex-col items-center gap-2 w-48 m-2 text-gray-700 overflow-y-scroll scrollbar-none'>

        <div className='font-semibold'>Receipt</div>

        {expanses && expanses.filter((item) => item.category === 'loan' && item.debit === true).map((item) => (
          <div key={item.id} className='relative p-1 w-full h-12 rounded-md shadow-md bg-blue-300 m-1.5'>
            <div className='text-gray-700 text-xs'>{item.party}</div>
            <div className='absolute top-1 right-3 text-green-600 text-xs'>{item.amount}</div>
            <div className='absolute top-8 right-3 text-gray-700 text-[10px]'>{new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}, &nbsp;
              {new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>
            <div className='flex absolute top-5 left-1'>
              <p className='text-gray-600 w-44 h-4 overflow-hidden text-[10px]'>{item.description}</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Categories
