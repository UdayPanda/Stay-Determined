import React, { useEffect, useState } from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../contexts";
import {
  ADD_NOTES,
  DELETE_NOTE,
  GET_NOTES,
  GET_TODOS,
} from "../../utils/constants";
import { apiClient } from "../../lib/apiClient";
import Toast from "../Templates/Toast";
import Loader from "../Templates/Loader";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function TodoGraph() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
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
  const [chartData, setChartData] = useState({
    ubni: 0,
    ibnu: 0,
    unb: 0,
    other: 0,
  });
  const [chartKey, setChartKey] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
  };

  const fetchTodos = async (userId, date) => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        GET_TODOS,
        { user: userId, date: date },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);

      setTodos(response.data.todos);
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      setLoading(false);

      showToast(errorMessage, "error");
    }
  };

  const userID = user?.user?.id || user?.id;

  const [notes, setNotes] = useState([
    { id: 1, content: "", user: userID, date },
  ]);

  const updateNote = (id, content) => {
    setNotes(
      notes.map((note) => (note._id === id ? { ...note, content } : note))
    );
  };

  const addNote = () => {
    const newId = Math.max(...notes.map((n) => n.id)) + 1;
    setNotes([...notes, { id: newId, content: "", user: userID, date }]);
  };

  const getAllNotes = async (userID, date) => {
    try {
      const response = await apiClient.post(
        GET_NOTES,
        { user: userID, date },
        { headers: { "Content-Type": "application/json" } }
      );

      // console.table(response.data.notes)
      setNotes(response.data.notes);
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showToast(errorMessage, "error");
    }
  };

  const saveNote = async () => {
    const notesToSave = notes.filter((note) => note?.content?.trim());

    try {
      const response = await apiClient.post(
        ADD_NOTES,
        { notes: notesToSave },
        { headers: { "Content-Type": "application/json" } }
      );

      const newNotes = Array.isArray(response.data.notes)
        ? response.data.notes
        : [response.data.notes];

      // setNotes((prev) => [...prev, ...response.data.notes]);
      setNotes(newNotes);
      console.log(newNotes);
      console.log(notes);

      showToast("Journal saved!", "success");
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showToast(errorMessage, "error");
    }
  };

  const deleteNote = async (id) => {
    try {
      await apiClient.delete(`${DELETE_NOTE}/${id}`, {
        headers: { "Content-Type": "application/json" },
      });
      showToast("Journal deleted successfully", "success");
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    const userID = user?.user?.id || user?.id;

    if (userID) {
      fetchTodos(userID, date);
    }

    if (userID) {
      getAllNotes(userID, date);
    }

    if (userID == undefined) {
      showToast("Please login again!", "error");
    }
  }, [user, date, setNotes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !todos.some((todo) => {
          const todoDate = new Date(todo.date).toISOString().split("T")[0];
          return todoDate === date;
        })
      ) {
        showToast("Please add todos.....", "info");
      }
    }, 1000);

    const counts = todos.reduce(
      (acc, todo) => {
        switch (todo.label) {
          case 1:
            acc.ubni++;
            break;
          case 2:
            acc.ibnu++;
            break;
          case 3:
            acc.unb++;
            break;
          case 4:
            acc.other++;
            break;
          default:
            break;
        }
        return acc;
      },
      { ubni: 0, ibnu: 0, unb: 0, other: 0 }
    );

    setChartData(counts);

    return () => clearTimeout(timer);
  }, [todos]);

  const data = {
    labels: [
      "Urgent but not Important",
      "Important but not Urgent",
      "Urgent and Important",
      "Other",
    ],
    datasets: [
      {
        label: "Todos",
        data: [chartData.ubni, chartData.ibnu, chartData.unb, chartData.other],
        backgroundColor: [
          "rgba(32, 163, 245)",
          "rgba(245, 32, 135)",
          "rgba(32, 245, 64)",
          "rgba(245, 188, 32)",
        ],
        borderColor: [
          "rgba(32, 163, 245)",
          "rgba(245, 32, 135)",
          "rgba(32, 245, 64)",
          "rgba(245, 188, 32)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "rgba(32, 163, 245, 0.7)",
          "rgba(245, 32, 135, 0.7)",
          "rgba(32, 245, 64, 0.7)",
          "rgba(245, 188, 32, 0.7)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        grid: {
          color: "rgb(100, 116, 139)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setChartKey((prevKey) => prevKey + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [chartData]);

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

      <h1 className="text-2xl text-white font-bold text-center m-5 mt-10 lg:mt-2">
        Manage Your Todos
      </h1>

      <div className="relative">
        <div className="w-[75%] lg:w-[40%] text-white ml-[15%] lg:ml-[30%]">
          <PolarArea data={data} key={chartKey} options={options} />
        </div>

        <div className="absolute top-70 lg:top-80 right-20">
          <div className="text-white text-md font-bold m-2">
            Upcoming Todos: {todos.length}
          </div>

          <div className="flex items-center justify-items-start gap-2">
            <div className="w-4 h-4 rounded-md bg-[#32A3F5]"></div>
            <p className="text-white">Urgent but not Important</p>
          </div>

          <div className="flex items-center justify-items-start gap-2">
            <div className="w-4 h-4 rounded-md bg-[#f52987]"></div>
            <p className="text-white">Important but not Urgent</p>
          </div>

          <div className="flex items-center justify-items-start gap-2">
            <div className="w-4 h-4 rounded-md bg-[#32C64A]"></div>
            <p className="text-white">Urgent and Important</p>
          </div>

          <div className="flex items-center justify-items-start gap-2">
            <div className="w-4 h-4 rounded-md bg-[#F5BC20]"></div>
            <p className="text-white">Other</p>
          </div>
        </div>

        <div>
          <div className="max-w-6xl rounded-xl mx-auto mt-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Journal Here
              </h1>
              <p className="text-slate-600">
                Capture your thoughts, ideas, and reflections
              </p>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {notes.map((note, index) => (
                <div
                  key={note._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-1"
                >
                  <div className="relative">
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note._id, e.target.value)}
                      placeholder={`Note ${index + 1}...`}
                      className="w-full h-48 p-4 border-0 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-slate-700 placeholder-slate-400 bg-transparent"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        lineHeight: "1.6",
                      }}
                    />
                    {/* Note number indicator */}
                    <div className="absolute top-1 right-5 bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </div>
                    <span
                      className={`absolute top-0 right-2 text-xl cursor-pointer ${
                        !note._id ? "opacity-40 cursor-default" : ""}`}
                      title="Delete"
                      onClick={
                        note._id ? () => deleteNote(note._id) : undefined
                      }
                    >&#8942;
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Note Button */}
            <div className="text-center flex justify-center">
              <button
                onClick={addNote}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Note
              </button>

              <button
                onClick={saveNote}
                className="inline-flex items-center ml-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Save
              </button>
            </div>

            {/* Stats */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-6 text-sm text-slate-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {notes.filter((note) => note.content.trim()).length} notes
                  with content
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mr-2"></div>
                  {notes.length} total notes
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? <Loader /> : <div></div>}
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
  );
}

export default TodoGraph;
