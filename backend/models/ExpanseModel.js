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
        validate: {
            validator: function(v) {
                return v == null || mongoose.Types.ObjectId.isValid(v);
            },
            message: 'Invalid todoID'
        }
    },
    category: {
        type: String,
    }
})

// Query patterns:
// - last transaction for a user by date
// - list transactions by user + date range (sorted by date desc)
// - dedupe check by user + date + party + amount
expanseSchema.index({ user: 1, date: -1 });
expanseSchema.index({ user: 1, date: 1 });
expanseSchema.index({ user: 1, date: 1, party: 1, amount: 1 });

const Expanse = mongoose.model("Expanses", expanseSchema)

export default Expanse