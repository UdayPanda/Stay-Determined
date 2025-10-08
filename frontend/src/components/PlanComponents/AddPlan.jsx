import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  FileText,
  Tag,
  Target,
} from "lucide-react";
import "../../App.css"
import { useAuth } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { ADD_PLAN } from "../../utils/constants";

const AddPlan = ({ setIsAddingPlan, onError, onSuccess }) => {

  const { user } = useAuth();
  const userID = user?.user?.id || user?.id;
  
  const [plan, setPlan] = useState({
    user: userID || "",
    title: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "planned",
    planning: [],
  });

  const [expandedTopics, setExpandedTopics] = useState(new Set());
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newSubTopicTitles, setNewSubTopicTitles] = useState({});
  const [newTodoTitles, setNewTodoTitles] = useState({});
  const [todoDeadlines, setTodoDeadlines] = useState({});
  const [directTopicTodos, setDirectTopicTodos] = useState({});
  const [directTopicDeadlines, setDirectTopicDeadlines] = useState({});
  

  const addDirectTodoToTopic = (topicIndex) => {
    const todoKey = `topic-${topicIndex}`;
    const todoTitle = directTopicTodos[todoKey];

    if (!todoTitle?.trim()) return;

    const updatedPlanning = [...plan.planning];
    const newTodo = {
      user: userID || "",
      todoTitle: todoTitle,
      todoID: new Date().getTime().toString(),
      label: "planned",
      deadline: directTopicDeadlines[todoKey]
        ? new Date(directTopicDeadlines[todoKey])
        : new Date(),
    };

    if (!updatedPlanning[topicIndex].directTodos) {
      updatedPlanning[topicIndex].directTodos = [];
    }

    updatedPlanning[topicIndex].directTodos.push(newTodo);
    setPlan({ ...plan, planning: updatedPlanning });

    setDirectTopicTodos({
      ...directTopicTodos,
      [todoKey]: "",
    });
    setDirectTopicDeadlines({
      ...directTopicDeadlines,
      [todoKey]: "",
    });
  };

  const removeDirectTodoFromTopic = (topicIndex, todoIndex) => {
    const updatedPlanning = [...plan.planning];
    updatedPlanning[topicIndex].directTodos = updatedPlanning[
      topicIndex
    ].directTodos.filter((_, i) => i !== todoIndex);
    setPlan({ ...plan, planning: updatedPlanning });
  };

  const addTopic = () => {
    if (!newTopicTitle.trim()) return;

    const newTopic = {
      topicTitle: newTopicTitle,
      subTopics: [],
      directTodos: [], // Add direct todos array
    };

    setPlan({
      ...plan,
      planning: [...plan.planning, newTopic],
    });
    setNewTopicTitle("");
  };

  const removeTopic = (topicIndex) => {
    const updatedPlanning = plan.planning.filter((_, i) => i !== topicIndex);
    setPlan({ ...plan, planning: updatedPlanning });
  };

  const addSubTopic = (topicIndex) => {
    const subTopicKey = `${topicIndex}`;
    const subTopicTitle = newSubTopicTitles[subTopicKey];

    if (!subTopicTitle?.trim()) return;

    const updatedPlanning = [...plan.planning];
    const newSubTopic = {
      subTopicTitle: subTopicTitle,
      todos: [],
    };

    updatedPlanning[topicIndex].subTopics.push(newSubTopic);
    setPlan({ ...plan, planning: updatedPlanning });

    setNewSubTopicTitles({
      ...newSubTopicTitles,
      [subTopicKey]: "",
    });
  };

  const removeSubTopic = (topicIndex, subTopicIndex) => {
    const updatedPlanning = [...plan.planning];
    updatedPlanning[topicIndex].subTopics = updatedPlanning[
      topicIndex
    ].subTopics.filter((_, i) => i !== subTopicIndex);
    setPlan({ ...plan, planning: updatedPlanning });
  };

  const addTodo = (topicIndex, subTopicIndex) => {
    const todoKey = `${topicIndex}-${subTopicIndex}`;
    const todoTitle = newTodoTitles[todoKey];

    if (!todoTitle?.trim()) return;

    const updatedPlanning = [...plan.planning];
    const newTodo = {
      user: userID || "",
      todoTitle: todoTitle,
      todoID: new Date().getTime().toString(), // Temporary ID
      label: "planned",
      deadline: todoDeadlines[todoKey]
        ? new Date(todoDeadlines[todoKey])
        : new Date(),
    };

    updatedPlanning[topicIndex].subTopics[subTopicIndex].todos.push(newTodo);
    setPlan({ ...plan, planning: updatedPlanning });

    setNewTodoTitles({
      ...newTodoTitles,
      [todoKey]: "",
    });
    setTodoDeadlines({
      ...todoDeadlines,
      [todoKey]: "",
    });
  };

  const removeTodo = (topicIndex, subTopicIndex, todoIndex) => {
    const updatedPlanning = [...plan.planning];
    updatedPlanning[topicIndex].subTopics[subTopicIndex].todos =
      updatedPlanning[topicIndex].subTopics[subTopicIndex].todos.filter(
        (_, i) => i !== todoIndex
      );
    setPlan({ ...plan, planning: updatedPlanning });
  };

  const toggleTopicExpansion = (topicIndex) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicIndex)) {
      newExpanded.delete(topicIndex);
    } else {
      newExpanded.add(topicIndex);
    }
    setExpandedTopics(newExpanded);
  };

  const savePlan = async() => {
    // Validation
    if (!plan.title.trim()) {
      onError?.("Plan title is required", "error");
      return;
    }

    if (!userID) {
      onError?.("Login is required.", "error");
      return;
    }

    try {
      const response = await apiClient.post(
        ADD_PLAN,
        plan,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        onSuccess?.("Plan created successfully!", "success");
        setIsAddingPlan(false);
        // Reset form
        setPlan({
          user: userID || "",
          title: "",
          startDate: "",
          endDate: "",
          description: "",
          status: "planned",
          planning: [],
        });
      } else {
        onError?.(response.data.message || "Failed to save plan. Please try again.", "error");
      }
    } catch (error) {
      onError?.(error.response?.data?.message || "Failed to save plan. Please try again.", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="w-full max-h-[80vh] overflow-y-scroll custom-scrollbar p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Create New Plan
          </h2>
          <p className="text-slate-400">
            Structure your goals with topics, subtopics, and tasks
          </p>
        </div>

        {/* Basic Plan Information */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-400" />
            Plan Details
          </h3>

          <div className="mt-4">
            <label className="block text-slate-300 mb-2 font-medium">
              Plan Title*
            </label>
            <input
              type="text"
              value={plan.title}
              onChange={(e) => setPlan({ ...plan, title: e.target.value })}
              className="w-full px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              placeholder="Enter a descriptive plan title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-slate-300 mb-2 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                value={plan.startDate}
                onChange={(e) =>
                  setPlan({ ...plan, startDate: e.target.value })
                }
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                value={plan.endDate}
                onChange={(e) => setPlan({ ...plan, endDate: e.target.value })}
                className="w-full px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-slate-300 mb-2 font-medium">
              Description
            </label>
            <textarea
              value={plan.description}
              onChange={(e) =>
                setPlan({ ...plan, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all resize-none"
              rows="3"
              placeholder="Describe your plan's objectives and scope"
            />
          </div>
        </div>

        {/* Planning Structure */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Planning Structure
          </h3>

          {/* Add New Topic */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Add a new topic (e.g., Frontend Development)"
              className="flex-1 px-4 py-3 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />
            <button
              type="button"
              onClick={addTopic}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Add Topic
            </button>
          </div>

          {/* Topics List */}
          <div className="space-y-4">
            {plan.planning.map((topic, topicIndex) => (
              <div
                key={topicIndex}
                className="border border-white/10 rounded-lg bg-white/5 overflow-hidden"
              >
                {/* Topic Header */}
                <div className="p-4 bg-blue-500/10 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTopicExpansion(topicIndex)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {expandedTopics.has(topicIndex) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <h4 className="font-semibold text-white text-lg">
                      {topic.topicTitle}
                    </h4>
                    <span className="text-sm text-slate-400 bg-white/10 px-2 py-1 rounded">
                      {topic.subTopics.length} subtopics •{" "}
                      {topic.directTodos?.length || 0} direct tasks
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTopic(topicIndex)}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Topic Content */}
                {expandedTopics.has(topicIndex) && (
                  <div className="p-4 space-y-6">
                    {/* Direct Tasks for Topic */}
                    <div className="bg-white/5 rounded-md p-4 border border-yellow-400/20">
                      <h5 className="font-medium text-yellow-300 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        Direct Tasks
                        <span className="text-xs text-slate-400">
                          (No subtopic needed)
                        </span>
                      </h5>

                      {/* Show Direct Tasks */}
                      {topic.directTodos && topic.directTodos.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {topic.directTodos.map((todo, todoIndex) => (
                            <div
                              key={todoIndex}
                              className="flex items-center justify-between bg-white/10 p-2 rounded text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                                <span className="text-white">
                                  {todo.todoTitle}
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({formatDate(todo.deadline)})
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  removeDirectTodoFromTopic(
                                    topicIndex,
                                    todoIndex
                                  )
                                }
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Direct Task */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={directTopicTodos[`topic-${topicIndex}`] || ""}
                          onChange={(e) =>
                            setDirectTopicTodos({
                              ...directTopicTodos,
                              [`topic-${topicIndex}`]: e.target.value,
                            })
                          }
                          placeholder="Add direct task to topic"
                          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all text-sm"
                        />
                        <input
                          type="date"
                          value={
                            directTopicDeadlines[`topic-${topicIndex}`] || ""
                          }
                          onChange={(e) =>
                            setDirectTopicDeadlines({
                              ...directTopicDeadlines,
                              [`topic-${topicIndex}`]: e.target.value,
                            })
                          }
                          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => addDirectTodoToTopic(topicIndex)}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md text-white font-medium transition-all flex items-center justify-center gap-2 text-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Add Task
                        </button>
                      </div>
                    </div>

                    {/* Subtopics Section */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h5 className="font-medium text-green-300">
                          Subtopics
                        </h5>
                        <span className="text-xs text-slate-400">
                          (For more detailed organization)
                        </span>
                      </div>
                      {/* Add Subtopic */}
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          value={newSubTopicTitles[topicIndex] || ""}
                          onChange={(e) =>
                            setNewSubTopicTitles({
                              ...newSubTopicTitles,
                              [topicIndex]: e.target.value,
                            })
                          }
                          placeholder="Add subtopic (e.g., React Components)"
                          className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-green-400 focus:border-transparent outline-none transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => addSubTopic(topicIndex)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition-all flex items-center gap-2 text-sm"
                        >
                          <Plus className="w-3 h-3" />
                          Add Subtopic
                        </button>
                      </div>

                      {/* Subtopics */}
                      <div className="space-y-3">
                        {topic.subTopics.map((subTopic, subTopicIndex) => (
                          <div
                            key={subTopicIndex}
                            className="bg-white/5 rounded-md p-4 border border-green-400/20"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-green-300 flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                {subTopic.subTopicTitle}
                              </h5>
                              <button
                                type="button"
                                onClick={() =>
                                  removeSubTopic(topicIndex, subTopicIndex)
                                }
                                className="text-red-400 hover:text-red-300 transition-colors p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Todos */}
                            {subTopic.todos.length > 0 && (
                              <div className="space-y-2 mb-3">
                                {subTopic.todos.map((todo, todoIndex) => (
                                  <div
                                    key={todoIndex}
                                    className="flex items-center justify-between bg-white/5 p-2 rounded text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                      <span className="text-white">
                                        {todo.todoTitle}
                                      </span>
                                      <span className="text-xs text-slate-400">
                                        ({formatDate(todo.deadline)})
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeTodo(
                                          topicIndex,
                                          subTopicIndex,
                                          todoIndex
                                        )
                                      }
                                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Add Todo */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={
                                  newTodoTitles[
                                    `${topicIndex}-${subTopicIndex}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setNewTodoTitles({
                                    ...newTodoTitles,
                                    [`${topicIndex}-${subTopicIndex}`]:
                                      e.target.value,
                                  })
                                }
                                placeholder="Add subtopic task"
                                className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm"
                              />
                              <input
                                type="date"
                                value={
                                  todoDeadlines[
                                    `${topicIndex}-${subTopicIndex}`
                                  ] || ""
                                }
                                onChange={(e) =>
                                  setTodoDeadlines({
                                    ...todoDeadlines,
                                    [`${topicIndex}-${subTopicIndex}`]:
                                      e.target.value,
                                  })
                                }
                                className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-sm"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  addTodo(topicIndex, subTopicIndex)
                                }
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-all flex items-center justify-center gap-2 text-sm"
                              >
                                <Plus className="w-3 h-3" />
                                Add Task
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
          <button
            type="button"
            className="px-8 py-3 rounded-md border border-white/20 text-white hover:bg-white/10 transition-all font-medium"
            onClick={() => setIsAddingPlan(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-8 py-3 rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all shadow-lg hover:shadow-xl"
            onClick={savePlan}
          >
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlan;
