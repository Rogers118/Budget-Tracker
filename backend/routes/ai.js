import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

router.get("/analyze/:userId", async(req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId });

        if (!transactions.length) {
            return res.status(404).json({ message: "No transactions found." });
        }


        const monthlyData = {};
        transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString("default", { month: "short", year: "numeric" });
            if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
            if (t.type === "income") monthlyData[month].income += t.amount;
            if (t.type === "expense") monthlyData[month].expense += t.amount;
        });

        const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
        const totalIncome = Object.values(monthlyData).reduce((s, m) => s + m.income, 0);
        const totalExpense = Object.values(monthlyData).reduce((s, m) => s + m.expense, 0);
        const balance = totalIncome - totalExpense;

        const categories = {};
        transactions.forEach(t => {
            if (t.type === "expense") {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            }
        });
        const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";


        const lastThree = sortedMonths.slice(-3);
        let trend = "neutral";
        let trendMessage = "Not enough data to analyze trends.";
        let prediction = "";
        let advice = "";
        let motivation = "";

        if (lastThree.length >= 2) {
            const trends = lastThree.map(m => ({
                month: m,
                income: monthlyData[m].income,
                expense: monthlyData[m].expense,
                savings: monthlyData[m].income - monthlyData[m].expense,
            }));

            const savingsTrend = trends[trends.length - 1].savings - trends[0].savings;

            if (savingsTrend > 0) {
                trend = "improving";
                trendMessage = "Your savings are increasing month by month.";
                prediction = "You’re on track for a strong financial position.";
                advice = "Stay consistent and consider investing part of your growing savings.";
                motivation = "🔥 Keep it up — your progress is showing real results!";
            } else if (savingsTrend < 0) {
                trend = "declining";
                trendMessage = "Your savings have been decreasing lately.";
                prediction = "If spending continues, you may face tighter months.";
                advice = "Reduce variable expenses and plan ahead for essentials only.";
                motivation = "💪 You’ve bounced back before — do it again!";
            } else {
                trend = "stable";
                trendMessage = "Your financial situation is stable.";
                prediction = "You’re maintaining steady financial habits.";
                advice = "Keep tracking and set small goals to improve further.";
                motivation = "🚀 Steady growth beats fast burnout!";
            }
        }


        const forecast = [];
        const avgIncome = totalIncome / sortedMonths.length;
        const avgExpense = totalExpense / sortedMonths.length;
        const currentMonth = new Date().getMonth();

        for (let i = 1; i <= 3; i++) {
            const monthName = new Date(2025, currentMonth + i, 1).toLocaleString("default", { month: "short" });
            const projectedIncome = Math.round(avgIncome * (1 + Math.random() * 0.05));
            const projectedExpense = Math.round(avgExpense * (1 + Math.random() * 0.05));
            const projectedSavings = projectedIncome - projectedExpense;
            forecast.push({ month: monthName, income: projectedIncome, expense: projectedExpense, savings: projectedSavings });
        }


        let healthScore = 0;


        const savingsRatio = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
        healthScore += Math.max(0, Math.min(40, (savingsRatio / 100) * 40));


        if (trend === "improving") healthScore += 40;
        else if (trend === "stable") healthScore += 25;
        else if (trend === "declining") healthScore += 10;


        const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 100;
        if (expenseRatio <= 70) healthScore += 20;
        else if (expenseRatio <= 90) healthScore += 10;
        else healthScore += 5;


        healthScore = Math.min(100, Math.max(0, Math.round(healthScore)));

        res.json({
            totalIncome,
            totalExpense,
            balance,
            topCategory,
            categories,
            transactions,
            insights: {
                trendMessage,
                prediction,
                advice,
                motivation,
                healthScore,
            },
            forecast,
        });

    } catch (err) {
        console.error("❌ Local AI analysis error:", err.message);
        res.status(500).json({ message: "Error analyzing data.", error: err.message });
    }
});

export default router;