import { useEffect, useState } from "react";
import { GET_EXPANSE } from "../../utils/constants";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { useExpanse } from "../../contexts/ExpanseContext.jsx";

function Credit({ onError }) {
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;
  const { expanses, setExpanses, balance } = useExpanse();
  const [loader, setLoader] = useState(false);
  // const [selectedTransaction, setSelectedTransaction] = useState(null)

  const fetchTransaction = async (userID) => {
    setLoader(true);
    try {
      const response = await apiClient.post(
        GET_EXPANSE,
        { user: userID },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data.expanse;

      setExpanses(data);
    } catch (error) {
      let errorMessage = "Transactions failed to fetch.";
      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      }
      onError(errorMessage, "error");
    } finally {
      setLoader(false);
    }
  };

  // const handleDelete = async (id) => {
  //   try {

  //     await apiClient.delete(DELETE_EXPANSE, { user: userID, id }, { headers: { 'Content-Type': 'application/json' } })
  //     setExpanses(prev => prev.filter((expanse) => expanse.id !== id))
  //     setSelectedTransaction(null)

  //   } catch (error) {
  //     let errorMessage = "Transactions failed to delete.";
  //     if (error.response) {
  //       errorMessage = error.response.data.message || error.response.data.error || errorMessage;
  //     }
  //     onError(errorMessage, 'error');
  //   }
  // }

  useEffect(() => {
    if (userID) {
      fetchTransaction(userID);
    }
  }, [user, balance]);

  if (loader) {
    return (
      <div className="rounded-md h-80 m-4">
        <div className="flex flex-col items-center gap-2 w-48 mr-2 text-gray-700 overflow-y-scroll scrollbar-none">
          <div className="mt-1 font-semibold">Credit</div>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="lg:col-span-1 border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="px-4 border-b border-slate-700/50">
         
          {expanses &&
            Object.entries(
              expanses.reduce((groupedTransactions, item) => {
                const date = new Date(item.date).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                });

                if (!groupedTransactions[date]) {
                  groupedTransactions[date] = [];
                }
                groupedTransactions[date].push(item);

                return groupedTransactions;
              }, {})
            ).map(([date, transactions]) => (
              <div key={date} className="relative w-full">
                <h3 className="text-white text-xs text-center">{date}</h3>

                {transactions
                  .filter((item) => item.credit === true)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="relative p-1 w-full h-12 rounded-md shadow-md bg-green-100 m-1.5"
                    >
                      <div className="text-gray-700 text-xs">{item.party}</div>
                      <div className="absolute top-1 right-3 text-green-800 text-xs">
                        +{item.amount}
                      </div>
                      <div className="absolute top-8 right-3 text-gray-700 text-[10px]">
                        {new Date(item.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <div className="flex absolute top-5 left-1">
                        <p className="text-gray-600 w-44 h-4 overflow-hidden text-[10px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Credit;
