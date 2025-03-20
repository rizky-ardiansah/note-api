import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-note"]
        if (!token) {
            return res.status(401).json({ message: "Not authorized, token failed1" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token failed1" });
        }
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Not authorized, token failed1" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Not authorized, token failed1" });
    }
}