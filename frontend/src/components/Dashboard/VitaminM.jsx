import React, { useEffect, useState } from 'react'
import Transactions from '../Expanse/Transactions';
import Categories from '../Expanse/Categories';
import Tasks from '../Expanse/Tasks';
import Toast from '../Templates/Toast';
import ExpanseForm from '../Expanse/ExpanseForm';
import { ExpanseProvider } from '../../contexts/ExpanseContext';

function VitaminM() {

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  })
  const day = new Date(date).getDay();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prevToast) => ({ ...prevToast, show: false })), 3000);

  };

  return (
    <div>

      <h2 className='font-dancing-script absolute top-20 right-48 text-white text-2xl animate-fadeInSlide'>{days[day]}</h2>

      <input
        type="date"
        className='absolute outline-none top-20 right-10 bg-white text-gray-600 w-32 rounded-md p-1'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <h1 className="text-2xl text-white font-bold text-center m-5 mt-2">VitaminM Expanse Manager</h1>

      <div className='md:flex items-center justify-items-stretch justify-evenly gap-4'>

        <ExpanseProvider>

          <Transactions onError={showToast} />

          <Categories onError={showToast} />

          <Tasks onError={showToast} />

          <ExpanseForm onError={showToast} />

        </ExpanseProvider>


      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          show={toast.show}
        />
      )}

    </div>
  )
}

export default VitaminM
