import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completed:{
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
    scheduledFor: {
        type: Date,
        default: undefined,
    },
    reminder: {
        type: Boolean,
        default: false
    },
    reminderTime: {
        type: String,
        default: undefined
    },
    label: {
        type: Number,
        enum: {
                values: [1,2,3,4],
                message: `You entered invalid label. It must be 1, 2, 3 or 4.`
        },
        default: 1,
    },
    expanse: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.model("Todos", todoSchema)

export default Todo