import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false
    },
    email:{
        type: String,
        required: false
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone is required"],
        unique: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    image: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {  
        return next();
    }
    const salt = await genSalt(10);
    const hashing = await hash(this.password, salt);
    this.password = hashing;
    next();
})

const User = mongoose.model("Users", userSchema);

export default User;