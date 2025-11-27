import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import OpenAI from "openai";
import Transaction from "../models/Transaction.js";


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });


console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateInsights = async(req, res) => {
    try {
        const { transactions } = req.body;

        if (!transactions || transactions.length === 0) {
            return res.status(400).json({ insight: "No transaction data provided." });
        }

        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        const breakdown = transactions.map(t => `${t.category}: ${t.amount}`).join(", ");

        const prompt = `
      You are a financial assistant. Analyze the user's spending:
      - Total spent: ${total}
      - Breakdown: ${breakdown}
      Provide 2-3 key insights and 1 personalized saving tip.
    `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const aiMessage = response.choices[0].message.content.trim();
        res.json({ insight: aiMessage });
    } catch (err) {
        console.error("AI analysis error:", err);
        res.status(500).json({ insight: "AI analysis failed." });
    }
};
export const analyzeTransactions = async(req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId });

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({
                message: "No transactions found for this user.",
                aiAdvice: "Add some income and expense data first to enable analysis.",
            });
        }

        const totalIncome = transactions
            .filter(t => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        const categories = {};
        transactions.forEach(t => {
            if (t.type === "expense") {
                categories[t.category] = (categories[t.category] || 0) + t.amount;
            }
        });

        const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";

        // 🧠 Build AI prompt
        const summary = `
      Total Income: ${totalIncome} Ksh
      Total Expenses: ${totalExpense} Ksh
      Balance: ${balance} Ksh
      Top Spending Category: ${topCategory}
      Spending Breakdown: ${JSON.stringify(categories, null, 2)}
    `;

        const prompt = `
      You are a financial advisor AI.
      Analyze this user's budget data and provide:
      1. A concise prediction of future spending.
      2. Two personalized financial improvement tips.
      3. One short motivational line.
      Use "Ksh" for all currency.

      ${summary}

      Respond strictly in JSON format:
      {
        "prediction": "...",
        "advice": "...",
        "motivation": "..."
      }
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });

        const aiText = completion.choices[0].message.content;
        let aiOutput;

        try {
            aiOutput = JSON.parse(aiText);
        } catch {
            aiOutput = { prediction: aiText };
        }

        res.json({
            totalIncome,
            totalExpense,
            balance,
            topCategory,
            aiOutput,
        });
    } catch (error) {
        console.error("AI analysis error:", error);
        res.status(500).json({ message: "Error analyzing transactions with AI." });
    }
};