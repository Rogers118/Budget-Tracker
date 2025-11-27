"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Transaction = _interopRequireDefault(require("../models/Transaction.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get("/analyze/:userId", function _callee(req, res) {
  var userId, transactions, monthlyData, sortedMonths, totalIncome, totalExpense, balance, categories, sortedCategories, topCategory, lastThree, trend, trendMessage, prediction, advice, motivation, trends, savingsTrend, forecast, avgIncome, avgExpense, currentMonth, i, monthName, projectedIncome, projectedExpense, projectedSavings, healthScore, savingsRatio, expenseRatio;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.params.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(_Transaction["default"].find({
            userId: userId
          }));

        case 4:
          transactions = _context.sent;

          if (transactions.length) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "No transactions found."
          }));

        case 7:
          monthlyData = {};
          transactions.forEach(function (t) {
            var month = new Date(t.date).toLocaleString("default", {
              month: "short",
              year: "numeric"
            });
            if (!monthlyData[month]) monthlyData[month] = {
              income: 0,
              expense: 0
            };
            if (t.type === "income") monthlyData[month].income += t.amount;
            if (t.type === "expense") monthlyData[month].expense += t.amount;
          });
          sortedMonths = Object.keys(monthlyData).sort(function (a, b) {
            return new Date(a) - new Date(b);
          });
          totalIncome = Object.values(monthlyData).reduce(function (s, m) {
            return s + m.income;
          }, 0);
          totalExpense = Object.values(monthlyData).reduce(function (s, m) {
            return s + m.expense;
          }, 0);
          balance = totalIncome - totalExpense;
          categories = {};
          transactions.forEach(function (t) {
            if (t.type === "expense") {
              categories[t.category] = (categories[t.category] || 0) + t.amount;
            }
          });
          sortedCategories = Object.entries(categories).sort(function (a, b) {
            return b[1] - a[1];
          });
          topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : "N/A";
          lastThree = sortedMonths.slice(-3);
          trend = "neutral";
          trendMessage = "Not enough data to analyze trends.";
          prediction = "";
          advice = "";
          motivation = "";

          if (lastThree.length >= 2) {
            trends = lastThree.map(function (m) {
              return {
                month: m,
                income: monthlyData[m].income,
                expense: monthlyData[m].expense,
                savings: monthlyData[m].income - monthlyData[m].expense
              };
            });
            savingsTrend = trends[trends.length - 1].savings - trends[0].savings;

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

          forecast = [];
          avgIncome = totalIncome / sortedMonths.length;
          avgExpense = totalExpense / sortedMonths.length;
          currentMonth = new Date().getMonth();

          for (i = 1; i <= 3; i++) {
            monthName = new Date(2025, currentMonth + i, 1).toLocaleString("default", {
              month: "short"
            });
            projectedIncome = Math.round(avgIncome * (1 + Math.random() * 0.05));
            projectedExpense = Math.round(avgExpense * (1 + Math.random() * 0.05));
            projectedSavings = projectedIncome - projectedExpense;
            forecast.push({
              month: monthName,
              income: projectedIncome,
              expense: projectedExpense,
              savings: projectedSavings
            });
          }

          healthScore = 0;
          savingsRatio = totalIncome > 0 ? balance / totalIncome * 100 : 0;
          healthScore += Math.max(0, Math.min(40, savingsRatio / 100 * 40));
          if (trend === "improving") healthScore += 40;else if (trend === "stable") healthScore += 25;else if (trend === "declining") healthScore += 10;
          expenseRatio = totalIncome > 0 ? totalExpense / totalIncome * 100 : 100;
          if (expenseRatio <= 70) healthScore += 20;else if (expenseRatio <= 90) healthScore += 10;else healthScore += 5;
          healthScore = Math.min(100, Math.max(0, Math.round(healthScore)));
          res.json({
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            balance: balance,
            topCategory: topCategory,
            categories: categories,
            transactions: transactions,
            insights: {
              trendMessage: trendMessage,
              prediction: prediction,
              advice: advice,
              motivation: motivation,
              healthScore: healthScore
            },
            forecast: forecast
          });
          _context.next = 43;
          break;

        case 39:
          _context.prev = 39;
          _context.t0 = _context["catch"](0);
          console.error("❌ Local AI analysis error:", _context.t0.message);
          res.status(500).json({
            message: "Error analyzing data.",
            error: _context.t0.message
          });

        case 43:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 39]]);
});
var _default = router;
exports["default"] = _default;