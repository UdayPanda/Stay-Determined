import { useEffect, useState } from "react";
import Categories from "../Expanse/Categories";
import Tasks from "../Expanse/Tasks";
import Toast from "../Templates/Toast";
import ExpanseForm from "../Expanse/ExpanseForm";
import { ExpanseProvider, useExpanse } from "../../contexts/ExpanseContext";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckSquareIcon,
  CreditCardIcon,
} from "lucide-react";
import Credit from "../Expanse/Credit";
import Debit from "../Expanse/Debit";
import { TodoProvider } from "../../contexts";
import Loader from "../Templates/Loader";
import BulkUploadButton from "../Expanse/BulkUploadButton";
import EditableExcelModal from "../Expanse/EditableExcelModal";

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth());
  const end = new Date(now.getFullYear(), now.getMonth() + 1);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function VitaminM() {
  const monthRange = getMonthRange();
  const [dateRange, setDateRange] = useState({
    start: monthRange.start,
    end: monthRange.end,
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const { error, loading, balance } = useExpanse();
  const [uploadedExcel, setUploadedExcel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000,
    );
  };

  const handleExcelData = (data) => {
    setUploadedExcel(data);
    setShowModal(true); // open popup
  };

  useEffect(() => {
    if (error !== null) showToast(error, "error");
  }, [error]);

  useEffect(() => {
    if (loading) {
      return <Loader />;
    }
  }, [loading]);

  return (
    <ExpanseProvider>
    <div className="relative">
      <div className="absolute lg:top-[-60px] top-[-85px] lg:right-6 right-4 flex items-center gap-4 justify-end">
        <label className="text-white text-xs">From:</label>
        <input
          type="date"
          className="outline-none text-xs bg-white text-gray-600 rounded-md p-1"
          value={dateRange.start}
          max={dateRange.end}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, start: e.target.value }))
          }
        />
        <label className="text-white text-xs">To:</label>
        <input
          type="date"
          className="outline-none text-xs bg-white text-gray-600 rounded-md p-1"
          value={dateRange.end}
          min={dateRange.start}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, end: e.target.value }))
          }
        />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          VitaminM Expense Manager
        </h1>
        <p className="text-slate-400 text-md lg:text-lg">
          Track your daily transactions and manage your finances efficiently
        </p>
      </div>

      <div className="absolute lg:top-16 top-24 lg:right-[160px] right-20">
        <BulkUploadButton onExcelExtract={handleExcelData} />
      </div>

      <div className="min-h-screen text-white">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* <ExpanseProvider> */}
            <TodoProvider>
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
                      <span className="text-red-400 text-sm font-medium">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <Debit dateRange={dateRange} />
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
                      <span className="text-green-400 text-sm font-medium">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <Credit dateRange={dateRange} />
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
                      <span className="text-blue-400 text-sm font-medium">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <Categories dateRange={dateRange} />
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
                      <span className="text-purple-400 text-sm font-medium">
                        ↑
                      </span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <Tasks onError={showToast} />
                  </div>
                </div>
              </div>

              <ExpanseForm onError={showToast} dateRange={dateRange} />
            </TodoProvider>
          {/* </ExpanseProvider> */}
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

      {showModal && (
        <EditableExcelModal
          excelData={uploadedExcel}
          onClose={() => setShowModal(false)}
        />
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          show={toast.show}
        />
      )}
    </div>
    </ExpanseProvider>
  );
}

export default VitaminM;
