import Plan from "../models/PlanModel.js";
import Todo from "../models/TodoModel.js";

export const getAllPlans = async (req, res, next) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide user.",
      });
    }

    const plans = await Plan.find({ user });
    return res.status(200).json({
      success: true,
      message: "Plans fetched successfully.",
      plans,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const createPlan = async (req, res) => {
  try {
    const { user, title, description, startDate, endDate, status, planning } =
      req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide user.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Plan title is required.",
      });
    }

    // Recursive function to create todos for topics/subtopics
    const processPlanning = async (planningArr) => {
      return Promise.all(
        planningArr.map(async (topic) => {
          // Handle directTodos first
          const directTodos = await Promise.all(
            (topic.directTodos || []).map(async (todo) => {
              const newTodo = await Todo.create({
                user: user,
                title: todo.todoTitle,
                label: 5,
                completed: false,
                scheduledFor: todo.deadline ? new Date(todo.deadline) : new Date(),
              });
              return { ...todo, todoID: newTodo._id }; 
            })
          );

          // Handle subtopics
          const subTopics = await Promise.all(
            (topic.subTopics || []).map(async (sub) => {
              const todos = await Promise.all(
                (sub.todos || []).map(async (todo) => {
                  const newTodo = await Todo.create({
                    user: user,
                    title: todo.todoTitle,
                    label: 5,
                    completed: false,
                    scheduledFor: todo.deadline ? new Date(todo.deadline) : new Date(),
                  });
                  return { ...todo, todoID: newTodo._id };
                })
              );
              return { ...sub, todos };
            })
          );

          return { ...topic, directTodos, subTopics };
        })
      );
    };

    const processedPlanning = planning ? await processPlanning(planning) : [];

    const newPlan = await Plan.create({
      title,
      user,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      status: status || "planned",
      planning: processedPlanning,
    });

    return res.status(201).json({
      success: true,
      message: "Plan created successfully.",
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to create plan",
      error: error.message 
    });
  }
};

export const updatePlan = async (req, res) => {
  
  try {
    const { _id, user, title, description, startDate, endDate, status, planning } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide user.",
      });
    }

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required.",
      });
    }

    const plan = await Plan.findOne({ _id, user });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : undefined;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : undefined;
    if (status !== undefined) updateData.status = status;
    if (planning !== undefined) {
      // Process planning if provided
      const processPlanning = async (planningArr) => {
        return Promise.all(
          planningArr.map(async (topic) => {
            const directTodos = await Promise.all(
              (topic.directTodos || []).map(async (todo) => {
                if (todo.todoID && typeof todo.todoID === 'string' && todo.todoID.length > 10) {
                  // This is already a real todo ID, just return it
                  return todo;
                }
                const newTodo = await Todo.create({
                  user: user,
                  title: todo.todoTitle,
                  label: 5,
                  completed: todo.completed,
                  scheduledFor: todo.deadline ? new Date(todo.deadline) : new Date(),
                });
                return { ...todo, todoID: newTodo._id };
              })
            );

            const subTopics = await Promise.all(
              (topic.subTopics || []).map(async (sub) => {
                const todos = await Promise.all(
                  (sub.todos || []).map(async (todo) => {
                    if (todo.todoID && typeof todo.todoID === 'string' && todo.todoID.length > 10) {
                      return todo;
                    }
                    const newTodo = await Todo.create({
                      user: user,
                      title: todo.todoTitle,
                      label: 5,
                      completed: todo.completed,
                      scheduledFor: todo.deadline ? new Date(todo.deadline) : new Date(),
                    });
                    return { ...todo, todoID: newTodo._id };
                  })
                );
                return { ...sub, todos };
              })
            );

            return { ...topic, directTodos, subTopics };
          })
        );
      };
      updateData.planning = await processPlanning(planning);
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Plan updated successfully.",
      plan: updatedPlan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update plan",
      error: error.message,
    });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { _id, user } = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Please provide user.",
      });
    }

    const plan = await Plan.findOne({ _id: _id, user });
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found.",
      });
    }

    // Delete associated todos
    const todoIds = [];
    plan.planning.forEach(topic => {
      if (topic.directTodos) {
        topic.directTodos.forEach(todo => {
          if (todo.todoID) todoIds.push(todo.todoID);
        });
      }
      if (topic.subTopics) {
        topic.subTopics.forEach(subTopic => {
          if (subTopic.todos) {
            subTopic.todos.forEach(todo => {
              if (todo.todoID) todoIds.push(todo.todoID);
            });
          }
        });
      }
    });

    if (todoIds.length > 0) {
      await Todo.deleteMany({ _id: { $in: todoIds } });
    }

    await Plan.findByIdAndDelete(_id);

    return res.status(200).json({
      success: true,
      message: "Plan deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete plan",
      error: error.message,
    });
  }
};
