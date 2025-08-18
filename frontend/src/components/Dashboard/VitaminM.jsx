import { useState } from 'react'
import Categories from '../Expanse/Categories';
import Tasks from '../Expanse/Tasks';
import Toast from '../Templates/Toast';
import ExpanseForm from '../Expanse/ExpanseForm';
import { ExpanseProvider } from '../../contexts/ExpanseContext';
import { ArrowDownIcon, ArrowUpIcon, CheckSquareIcon, CreditCardIcon } from 'lucide-react';
import Credit from '../Expanse/Credit';
import Debit from '../Expanse/Debit';

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

      <h2 className='font-dancing-script absolute top-16 lg:top-20 right-44 lg:right-48 text-xl md:text-xl lg:text-2xl text-white animate-fadeInSlide'>{days[day]}</h2>

      <input
        type="date"
        className='absolute outline-none top-16 lg:top-20 right-6 lg:right-10 text-sm lg:text-md bg-white text-gray-600 w-32 rounded-md p-1'
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="text-center mb-4">
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">VitaminM Expense Manager</h1>
          <p className="text-slate-400 text-md lg:text-lg">Track your daily transactions and manage your finances efficiently</p>
        </div>

      {/* <div className='md:flex items-center justify-items-stretch justify-evenly gap-4'>

        <ExpanseProvider>

          <Transactions onError={showToast} />

          <Categories onError={showToast} />

          <Tasks onError={showToast} />

          <ExpanseForm onError={showToast} />

        </ExpanseProvider>


      </div> */}

      <div className="min-h-screen text-white">
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <ExpanseProvider>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Debit Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-red-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowDownIcon className="w-4 h-4 text-red-400" />
                  Debit
                </h3>
                <span className="text-red-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <Debit onError={showToast} />
            </div>
          </div>

          {/* Credit Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-green-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-400" />
                  Credit
                </h3>
                <span className="text-green-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <Credit onError={showToast} />
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-blue-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-blue-400" />
                  Payment
                </h3>
                <span className="text-blue-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <Categories onError={showToast} />
            </div>
          </div>

          {/* Tasks Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-purple-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CheckSquareIcon className="w-4 h-4 text-purple-400" />
                  Tasks
                </h3>
                <span className="text-purple-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto custom-scrollbar">
              <Tasks onError={showToast} />
            </div>
          </div>
        </div>

        <ExpanseForm onError={showToast} />

        </ExpanseProvider>
        
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
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
