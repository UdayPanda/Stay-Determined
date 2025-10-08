import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  todoTitle: { type: String, required: true },
  todoID: { type: mongoose.Schema.Types.ObjectId, ref: "Todo", required: true },
  label: { type: String, default: 5 },
  completed: { type: Boolean, default: false },
  deadline: { type: Date, default: Date.now },
});

const SubTopicSchema = new mongoose.Schema({
  subTopicTitle: { type: String, required: true },
  todos: [TodoSchema],
});

const TopicSchema = new mongoose.Schema({
  topicTitle: { type: String, required: true },
  directTodos: [TodoSchema], // Changed from todos to directTodos
  subTopics: [SubTopicSchema],
});

const PlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { 
    type: String, 
    enum: ["planned", "in-progress", "completed", "paused"],
    default: "planned" 
  },
  planning: [TopicSchema],
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Plan = mongoose.model("Plans", PlanSchema);

export default Plan;