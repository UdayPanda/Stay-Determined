import mongoose from "mongoose";
import bcrypt from "bcryptjs";


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
        // required: [true, "Phone is required"],
        // unique: true,
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
    if (!this.isModified("password")) {  
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
});

const User = mongoose.model("Users", userSchema);

export default User;