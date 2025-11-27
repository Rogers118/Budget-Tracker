import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();


router.post('/register', async(req, res) => {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        user = new User({ email, password: hashed });
        await user.save();

        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );


        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );


        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;