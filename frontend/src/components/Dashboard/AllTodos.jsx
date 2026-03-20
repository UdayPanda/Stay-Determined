
import { useAuth } from "../../contexts";
import { useEffect, useState } from "react";
import TodoItem from "../Todo/TodoItem";
import { apiClient } from "../../lib/apiClient";
import { DELETE_TODO, GET_TODOS, UPDATE_TODO } from "../../utils/constants";
import Toast from "../Templates/Toast";
import Loader from "../Templates/Loader";
import Prompt from "../Templates/Prompt";

function AllTodos({ label }) {
  const { user } = useAuth();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [todoLabel, setTodoLabel] = useState(label || 0);

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [showPrompt, setShowPrompt] = useState(false);
  const [promptTodoId, setPromptTodoId] = useState(null);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const labelInfo = {
    1: "Urgent but not Important",
    2: "Important but not Urgent",
    3: "Urgent and Important",
    4: "Other",
  };

  const countCompleted = todos.filter((todo) => todo.completed).length;

  const day = new Date(date + "T00:00:00").getDay();

  const showToast = (message, type) => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handlePromptOpen = (todoId) => {
    setPromptTodoId(todoId);
    setShowPrompt(true);
  };

  const handleConfirm = () => {
    if (promptTodoId) removeTodo(promptTodoId);
    setShowPrompt(false);
    setPromptTodoId(null);
  };

  const handleCancel = () => {
    setShowPrompt(false);
    setPromptTodoId(null);
  };

  const todosFilterByLabelProvidedInProp = (fetchedTodos) => {
    if (Array.isArray(fetchedTodos)) {
      const filtered = fetchedTodos.filter(
        (todo) => todo.label === Number(todoLabel)
      );
      setTodos(filtered);
    }
  };

  const fetchTodos = async (userId, date) => {
    setLoading(true);

    try {
      const response = await apiClient.post(
        GET_TODOS,
        { user: userId, date },
        { headers: { "Content-Type": "application/json" } }
      );

      const fetchedTodos = response.data.todos;

      if (todoLabel > 0) {
        todosFilterByLabelProvidedInProp(fetchedTodos);
      } else {
        setTodos(fetchedTodos);
      }
    } catch (error) {
      let errorMessage = "Something went wrong.";

      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id, todo) => {
    try {
      const response = await apiClient.post(
        UPDATE_TODO,
        { id, todo },
        { headers: { "Content-Type": "application/json" } }
      );

      const updated = response.data?.todo;

      if (updated) {
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? updated : t))
        );
      }

      showToast("Todo saved successfully!", "success");
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

  const removeTodo = async (id) => {
    setLoading(true);

    try {
      await apiClient.delete(`${DELETE_TODO}/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      setTodos((prev) => prev.filter((t) => t._id !== id));

      showToast("Todo deleted successfully!", "success");
    } catch (error) {
      let errorMessage = "Something went wrong.";

      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }

      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    const updatedTodo = { ...todo, completed: !todo.completed };

    setTodos((prev) =>
      prev.map((t) => (t._id === id ? updatedTodo : t))
    );

    await updateTodo(id, updatedTodo);
  };

  useEffect(() => {
    const userID = user?.user?.id || user?.id;

    if (userID) fetchTodos(userID, date);
    else showToast("Please login again!", "error");
  }, [user, date, todoLabel]);

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

    return () => clearTimeout(timer);
  }, [todos]);

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

      <select
        className="rounded-md w-[80px] lg:w-[150px] text-sm outline-none px-1 absolute top-40 right-6 lg:right-10"
        onChange={(e) => setTodoLabel(Number(e.target.value))}
      >
        <option value="0">Filter</option>
        <option value="1">Urgent but not Important</option>
        <option value="2">Important but not Urgent</option>
        <option value="3">Urgent and Important</option>
        <option value="4">Other</option>
      </select>

      <div className="text-center mb-10">
        <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
          {label && label > 0 ? labelInfo[label] : "All"} Task Todos
        </h1>

        <p className="text-slate-400 text-md lg:text-lg">
          Filter your todos by selecting a label or date.
        </p>
      </div>

      <div className="text-gray-400 text-md mt-2 mx-auto w-[80%] lg:w-[60%]">
        Total Todos {todos.length} / Completed {countCompleted}
      </div>

      {loading && <Loader />}

      <div className="flex flex-col gap-y-3 w-[80%] lg:w-[60%] mx-auto mt-8">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            updateTodo={updateTodo}
            toggleComplete={toggleComplete}
            handlePromptOpen={handlePromptOpen}
          />
        ))}
      </div>

      <Prompt
        isOpen={showPrompt}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

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

export default AllTodos;