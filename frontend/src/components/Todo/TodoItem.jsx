import { useState } from "react";
import { useTodo } from "../../contexts";

function TodoItem({ todo }) {
  const { updateTodo, handlePromptOpen, toggleComplete } = useTodo();
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.title);
  const [todoLabel, setTodoLabel] = useState(todo.label);

  const labelColor = { 1: "text-[#32A3F5]", 2: "text-[#f52987]", 3: "text-[#32C64A]", 4: "text-[#F5BC20]", };

  const editTodo = () => {
    if (todoMsg.trim() === "") return;
    updateTodo(todo._id, { ...todo, title: todoMsg, label: Number(todoLabel) });
    setIsTodoEditable(false);
  };

  const toggleCompleted = () => {
    toggleComplete(todo._id);
    setIsTodoEditable(false);
  };

  const canEdit = !todo.completed;

  return (
    <div
      className={`flex items-center justify-between w-full min-w-[280px] px-4 py-3 rounded-2xl shadow-md transition-all duration-300 cursor-grab
        ${todo.completed ? "bg-green-300" : "bg-[#e1d7b7] hover:shadow-lg"}
      `}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        className="w-5 h-5 cursor-pointer accent-blue-500"
        checked={todo.completed}
        onChange={toggleCompleted}
        aria-label="Mark as completed"
      />

      {/* Todo Content */}
      <div className="relative flex flex-col w-[70%]">
        {/* Todo Title */}
        <input
          type="text"
          className={`w-full bg-transparent text-base lg:text-lg font-medium tracking-tight outline-none rounded-md transition
            ${isTodoEditable ? "border border-gray-300 px-2 py-1" : "border-none"}
            ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}
          `}
          value={todoMsg}
          onChange={(e) => setTodoMsg(e.target.value)}
          readOnly={!isTodoEditable}
          maxLength={200}
          aria-label="Todo text"
        />

        {/* Label Dropdown */}
        <select
          className={`mt-2 w-fit text-xs lg:text-sm font-semibold rounded-md px-2 py-1 border-none focus:ring-2 focus:ring-blue-300 transition
            ${!isTodoEditable ? "opacity-60 cursor-not-allowed bg-transparent" : "bg-gray-50"}  ${ labelColor[todoLabel] }
          `}
          value={todoLabel}
          onChange={(e) => setTodoLabel(e.target.value)}
          disabled={!isTodoEditable}
          aria-label="Todo label"
        >
          <option value="1" className="text-blue-500">
            Urgent but not Important
          </option>
          <option value="2" className="text-pink-500">
            Important but not Urgent
          </option>
          <option value="3" className="text-green-500">
            Urgent and Important
          </option>
          <option value="4" className="text-yellow-500">
            Other
          </option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 text-xs lg:text-sm font-medium rounded-xl transition
            ${isTodoEditable ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-100 text-blue-500 hover:bg-gray-200"}
            ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => {
            if (!canEdit) return;
            if (isTodoEditable) {
              editTodo();
            } else setIsTodoEditable((prev) => !prev);
          }}
          disabled={!canEdit}
          aria-label={isTodoEditable ? "Save todo" : "Edit todo"}
        >
          {isTodoEditable ? "Save" : "Edit"}
        </button>

        <button
          className="px-3 py-1 text-xs lg:text-sm font-medium text-red-500 bg-gray-100 rounded-xl hover:bg-red-100 transition"
          onClick={() => handlePromptOpen && handlePromptOpen(todo._id)}
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
