import { useEffect, useState } from "react";
import "../../App.css";
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { GET_PLAN } from "../../utils/constants";
import ShowPlan from "./ShowPlan";

const PlanItem = ({ onError, refreshKey }) => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;

  const fetchAllPlans = async () => {
    try {
      const response = await apiClient.post(
        GET_PLAN,
        { user: userID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPlans(response?.data?.plans || []);
    } catch (error) {
      onError?.(
        error?.response?.data?.message || "Failed to fetch plans",
        "error"
      );
    }
  };

  const handleClose = () => {
    setSelectedPlan(null);
  };

  useEffect(() => {
    if (userID) {
      fetchAllPlans();
    } else {
      onError?.("User not found", "error");
    }
  }, [userID, refreshKey]);

  // Function to calculate plan progress
  const calculateProgress = (plan) => {
    let totalTasks = 0;
    let completedTasks = 0;

    plan.planning.forEach((topic) => {
      // Count direct todos
      if (topic.directTodos) {
        totalTasks += topic.directTodos.length;
        completedTasks += topic.directTodos.filter(todo => todo.completed).length;
      }

      // Count subtopic todos
      if (topic.subTopics) {
        topic.subTopics.forEach((subTopic) => {
          if (subTopic.todos) {
            totalTasks += subTopic.todos.length;
            completedTasks += subTopic.todos.filter(todo => todo.completed).length;
          }
        });
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  // Function to get total tasks count
  const getTotalTasks = (plan) => {
    let totalTasks = 0;
    plan.planning.forEach((topic) => {
      if (topic.directTodos) {
        totalTasks += topic.directTodos.length;
      }
      if (topic.subTopics) {
        topic.subTopics.forEach((subTopic) => {
          if (subTopic.todos) {
            totalTasks += subTopic.todos.length;
          }
        });
      }
    });
    return totalTasks;
  };

  return (
    <>
      <div className="flex flex-col gap-4 overflow-y-scroll max-h-[70vh] custom-scrollbar pr-2">
        {plans.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/60 text-lg">No plans created yet</p>
            <p className="text-white/40 text-sm mt-2">
              Create your first plan to get started!
            </p>
          </div>
        ) : (
          plans.map((plan) => {
            const progress = calculateProgress(plan);
            const totalTasks = getTotalTasks(plan);
            const completedTasks = Math.round((progress / 100) * totalTasks);
            const untouchedTasks = totalTasks - completedTasks;

            return (
              <div
                key={plan._id}
                className="cursor-pointer bg-gray-700 rounded-lg p-4 space-y-3 hover:bg-gray-600 transition"
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-300 text-2xl">
                      {plan.title}
                    </h3>
                    <p className="text-sm text-white/70">
                      {plan.description || "No description provided"}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                      
                      {plan.endDate && (
                        <div>
                          <span className="text-red-400">Deadline: </span>
                          <span>
                            {new Date(plan.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          plan.status === "completed"
                            ? "bg-green-500/20 text-green-300"
                            : plan.status === "in-progress"
                            ? "bg-blue-500/20 text-blue-300"
                            : plan.status === "paused"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {plan.status}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2 mb-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {/* Total Tasks */}
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                        <p className="text-white/60">Total Tasks</p>
                        <p className="font-bold text-lg">{totalTasks}</p>
                      </div>

                      {/* Completed */}
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-white/60">Completed</p>
                        <p className="font-bold text-lg text-green-400">
                          {completedTasks}
                        </p>
                      </div>

                      {/* Untouched */}
                      <div className="text-center p-2 bg-white/5 rounded">
                        <div className="flex items-center justify-center mb-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-orange-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-white/60">Pending</p>
                        <p className="font-bold text-lg text-orange-400">
                          {untouchedTasks}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {selectedPlan && (
          <ShowPlan
            plan={selectedPlan}
            onClose={handleClose}
            onUpdated={() => {
              fetchAllPlans();
              setSelectedPlan(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default PlanItem;
