import Todo from "../models/TodoModel.js";
import Notes from "../models/NotesModel.js";
import Expanse from "../models/ExpanseModel.js";

export const search = async (req, res) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const { query } = req.query;

    const expanses = await Expanse.find({
      user: userId,
      description: { $regex: query, $options: "i" }
    });

    const notes = await Notes.find({
      user: userId,
      content: { $regex: query, $options: "i" }
    });

    const todos = await Todo.find({
      user: userId,
      title: { $regex: query, $options: "i" }
    });

    res.json({
      expanses,
      notes,
      todos
    });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}