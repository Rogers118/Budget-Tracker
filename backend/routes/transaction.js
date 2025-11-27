import express from 'express';
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user && req.user.userId });
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.post('/', auth, async(req, res) => {
    const { type, amount, category, description } = req.body;

    try {
        const userId = req.user && req.user.userId;
        if (!userId) return res.status(401).json({ msg: 'Unauthorized user' });

        const transaction = new Transaction({
            userId,
            type,
            amount,
            category,
            description,
        });

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error('Error saving transaction:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.put('/:id', auth, async(req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        if (transaction.userId.toString() !== (req.user && req.user.userId))
            return res.status(403).json({ msg: 'Unauthorized' });

        transaction = await Transaction.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(transaction);
    } catch (err) {
        console.error('Error updating transaction:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});


router.delete('/:id', auth, async(req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

        if (transaction.userId.toString() !== (req.user && req.user.userId))
            return res.status(403).json({ msg: 'Unauthorized' });

        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;