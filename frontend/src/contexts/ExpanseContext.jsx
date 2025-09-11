import { useEffect, useContext, createContext, useState, useCallback, startTransition } from "react";
import { apiClient } from "../lib/apiClient";
import { GET_BALANCE, GET_EXPANSE } from "../utils/constants";
import { useAuth } from "./AuthContext";

const ExpanseContext = createContext();

export const ExpanseProvider = ({ children }) => {
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;
  const [expanses, setExpanses] = useState([]);
  const [balance, setBalance] = useState(0);
  const [dateRange, setDateRange] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshExpanses = useCallback(
    async (range = dateRange) => {
      if (!userID || !range.start || !range.end) return;

      setLoading(true);
      try {
        const [expRes, balRes] = await Promise.all([
          apiClient.post(GET_EXPANSE, {
            user: userID,
            startDate: range.start,
            endDate: range.end,
          }),
          apiClient.post(GET_BALANCE, {
            user: userID,
            startDate: range.start,
            endDate: range.end,
          }),
        ]);

        startTransition(() => {
          setExpanses(expRes.data.expanse || []);
          setBalance(balRes.data.balance || 0);
          setLoading(false);
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to refresh data.");
        setLoading(false);
      }
    },
    [userID, dateRange]
  );

  useEffect(() => {
    if (userID && dateRange.start && dateRange.end) {
      refreshExpanses(dateRange);
    }
  }, [userID, dateRange, refreshExpanses]);

  return (
    <ExpanseContext.Provider
      value={{
        expanses,
        balance,
        loading,
        error,
        setDateRange,
        refreshExpanses,
      }}
    >
      {children}
    </ExpanseContext.Provider>
  );
};

export const useExpanse = () => useContext(ExpanseContext);
