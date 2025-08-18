import { useEffect, useState } from "react";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { ADD_EXPANSE, GET_BALANCE } from "../../utils/constants";
import { useExpanse } from "../../contexts/ExpanseContext.jsx";

function ExpanseForm({ onError }) {
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;
  const { balance, setBalance } = useExpanse();
  const [party, setParty] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [loan, setLoan] = useState(false);
  const [todo, setTodo] = useState("");
  const [date, setDate] = useState("");
//   const [check, setCheck] = useState(true);

  const fetchBalance = async (userID) => {
    try {
      const response = await apiClient.post(
        GET_BALANCE,
        { user: userID },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data.balance;
      setBalance(data);
    } catch (error) {
      let errorMessage = "Transactions failed to fetch.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }
      onError(errorMessage, "error");
    }
  };

  const handleSave = async () => {
    try {
      const requestBody = {
        user: user?.user?.id || user?.id,
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
      fetchBalance(userID);

      setParty("");
      setDescription("");
      setAmount(0);
      setCategory("");
      setLoan(false);
      setTodo("");
      setDate("");
    } catch (error) {
      let errorMessage = "Transactions failed to fetch.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }
      onError(errorMessage, "error");
    }
  };

  useEffect(() => {
    if (userID) {
      fetchBalance(userID);
    }
  }, [user, balance]);

  return (
    // <div className='fixed w-[90%] ml-4 lg:ml-0 bottom-6 flex flex-col lg:flex-row gap-2 items-center justify-between bg-slate-400 rounded-md p-4'>
    //     <div className='text-gray-700 font-semibold text-lg'>Balance : {balance}</div>

    //     <button
    //         className={`block lg:hidden bg-sky-500 px-3 rounded-md text-sm text-white`}
    //         onClick={()=> setCheck((prev)=> !prev)}
    //     >{check ? "Add New" : "Cancel"}</button>

    //     <div className={`${check ? "hidden" : "block"} lg:block justify-between w-full lg:w-[600px] grid gap-2 grid-cols-1 lg:grid-cols-2 text-sm`}>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Party: </label>
    //             <input
    //                 type="text"
    //                 className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
    //                 required
    //                 value={party}
    //                 onChange={(e) => setParty(e.target.value)}
    //             />
    //         </div>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Description: </label>
    //             <input
    //                 type="text"
    //                 className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
    //                 required
    //                 value={description}
    //                 onChange={(e) => setDescription(e.target.value)}
    //             />
    //         </div>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Amount: </label>
    //             <input
    //                 type="text"
    //                 className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
    //                 required
    //                 value={amount}
    //                 onChange={(e) => setAmount(e.target.value)}
    //             />
    //         </div>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Task: </label>
    //             <input
    //                 type="text"
    //                 className='text-gray-700 px-1 rounded-md outline-none mx-2 w-full'
    //                 value={todo}
    //                 onChange={(e) => setTodo(e.target.value)}
    //             />
    //         </div>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Loan: </label>

    //             <label className="inline-flex items-center mb-5 cursor-pointer outline-none mr-52">
    //                 <input
    //                     type="checkbox" value=""
    //                     className="sr-only peer"
    //                     checked={loan}
    //                     onChange={() => setLoan(!loan)}
    //                 />
    //                 <div
    //                     className="relative w-7 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
    //             </label>

    //         </div>
    //         <div className='flex items-start justify-between'>
    //             <label htmlFor="party">Type: </label>
    //             <select
    //                 name="category"
    //                 id="category"
    //                 value={category}
    //                 onChange={(e) => setCategory(e.target.value)}
    //                 className='w-36 text-center bg-white rounded-md'
    //             >
    //                 <option value="">Select</option>
    //                 <option value="debit">Debit</option>
    //                 <option value="credit">Credit</option>
    //             </select>
    //         </div>

    //     </div>

    //     <div>
    //         <button
    //             type='submit'
    //             className={`${check ? "hidden" : "block"} lg:block bg-green-500 px-3 rounded-md text-sm text-white`}
    //             onClick={handleSave}
    //         >Save</button>
    //     </div>
    // </div>

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
                <input
                  type="text"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Task description"
                />
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
                  <div className="relative w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-all">
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
