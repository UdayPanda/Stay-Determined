import { useEffect } from "react";
import { useExpanse } from "../../contexts/ExpanseContext";

function Categories(dateRange) {
  const { expanses, setDateRange } = useExpanse();

  useEffect(() => {
    setDateRange(dateRange);
  },[dateRange])

  return (
    <div className="rounded-md m-4">

      <div className="rounded-md overflow-y-auto scrollbar-none">
        {expanses &&
          expanses
            .filter((item) => item.category === "loan")
            .map((item) => (
              <div key={item._id} className="mb-6">
                <h2 className="text-white font-semibold mb-2 capitalize">
                  {expanses.category}
                </h2>
                <div className="space-y-2">
                  <div
                    key={item._id}
                    className={`relative p-2 w-full rounded-md shadow-md ${
                      item.debit ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    <div className="flex justify-between text-xs text-gray-700">
                      <span>{item.party}</span>
                      <span
                        className={
                          item.debit ? "text-red-600" : "text-green-600"
                        }
                      >
                        {item.debit ? "-" : "+"}
                        {item.amount}
                      </span>
                    </div>
                    <div className="flex flex-col justify-between text-[10px] text-gray-600">
                      <div className="truncate max-w-[70%]">
                        {item.description}
                      </div>
                      <div className="text-gray-700 text-[10px]">
                        {new Date(item.date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                        })}
                        , &nbsp;
                        {new Date(item.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Categories;
