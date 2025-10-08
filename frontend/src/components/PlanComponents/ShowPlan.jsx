import { useState } from "react";
import ReactDOM from "react-dom";
import "../../App.css";
import Loader from "../Templates/Loader";
import { Save, X, Edit3, CheckSquare, Calendar, Target } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { DELETE_PLAN, UPDATE_PLAN } from "../../utils/constants";
import { Trash2 } from "lucide-react";
import Prompt from "../Templates/Prompt"; 

const ShowPlan = ({ plan, onClose, onUpdated }) => {
  const [editablePlan, setEditablePlan] = useState(plan);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleConfirmPrompt = () => {
    handleDeletePlan()
    setShowPrompt(false);
  };

  const handleCancelPrompt = () => {
    setShowPrompt(false);
  }

  const handleDeletePlan = async () => {
    setLoading(true);
    try {
      await apiClient.delete(DELETE_PLAN, {
        data: { _id: editablePlan._id, user: editablePlan.user },
        headers: { "Content-Type": "application/json" },
      });
      onUpdated();
      onClose?.();
      setIsEditing(false);
    } catch (error) {
      console.log(error);      
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditablePlan((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsEditing(false);
  };

  const handleTodoChange = (topicIdx, subTopicIdx, todoIdx, field, value) => {
    setEditablePlan((prev) => {
      const updated = { ...prev };
      if (subTopicIdx !== null) {
        updated.planning[topicIdx].subTopics[subTopicIdx].todos[todoIdx][
          field
        ] = value;
      } else {
        updated.planning[topicIdx].directTodos[todoIdx][field] = value;
      }
      return updated;
    });
  };

  const toggleTodoCompletion = (topicIdx, subTopicIdx, todoIdx) => {
    const currentStatus =
      subTopicIdx !== null
        ? editablePlan.planning[topicIdx].subTopics[subTopicIdx].todos[todoIdx]
            .completed
        : editablePlan.planning[topicIdx].directTodos[todoIdx].completed;

    handleTodoChange(
      topicIdx,
      subTopicIdx,
      todoIdx,
      "completed",
      !currentStatus
    );
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      await apiClient.put(UPDATE_PLAN, editablePlan, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      onUpdated();
      onClose?.();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    // await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const handleCancel = () => {
    onClose?.();
    setIsEditing(false);
  };

  const getCompletionStats = () => {
    let total = 0;
    let completed = 0;

    editablePlan.planning.forEach((topic) => {
      // Count direct todos
      topic.directTodos?.forEach((todo) => {
        total++;
        if (todo.completed) completed++;
      });

      // Count subtopic todos
      topic.subTopics?.forEach((subtopic) => {
        subtopic.todos?.forEach((todo) => {
          total++;
          if (todo.completed) completed++;
        });
      });
    });

    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const stats = getCompletionStats();

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <div className="min-h-screen max-w-4xl mx-auto rounded-xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-6 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Plan Editor</h1>
                  <p className="text-gray-300">
                    Manage and track your learning goals
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                      <span>Close</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrompt(true)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? "Updating..." : "Save Changes"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrompt(true)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">Progress</span>
                <span className="text-white font-semibold">
                  {Math.round(stats.percentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>

            {/* Title and Description */}
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="title"
                  value={editablePlan.title}
                  onChange={handleChange}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Plan title"
                />
                <textarea
                  name="description"
                  value={editablePlan.description || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Plan description"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {editablePlan.title}
                </h2>
                <p className="text-gray-300 text-lg">
                  {editablePlan.description}
                </p>
              </div>
            )}
          </div>

          {/* Topics */}
          <div className="space-y-6">
            {editablePlan.planning?.map((topic, topicIdx) => (
              <div
                key={topicIdx}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {topic.topicTitle}
                  </h3>
                </div>

                {/* Direct Todos */}
                {topic.directTodos?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-gray-300 font-medium mb-3">
                      Main Tasks
                    </h4>
                    <div className="space-y-2">
                      {topic.directTodos.map((todo, todoIdx) => (
                        <div
                          key={todoIdx}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <button
                            onClick={() =>
                              toggleTodoCompletion(topicIdx, null, todoIdx)
                            }
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              todo.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-400 hover:border-green-400"
                            }`}
                          >
                            {todo.completed && (
                              <CheckSquare className="w-3 h-3 text-white" />
                            )}
                          </button>
                          {isEditing ? (
                            <input
                              type="text"
                              value={todo.todoTitle}
                              onChange={(e) =>
                                handleTodoChange(
                                  topicIdx,
                                  null,
                                  todoIdx,
                                  "todoTitle",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span
                              className={`flex-1 ${
                                todo.completed
                                  ? "text-gray-400 line-through"
                                  : "text-white"
                              }`}
                            >
                              {todo.todoTitle}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub Topics */}
                {topic.subTopics?.map((subTopic, subIdx) => (
                  <div key={subIdx} className="mb-6 last:mb-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <h4 className="text-lg font-medium text-blue-300">
                        {subTopic.subTopicTitle}
                      </h4>
                    </div>

                    <div className="space-y-2 ml-4">
                      {subTopic.todos?.map((todo, todoIdx) => (
                        <div
                          key={todoIdx}
                          className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10"
                        >
                          <button
                            onClick={() =>
                              toggleTodoCompletion(topicIdx, subIdx, todoIdx)
                            }
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              todo.completed
                                ? "bg-green-500 border-green-500"
                                : "border-gray-400 hover:border-green-400"
                            }`}
                          >
                            {todo.completed && (
                              <CheckSquare className="w-3 h-3 text-white" />
                            )}
                          </button>
                          {isEditing ? (
                            <input
                              type="text"
                              value={todo.todoTitle}
                              onChange={(e) =>
                                handleTodoChange(
                                  topicIdx,
                                  subIdx,
                                  todoIdx,
                                  "todoTitle",
                                  e.target.value
                                )
                              }
                              className="flex-1 p-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span
                              className={`flex-1 ${
                                todo.completed
                                  ? "text-gray-400 line-through"
                                  : "text-white"
                              }`}
                            >
                              {todo.todoTitle}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Action Buttons at Bottom - Only show when editing */}
          {isEditing && (
            <div className="flex items-center justify-center space-x-4 mt-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
                <span>Cancel Changes</span>
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? "Updating Plan..." : "Save Plan"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <Loader />}
      
      <Prompt
        isOpen={showPrompt}
        title="You are about to delete this plan."
        message="This action is irreversible. All associated topics and tasks will be permanently removed. Are you sure you want to proceed?"
        onConfirm={() => handleConfirmPrompt()}
        onCancel={() => handleCancelPrompt()}
      />
    </div>,
    document.body
  );
};

export default ShowPlan;
