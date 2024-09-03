import mongoose from "mongoose";


const expanseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
    debit: {
        type: Boolean,
        default: 0,
        required: true,
    },
    credit: {
        type: Boolean,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    party: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    todoID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
    },
    category: {
        type: String,
    }
})

const Expanse = mongoose.model("Expanses", expanseSchema)

export default Expanse