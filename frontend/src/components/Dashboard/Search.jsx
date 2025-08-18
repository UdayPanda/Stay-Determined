import { useEffect, useState } from "react";
import { apiClient } from "../../lib/apiClient";
import { SEARCH_ROUTE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debounceTerm, setDebounceTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({
    todos: [],
    notes: [],
    expanses: [],
  });
  const [mergedArray, setMergedArray] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debounceTerm) {
      handleSearch(debounceTerm);
    }
  }, [debounceTerm]);

  useEffect(() => {
    setMergedArray(
      Object.entries(searchResults || {}).flatMap(([key, arr]) =>
        (arr ?? []).map((item) => ({ category: key, ...item }))
      )
    );
  }, [searchResults]);

  const handleSearch = async (q) => {
    setIsSearching(true);
    try {
      const results = await apiClient.get(SEARCH_ROUTE, {
        params: { query: q },
        withCredentials: true,
      });
      setSearchResults(results.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setIsSearching(false);
      navigate("/login");
    }
  };

  return (
    <div className="absolute mt-8 ml-10 lg:left-[18%] flex flex-col items-center justify-center p-4 rounded-md lg:mt-2 w-[80%] mx-auto lg:w-[60%] ">
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-200 px-4 py-1 rounded-2xl outline-none w-[300px] max-w-md"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 cursor-pointer text-gray-500 hover:text-gray-700 relative right-[-130px] top-[-30px]"
        onClick={() => {
          setSearchTerm("");
          setIsSearching(false);
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>

      <div
        className={`${
          isSearching ? "block" : "hidden"
        } relative z-10 rounded-sm w-full max-h-[50vh] overflow-y-auto bg-white flex items-start justify-center`}
      >
        {searchTerm && (
          <div className="relative z-10 rounded-sm w-full bg-white flex items-center justify-center mt-2">
            <div className="p-2 rounded-md bg-gray-100 shadow-md w-full">
              {mergedArray.length > 0 ? (
                <p className="text-gray-600 mb-2">
                  Total {mergedArray.length} Search results for:{" "}
                  <span className="font-bold">{searchTerm}</span>
                </p>
              ) : (
                <p className="text-gray-600 mb-2">
                  No results found for:{" "}
                  <span className="font-bold">{searchTerm}</span>
                </p>
              )}
              {mergedArray.map((result, index) => (
                <div
                  key={result._id || index}
                  className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer border-b"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Clicked on ${result._id}:`, result);
                  }}
                >
                  <p
                    className={`${
                      result.length > 100 ? "line-clamp-2" : ""
                    }text-sm h-6 overflow-hidden text-gray-700`}
                  >
                    <span className="font-bold text-blue-500">
                      {result.category}
                    </span>
                    : {result.title || result.content || JSON.stringify(result)}
                  </p>

                  {result.date && (
                    <span className="mt-1 text-xs text-gray-500">
                      {new Date(result.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
