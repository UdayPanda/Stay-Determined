import Toast from "../Templates/Toast";
import Loader from "../Templates/Loader";
import { useState } from "react";
import PlanItem from "../PlanComponents/PlanItem";
import AddPlan from "../PlanComponents/AddPlan";
import "../../App.css"

const Plans = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const day = new Date(date).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
    
    // Refresh plans if it's a success message
    if (type === "success") {
      setRefreshKey(Date.now());
    }
  };

  return (
    <>
      <h2 className="font-dancing-script absolute top-16 lg:top-20 right-44 lg:right-48 text-xl md:text-xl lg:text-2xl text-white animate-fadeInSlide">
        {days[day]}
      </h2>

      <input
        type="date"
        className="absolute outline-none top-16 lg:top-20 right-6 lg:right-10 text-sm lg:text-md bg-white text-gray-600 w-32 rounded-md p-1"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          Manage Your Plans
        </h1>
        <p className="text-slate-400 text-md lg:text-lg">
          Stay organized and keep track of your daily plans with ease.
        </p>
      </div>

      <div className="flex item-center justify-center flex-col lg:flex-row w-[90%] mx-auto gap-4 lg:max-h-screen">
        <div className="bg-[#1de8da82] lg:w-1/3 backdrop-blur-md border max-h-screen border-white/20 text-white rounded-xl p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Your Plans</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2z"
              />
            </svg>
          </div>

          <PlanItem onError={showToast} refreshKey={refreshKey} />
        </div>

        {/* right section */}
        <div className="bg-white/5 lg:w-2/3 backdrop-blur-md border custom-scrollbar border-white/10 border-dashed text-white rounded-xl flex items-center justify-center min-h-[400px]">
          {isAddingPlan ? <AddPlan setIsAddingPlan={setIsAddingPlan} onError={showToast} onSuccess={showToast} /> : ""}

          {/* Add New Plan Card */}
          <div className= {`text-center ${isAddingPlan ? "hidden" : "block"}`}>
            <div className= "w-12 h-12 bg-white/10 cursor-pointer rounded-full flex items-center justify-center mx-auto mb-4"
              onClick={() => setIsAddingPlan(true)}>
              <span className="text-2xl">+</span>
            </div>
            <p className="text-white/60">Add New Plan</p>
          </div>
        </div>
      </div>

      <div className="relative">{loading ? <Loader /> : <div></div>}</div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          show={toast.show}
        />
      )}
    </>
  );
};

export default Plans;
