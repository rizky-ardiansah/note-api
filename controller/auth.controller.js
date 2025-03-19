import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingEmail = await User.findOne({ email });

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        res.cookie("jwt-note", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                user: user,
            },
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if (!user) {
            return res.status(400).json({ message: "Email or Password invalid" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Email or Password invalid" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
        });

        res.cookie("jwt-note", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: user,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt-note")
        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}