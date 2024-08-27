import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

const age = 3 * 24 * 60 * 60 * 1000;

const createToken = (phone, id) => {
    return jwt.sign({ phone, id }, process.env.JWT_KEY, { expiresIn: age })
}

export const signup = async (req, res, next) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide phone and password"
            })
        }

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        const user = await User.create({ name, phone, email, password });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user.id,
                phone: user.phone,
                isAdmin: user.isAdmin
            }
        })

    } catch (error) {
        console.log(error);

        return res.status(500)
            .json({
                success: false,
                message: 'Internal server error'
            });
    }
}

export const login = async (req, res, next) => {
    try {

        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide phone and password"
            })
        }

        const user = await User.findOne({ phone })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        const auth = await compare(password, user.password)
        if (!auth) {
            return res.status(404).json({
                success: false,
                message: "Incorrect password",
            })
        }

        res.cookie("jwt", createToken(phone, user._id), {
            maxAge: age,
            secure: true,
            sameSite: 'None',
        })


        return res.status(200).json({
            success: true,
            message: "Login successfull",
            user: {
                id: user.id,
                phone: user.phone,
                isAdmin: user.isAdmin,
                email: user.email,
                name: user.name,
                Image: user.Image,
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500)
            .json({
                success: false,
                message: 'Internal server error'
            });
    }
}