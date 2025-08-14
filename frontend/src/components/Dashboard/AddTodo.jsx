import { TodoProvider } from "../../contexts";
import { useState } from "react";
import TodoForm from "../Todo/TodoForm";
import { apiClient } from "../../lib/apiClient";
import { ADD_TODO } from "../../utils/constants";
import Toast from "../Templates/Toast";

function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
  };

  const addTodo = async (todo) => {
    try {
      const response = await apiClient.post(ADD_TODO, todo, {
        headers: { "Content-Type": "application/json" },
      });
      setTodos((prev) => [...prev, response.data.todo]);
      showToast("Todo added successfully!", "success");
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

  return (
    <>
      <TodoProvider value={{ todos, addTodo }}>
        <div className="text-center mb-10">
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Add Task Todo
          </h1>
          <p className="text-slate-400 text-md lg:text-lg">
            Add your tasks and manage them efficiently with our Todo app.
          </p>
        </div>
        <div className="w-[80%] lg:w-[50%] mx-auto bg-blue-300 p-4 rounded-md relative mb-4">
          <TodoForm />
        </div>
      </TodoProvider>

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

export default AddTodo;
