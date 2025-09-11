import { createContext, useContext, useState } from "react";
import { apiClient } from "../lib/apiClient";
import { ADD_TODO, GET_TODOS } from "../utils/constants";

export const TodoContext = createContext({
  todos: [],
  loading: false,
  error: null,
  fetchTodos: () => {},
  addTodo: () => {},
  removeTodo: () => {},
  updateTodo: () => {},
  toggleComplete: () => {},
});

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = async (userId, date) => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        GET_TODOS,
        { user: userId, date },
        { headers: { "Content-Type": "application/json" } }
      )
      console.log(response.data.todos);
      
      setTodos(response.data.todos);
    } catch (err) {
      setError(err.response?.data?.message || "Todos failed to fetch.");
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo) => {
      try {
        const response = await apiClient.post(ADD_TODO, todo, {
          headers: { "Content-Type": "application/json" },
        });
        setTodos((prev) => [...prev, response.data.todo]);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to add todo.");
      }
    };

  const removeTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const updateTodo = (id, updatedFields) => {
    setTodos((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        fetchTodos,
        addTodo,
        removeTodo,
        updateTodo,
        toggleComplete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);
