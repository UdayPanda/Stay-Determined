import { useEffect, useState } from "react";
import { useAuth, useTodo } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { ADD_EXPANSE } from "../../utils/constants";
import { useExpanse } from "../../contexts/ExpanseContext.jsx";

function ExpanseForm({ onError, dateRange }) {
  const { balance, setDateRange, refreshExpanses } = useExpanse();
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;
  const { todos, fetchTodos, error } = useTodo();
  const [party, setParty] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [loan, setLoan] = useState(false);
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");

  const handleSave = async () => {
    try {
      const requestBody = {
        user: userID,
        party: party,
        description: description,
        amount: amount,
        debit: category === "debit" ? true : false,
        credit: category === "credit" ? true : false,
        category: loan ? "loan" : null,
        date: date ? date : new Date().toISOString(),
      };

      if (todo) {
        requestBody.todoID = todo;
      }

      await apiClient.post(ADD_EXPANSE, requestBody, {
        headers: { "Content-Type": "application/json" },
      });

      onError("Transaction saved successfully.", "success");
      
      refreshExpanses({ start: dateRange.start, end: dateRange.end });
      setParty("");
      setDescription("");
      setAmount(0);
      setCategory("");
      setLoan(false);
      setTodo("");
      setDate("");
    } catch (error) {
      onError(
        error.response?.data?.message || "Transaction failed to save.",
        "error"
      );
    }
  };

  useEffect(() => {
  if (userID && dateRange?.end) {
    fetchTodos(userID, dateRange.end);
    console.log(todos);    
  }
  if (error) {
    onError(error, "error");
  }
}, [userID, dateRange, error]);


  useEffect(() => {
    setDateRange(dateRange);
  }, [dateRange]);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
        {/* Balance Display */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30 shadow-lg">
            <h3 className="text-slate-400 text-sm mb-2 font-medium">
              Balance :
            </h3>
            <p className="text-4xl font-bold text-white mb-2">{balance}</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  balance >= 0 ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <p className="text-xs text-slate-400">
                {balance >= 0 ? "Positive balance" : "Negative balance"}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">
                  Party:
                </label>
                <input
                  type="text"
                  value={party}
                  onChange={(e) => setParty(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter party name"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">
                  Task:
                </label>
                <select
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Task (Optional)</option>
                  {todos
                    ?.filter((task) => task.expanse === true)
                    .map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title}
                    </option>
                  ))}

                </select>
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">
                  Description:
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Transaction details"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">
                  Loan:
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loan}
                    onChange={() => setLoan(!loan)}
                    className="sr-only peer"
                  />
                  <div className="relative w-10 h-5 bg-orange-500 rounded-full peer peer-checked:bg-blue-600 transition-all">
                    <div className="absolute top-[2px] left-[2px] bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                  <span className="ml-3 text-slate-400 text-sm">
                    {loan ? "Yes" : "No"}
                  </span>
                </label>
              </div>
            </div>

            {/* Third Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-medium">
                  Amount:
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                  required
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select</option>
                  <option value="debit">Debit</option>
                  <option value="credit">Credit</option>
                </select>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ExpanseForm;
