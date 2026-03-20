import User from "../models/UserModel.js";
import { compare } from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { getFirebaseAuth } from "../lib/firebaseAdmin.js";

const age = 3 * 24 * 60 * 60 * 1000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const normalizeIndianPhone = (phone) => {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  // handle +91XXXXXXXXXX, 91XXXXXXXXXX, or XXXXXXXX
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
};

const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    maxAge: age,
    secure: isProd,
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
  };
};

// ================= CREATE TOKEN (REPLACED JWE → JWT) =================
const createToken = async (
  phone,
  id,
  name,
  email,
  createdAt,
  isAdmin,
  image
) => {
  return jwt.sign(
    {
      phone,
      id: id.toString(),
      name,
      email,
      createdAt,
      isAdmin,
      image: image || "",
    },
    process.env.JWT_KEY,
    {
      expiresIn: "3d",
    }
  );
};

export default createToken;

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const phone = normalizeIndianPhone(req.body.phone);

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone and password",
      });
    }

    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    const user = await User.create({ name, phone, email, password });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const phone = normalizeIndianPhone(req.body.phone);
    const { password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone and password",
      });
    }

    // ⚡ optimized query
    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await createToken(
      phone,
      user._id,
      user.name,
      user.email,
      user.createdAt,
      user.isAdmin,
      user.image
    );

    res.cookie("jwt", token, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        phone: user.phone,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        image: user.image,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
        password: sub,
      });
    }

    const jwtToken = await createToken(
      user.phone || "",
      user._id,
      user.name,
      user.email,
      user.createdAt,
      user.isAdmin,
      user.image
    );

    res.cookie("jwt", jwtToken, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user: {
        id: user.id,
        phone: user.phone,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= FORGOT PASSWORD (FIXED SECURITY BUG) =================
export const forgotPassword = async (req, res) => {
  try {
    const phone = normalizeIndianPhone(req.body.phone);
    const { password, idToken } = req.body;

    if (!phone || !password || !idToken) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone, password and idToken",
      });
    }

    // Verify the Firebase phone OTP proof server-side (prevents direct API abuse).
    const firebaseAuth = getFirebaseAuth();
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const decodedPhone = normalizeIndianPhone(decoded.phone_number || decoded.phoneNumber);
    if (!decodedPhone || decodedPhone !== phone) {
      return res.status(403).json({
        success: false,
        message: "OTP verification failed",
      });
    }

    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 hash password (IMPORTANT FIX)
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ================= DECODE TOKEN (UPDATED) =================
export const decodeTokenController = async (req, res) => {
  try {
    const token = req.body.token || req.cookies.jwt;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    return res.status(200).json({
      success: true,
      user: decoded,
    });

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};


export const getMe = async (req, res) => {
  try {
    // user already available from authMiddleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};


export const logout = async (req, res) => {
  try {
    // Clear across common env/browser combinations (dev http vs prod https).
    // sameSite/secure must match how the cookie was originally set.
    res.clearCookie("jwt", { httpOnly: true, secure: false, sameSite: "Lax", path: "/" });
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None", path: "/" });
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "Lax", path: "/" });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    // create new token
    const newToken = await createToken(
      decoded.phone,
      decoded.id,
      decoded.name,
      decoded.email,
      decoded.createdAt,
      decoded.isAdmin,
      decoded.image
    );

    res.cookie("jwt", newToken, {
      ...cookieOptions(),
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
    });

  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, image } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, image },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};
