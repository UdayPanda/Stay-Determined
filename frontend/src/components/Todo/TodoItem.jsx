import { useState } from "react";
import { useTodo } from "../../contexts";

function TodoItem({ todo, updateTodo: propUpdate, toggleComplete: propToggle, handlePromptOpen: propPrompt }) {

  const { updateTodo: ctxUpdate, toggleComplete: ctxToggle, handlePromptOpen: ctxPrompt } = useTodo() || {};

  const updateTodo = propUpdate || ctxUpdate;
  const toggleComplete = propToggle || ctxToggle;
  const handlePromptOpen = propPrompt || ctxPrompt;

  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.title);
  const [todoLabel, setTodoLabel] = useState(todo.label);

  const labelColor = {
    1: "text-[#32A3F5]",
    2: "text-[#f52987]",
    3: "text-[#32C64A]",
    4: "text-[#F5BC20]",
  };

  const editTodo = async () => {
    if (todoMsg.trim() === "") return;

    const payload = { ...todo, title: todoMsg };

    if (typeof updateTodo === "function") {
      await updateTodo(todo._id, payload);
    }

    setIsTodoEditable(false);
  };

  const toggleCompleted = async () => {
    if (typeof toggleComplete === "function") {
      await toggleComplete(todo._id);
    } else if (typeof updateTodo === "function") {
      await updateTodo(todo._id, { ...todo, completed: !todo.completed });
    }

    setIsTodoEditable(false);
  };

  return (
    <div
      className={`flex justify-between items-center h-20 border border-black/10 rounded-lg px-3 py-1.5 gap-x-1 lg:gap-x-3 shadow-sm duration-300 text-black ${
        todo.completed ? "bg-[#c6e9a7]" : "bg-[#e1d7b7]"
      }`}
      style={{ width: "100%", minWidth: "260px" }}
    >
      <input
        type="checkbox"
        className="w-5 h-5 cursor-pointer accent-blue-500"
        checked={todo.completed}
        onChange={toggleCompleted}
        aria-label="Mark as completed"
      />

      <div className="flex flex-col gap-4 relative h-[70px] w-[60%]">
        <input
          type="text"
          className={`w-full ml-2 text-xs mt-2 lg:text-lg bg-transparent font-medium tracking-tight outline-none rounded-md transition
            ${isTodoEditable ? "border border-gray-300 px-2 py-1" : "border-none"}
            ${todo.completed ? "line-through text-gray-400" : "text-gray-800"}`}
          value={todoMsg}
          onChange={(e) => setTodoMsg(e.target.value)}
          readOnly={!isTodoEditable}
          maxLength={200}
        />

        <select
          className={`absolute left-1 w-[150px] lg:w-[250px] font-bold top-9 text-[9px] lg:text-sm rounded bg-white border border-gray-300 px-2 py-1 ${!isTodoEditable ? "opacity-60 cursor-not-allowed bg-transparent" : "bg-gray-50"} ${labelColor[todoLabel]}`}
          value={todoLabel}
          onChange={async (e) => {
            const newLabel = Number(e.target.value);
            setTodoLabel(newLabel);

            if (typeof updateTodo === "function") {
              await updateTodo(todo._id, { ...todo, label: newLabel });
            }
          }}
          disabled={!isTodoEditable}
        >
          <option value="1">Urgent but not Important</option>
          <option value="2">Important but not Urgent</option>
          <option value="3">Urgent and Important</option>
          <option value="4">Other</option>
        </select>
      </div>

      <button
        className={`inline-flex h-7 mt-2 px-2 text-xs lg:text-sm text-blue-500 rounded-lg border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 ${
          todo.completed ? "cursor-not-allowed opacity-60" : ""
        }`}
        onClick={async () => {
          if (todo.completed) return;

          if (isTodoEditable) {
            await editTodo();
          } else {
            setIsTodoEditable(true);
          }
        }}
        disabled={todo.completed}
      >
        {isTodoEditable ? "Save" : "Edit"}
      </button>

      <button
        className="inline-flex h-7 mt-2 px-2 text-red-500 rounded-lg text-xs lg:text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
        onClick={() => {
          if (typeof handlePromptOpen === "function") {
            handlePromptOpen(todo._id);
          }
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;