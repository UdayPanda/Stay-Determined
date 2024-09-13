import React, { useState } from 'react'
import { useTodo } from '../../contexts'

function TodoItem({ todo }) {

    const { updateTodo, removeTodo, toggleComplete } = useTodo()

    const [isTodoEditable, setIsTodoEditable] = useState(false)

    const [todoMsg, setTodoMsg] = useState(todo.title)

    const labelInfo = {
        1: "Urgent but not Important",
        2: "Important but not Urgent",
        3: "Urgent and Important",
        4: "Other"
    }

    const labelColor = {
        1: "text-[#32A3F5]",
        2: "text-[#f52987]",
        3: "text-[#32C64A]",
        4: 'text-[#F5BC20]'
    }

    const editTodo = () => {
        updateTodo(todo._id, { ...todo, title: todoMsg })
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggleComplete(todo._id)
    }

    return (
        <div
            className={`flex justify-between h-20 border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300  text-black ${todo.completed ? "bg-[#c6e9a7]" : "bg-[#e1d7b7]"}
                }`}
        >
            <input
                type="checkbox"
                className="cursor-pointer relative top-0 left-0"
                checked={todo.completed}
                onChange={toggleCompleted}
            />
            <div className='relative w-[80%]'>
                <input
                    type="text"
                    className={`border mt-2 text-gray-700 text-xl outline-none w-full bg-transparent rounded-lg ${isTodoEditable ? "border-black/10 px-2" : "border-transparent"
                        } ${todo.completed ? "line-through" : ""}`}
                    value={todoMsg}
                    onChange={(e) => setTodoMsg(e.target.value)}
                    readOnly={!isTodoEditable}
                />

                <p className={`absolute left-1 font-bold ${labelColor[todo.label]} top-11 -translate-y-1/2 text-sm`} >{labelInfo[todo.label]}</p>
            </div>

            {/* Edit, Save Button */}
            <button
                className="inline-flex h-7 mt-5 px-2 text-blue-500 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                onClick={() => {
                    if (todo.completed) return;

                    if (isTodoEditable) {
                        editTodo();
                    } else setIsTodoEditable((prev) => !prev);
                }}
                disabled={todo.completed}
            >
                {isTodoEditable ? "Save" : "Edit"}
            </button>
            {/* Delete Todo Button */}
            <button
                className="inline-flex h-7 mt-5 px-2 text-red-500 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
                onClick={() => removeTodo && removeTodo(todo._id)}
            >
                Delete
            </button>
        </div>
    );
}

export default TodoItem;
