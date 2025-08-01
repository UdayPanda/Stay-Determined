import Note from "../models/NotesModel.js";
import mongoose from "mongoose";

export const getAllNotes = async (req, res, next) => {
  try {
    const { user, date } = req.body;
    // console.log(user, date);

    if (!user && !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide user and date",
      });
    }

    const userId = new mongoose.Types.ObjectId(user);
    const notes = await Note.find({ user: userId, date });
    return res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addNotes = async (req, res, next) => {

  try {
    let { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        success: false,
        message: "No note data provided.",
      });
    }

    if (!Array.isArray(notes)) {
      if (typeof notes === "object" && notes !== null) {
        notes = [notes];
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid data format. Notes should be an object or array.",
        });
      }
    }

    let savedNotes = [];

    for (const note of notes) {
      const { content, user, date, _id } = note;

      if (!content?.trim() || !date || !user) {
        return res.status(400).json({
          success: false,
          message: "Each note must have content, user, and date.",
        });
      }

       let savedNote;

      if (_id) {
        const existingNote = await Note.findById(_id);
        if (existingNote) {
          savedNote = await Note.findByIdAndUpdate(
            _id,
            { content, user, date },
            { new: true }
          );
        } else {
          savedNote = await Note.create({ content, user, date });
        }
      } else {
        savedNote = await Note.create({ content, user, date });
      }

      savedNotes.push(savedNote);
    }

    return res.status(201).json({
      success: true,
      message: "Journal(s) added successfully.",
      notes: savedNotes,
    });
  } catch (error) {
    console.error("Add Notes Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const deleteNote = async (req, res, next) => {
  
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide id",
      });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    await Note.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
