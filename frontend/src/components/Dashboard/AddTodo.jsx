import { TodoProvider } from "../../contexts";
import { useState } from "react";
import TodoForm from "../Todo/TodoForm";
import Toast from "../Templates/Toast";

function AddTodo() {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000
    );
  };

  return (
    <>
      <TodoProvider >
        <div className="text-center mb-10">
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Add Task Todo
          </h1>
          <p className="text-slate-400 text-md lg:text-lg">
            Add your tasks and manage them efficiently with our Todo app.
          </p>
        </div>
        <TodoForm onError={setToast} />
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
