import { useEffect } from "react";
import { useExpanse } from "../../contexts/ExpanseContext.jsx";

function Debit({ dateRange }) {
  const { expanses, setDateRange, balance } = useExpanse();

  useEffect(() => {
    setDateRange(dateRange);
  }, [dateRange]);

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
            ).map(([date, transactions]) => {
              // Filter only debit transactions for this date
              const creditTransactions = transactions.filter(
                (item) => item.debit === true
              );
              if (creditTransactions.length === 0) return null;

              return (
                <div key={date} className="relative w-full">
                  <h3 className="text-white text-xs text-center">{date}</h3>
                  {creditTransactions.map((item) => (
                    <div
                      key={item._id}
                      className="relative p-1 w-full h-12 rounded-md shadow-md bg-red-100 m-1.5"
                    >
                      <div className="text-gray-700 text-xs">{item.party}</div>
                      <div className="absolute top-1 right-3 text-red-600 text-xs">
                        -{item.amount}
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
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Debit;
