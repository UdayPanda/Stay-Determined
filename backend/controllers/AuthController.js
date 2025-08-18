import User from "../models/UserModel.js";
import { compare } from "bcryptjs";
import { CompactEncrypt, jwtDecrypt } from "jose";
import { OAuth2Client } from "google-auth-library";

const age = 3 * 24 * 60 * 60 * 1000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = async (
  phone,
  id,
  name,
  email,
  createdAt,
  isAdmin,
  image
) => {
  const secret = new TextEncoder().encode(process.env.JWT_KEY);

  const payload = {
    phone,
    id: id.toString(),
    name,
    email,
    createdAt,
    isAdmin,
    image: image?.toString() || "",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + age,
  };

  const encodedPayload = new TextEncoder().encode(JSON.stringify(payload));

  const jwe = await new CompactEncrypt(encodedPayload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(secret);

  return jwe;
};

export default createToken;

export const signup = async (req, res, next) => {
  try {
    const { name, phone, email, password } = req.body;

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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone and password",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(404).json({
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

    res.cookie("jwt", token, {
      maxAge: age,
      secure: true,
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Login successfull",
      token,
      user: {
        id: user.id,
        phone: user.phone,
        isAdmin: user.isAdmin,
        email: user.email,
        name: user.name,
        Image: user.image,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();
    const user = await User.findOne({ email });
    if (user) {
      const token = await createToken(
        user.phone || "",
        user._id,
        user.name,
        user.email,
        user.createdAt,
        user.isAdmin,
        user.image
      );
      res.cookie("jwt", token, {
        maxAge: age,
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({
        success: true,
        message: "Login successfull",
        token,
        user: {
          id: user.id,
          phone: user.phone,
          isAdmin: user.isAdmin,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      });
    } else {
      const newUser = await User.create({
        name,
        email,
        image: picture,
        password: sub,
      });
      const token = await createToken(
        newUser.phone || "",
        newUser._id,
        newUser.name,
        newUser.email,
        newUser.createdAt,
        newUser.isAdmin,
        newUser.image
      );
      res.cookie("jwt", token, {
        maxAge: age,
        secure: true,
        sameSite: "None",
      });
      return res.status(200).json({
        success: true,
        message: "Login successfull",
        token,
        user: {
          id: newUser.id,
          phone: newUser.phone,
          isAdmin: newUser.isAdmin,
          email: newUser.email,
          name: newUser.name,
          Image: newUser.image,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone and password",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await User.findOneAndUpdate({ phone }, { password });
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const decodeTokenController = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token missing" });

    const secret = new TextEncoder().encode(process.env.JWT_KEY);

    const { payload } = await jwtDecrypt(token, secret);

    return res.status(200).json({ user: payload });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
