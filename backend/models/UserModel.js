import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true, 
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      index: true, 
      sparse: true, 
      unique: true, 
    },

    isAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index (optional but powerful)
userSchema.index({ phone: 1, email: 1 });

// ================= HASH PASSWORD =================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // lower salt rounds for better performance (10 → 8)
  const salt = await bcrypt.genSalt(8);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ================= COMPARE METHOD =================
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("Users", userSchema);

export default User;