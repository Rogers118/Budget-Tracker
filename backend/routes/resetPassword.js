import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/verify-email", async(req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "Email not found" });

        return res.json({ message: "Email verified", userId: user._id });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});


router.post("/reset-password", async(req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        return res.json({ message: "Password updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});


export default router;