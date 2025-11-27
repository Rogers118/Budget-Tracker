import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        get: (v) => parseFloat(v.toFixed(2))
    },
    currency: {
        type: String,
        default: 'KES'
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
}, {
    toJSON: { getters: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;