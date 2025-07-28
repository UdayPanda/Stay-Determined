import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
    date: {
        type: Date,
        default: Date.now
    }
})

const Note = mongoose.model("Notes", notesSchema)

export default Note;