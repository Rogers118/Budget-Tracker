import express from 'express';
import auth from '../middleware/auth.js';
import Budget from '../models/Budget.js';

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user.userId });
        res.json(budgets);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/', auth, async(req, res) => {
    const { category, amount } = req.body;
    try {
        let budget = await Budget.findOne({ userId: req.user.userId, category });
        if (budget) {
            budget.amount = amount;
            await budget.save();
            return res.json(budget);
        }
        budget = new Budget({ userId: req.user.userId, category, amount });
        await budget.save();
        res.json(budget);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;