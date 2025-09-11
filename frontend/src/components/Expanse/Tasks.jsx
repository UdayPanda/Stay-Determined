import { useEffect, useState } from "react";
import { useAuth, useTodo } from "../../contexts";

function Tasks({ onError }) {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { todos, fetchTodos, error } = useTodo();

  useEffect(() => {
    const userID = user?.user?.id || user?.id;

    if (userID) {
      fetchTodos(userID, date);
      if(error !== null) {
        onError(error, "error");
      }
    }
  }, [user]);

  const toggleTask = (taskId) => {
    
    console.log(taskId);
  };

  return (
    <div className="">
      {todos &&
        todos
          .filter((task) => task.expanse === true)
          .map((item) => (
            <div
              key={item._id}
              className="mb-3 last:mb-0 p-2 rounded-lg hover:bg-purple-500/5 transition-colors"
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleTask(item._id)}
                  className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span
                  className={`text-sm transition-all ${
                    item.completed
                      ? "text-slate-500 line-through"
                      : "text-slate-300"
                  }`}
                >
                  {item.title}
                </span>
              </label>
            </div>
          ))}
    </div>
  );
}

export default Tasks;
