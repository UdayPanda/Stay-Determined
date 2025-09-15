import { useState } from "react";
import { useAuth, useTodo } from "../../contexts";
import Toast from "../Templates/Toast";

function TodoForm(onError) {
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [label, setLabel] = useState("");
  const [scheduledFor, setScheduledFor] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [reminderTime, setReminderTime] = useState("");
  const [isExpanse, setIsExpanse] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const { addTodo, error } = useTodo();
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
  };

  const add = (e) => {
    e.preventDefault();
    if (!todo || !label) {
      showToast("Please enter todo and select label", "error");
      return false;
    }
    if (user) {
      addTodo({
        title: todo,
        user: userID,
        completed: isCompleted,
        date: date,
        label: label,
        scheduledFor: scheduledFor,
        reminder: !!reminderTime,
        reminderTime: reminderTime,
        expanse: isExpanse,
      });
      if (error !== null) {
        showToast(error, "error");
      }else{
        showToast("Todo added successfully", "success");
      }
      setTodo("");
      setIsCompleted(false);
      setDate(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setLabel("");
      setScheduledFor(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });
      setReminderTime("");
      setIsExpanse(false);
    } else {
      showToast("Please login to add todo", "error");
    }
  };

  return (
    <>
      <form
        onSubmit={add}
        className="max-w-lg mx-10 lg:mx-auto mt-10 bg-blue-300 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 border border-gray-200"
      >
        <div className="flex justify-between items-center mb-2">
          <input
            type="date"
            className="text-sm bg-white border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="completed"
              className="accent-green-600 w-5 h-5 transition"
              checked={isCompleted}
              onChange={() => setIsCompleted(!isCompleted)}
            />
            <label
              htmlFor="completed"
              className="text-green-700 font-semibold text-sm select-none"
            >
              Completed
            </label>
          </div>
        </div>

        <input
          type="text"
          placeholder="Write your todo..."
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-blue-400 transition outline-none"
          value={todo}
          maxLength={200}
          onChange={(e) => setTodo(e.target.value)}
        />

        <div className="flex justify-end gap-4 items-center h-[20px]">
                <label className="block text-gray-700 text-sm font-semibold">
                  Expanse:
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExpanse}
                    onChange={() => setIsExpanse(!isExpanse)}
                    className="sr-only peer"
                  />
                  <div className="relative w-10 h-5 bg-orange-500 rounded-full peer peer-checked:bg-blue-600 transition-all">
                    <div className="absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <span className="ml-3 text-gray-700 text-sm">
                    {isExpanse ? "Yes" : "No"}
                  </span>
                </label>
              </div>

        <span className="font-semibold text-gray-700">Label:</span>
        <div className="relative w-full max-w-xl h-40 border bg-white border-blue-600 shadow-xl rounded-lg mx-auto">
          {/* X Axis (Importance) */}

          <div className="absolute bottom-1/2 left-0 w-full h-[2px] bg-gray-500"></div>
          <span className="absolute bottom-1 right-2 text-xs font-semibold text-gray-600">
            Importance →
          </span>

          {/* Y Axis (Urgency) */}
          <div className="absolute left-1/2 top-0 h-full w-[2px] bg-gray-500"></div>
          <span className="absolute top-16 left-2 text-xs font-semibold text-gray-600 rotate-[-90deg] origin-left">
            Urgency →
          </span>

          {/* Quadrant Labels */}
          <span className="absolute top-2 left-2 lg:left-8 text-[#32A3F5] w-[150px] font-bold text-sm text-center p-2 rounded-lg">
            <label
              htmlFor="label-1"
              className="flex text-[12px] items-center gap-2 cursor-pointer hover:bg-blue-100 rounded-lg px-2 py-1 transition"
            >
              <input
                id="label-1"
                type="radio"
                name="label"
                value="1"
                checked={label === "1"}
                onChange={(e) => setLabel(e.target.value)}
                className="accent-[#32A3F5] w-5 h-5"
              />
              <span className="text-[#32A3F5] font-bold">
                Urgent but not important
              </span>
            </label>
          </span>

          <span className="absolute right-0 lg:right-8 top-2 text-[#32C64A] w-[150px] font-bold text-sm text-center p-2 rounded-lg">
            <label
              htmlFor="label-3"
              className="flex text-[12px] items-center gap-2 cursor-pointer hover:bg-green-100 rounded-lg px-2 py-1 transition"
            >
              <input
                id="label-3"
                type="radio"
                name="label"
                value="3"
                checked={label === "3"}
                onChange={(e) => setLabel(e.target.value)}
                className="accent-[#32C64A] w-5 h-5"
              />
              <span className="text-[#32C64A] font-bold">
                Urgent and important
              </span>
            </label>
          </span>

          <span className="absolute bottom-0 left-2 lg:left-8 text-[#F5BC20] w-[150px] font-bold text-sm text-center p-2 rounded-lg">
            <label
              htmlFor="label-4"
              className="flex text-[12px] items-center gap-2 cursor-pointer hover:bg-yellow-100 rounded-lg px-2 py-1 transition"
            >
              <input
                id="label-4"
                type="radio"
                name="label"
                value="4"
                checked={label === "4"}
                onChange={(e) => setLabel(e.target.value)}
                className="accent-[#F5BC20] w-5 h-5"
              />
              <span className="text-[#F5BC20] font-bold">
                Other (Neither urgent nor important)
              </span>
            </label>
          </span>

          <span className="absolute bottom-3 lg:bottom-2 right-0 lg:right-8 text-[#f52987] w-[150px] font-bold text-sm text-center p-2 rounded-lg">
            <label
              htmlFor="label-2"
              className="flex text-[12px] items-center gap-2 cursor-pointer hover:bg-pink-100 rounded-lg px-2 py-1 transition"
            >
              <input
                id="label-2"
                type="radio"
                name="label"
                value="2"
                checked={label === "2"}
                onChange={(e) => setLabel(e.target.value)}
                className="accent-[#f52987] w-5 h-5"
              />
              <span className="text-[#f52987] font-bold">
                Important but not urgent
              </span>
            </label>
          </span>
        </div>

        <div className="flex gap-4 items-center justify-between">
          <div className="flex flex-col gap-2">
            <label
              className="font-semibold text-gray-700"
              htmlFor="scheduledFor"
            > 
              Scheduled For:
            </label>
            <input
              type="date"
              id="scheduledFor"
              className="text-sm bg-white border border-gray-300 rounded-md px-1 py-1 focus:ring-2 focus:ring-blue-400 transition"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="font-semibold text-gray-700"
              htmlFor="reminderTime"
            >
              Reminder Time:
            </label>
            <input
              type="datetime-local"
              id="reminderTime"
              className="text-sm w-[150px] bg-white border border-gray-300 rounded-md py-1 focus:ring-2 focus:ring-blue-400 transition"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-bold shadow-lg hover:scale-105 hover:from-green-600 hover:to-blue-600 transition"
        >
          Add Todo
        </button>
      </form>

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

export default TodoForm;
