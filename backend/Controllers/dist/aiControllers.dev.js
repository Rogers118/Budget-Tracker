"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInsights = void 0;

var _openai = _interopRequireDefault(require("openai"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");
var openai = new _openai["default"]({
  apiKey: process.env.OPENAI_API_KEY
});

var generateInsights = function generateInsights(req, res) {
  var transactions, total, breakdown, prompt, response, aiMessage;
  return regeneratorRuntime.async(function generateInsights$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transactions = req.body.transactions;

          if (!(!transactions || transactions.length === 0)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            insight: "No transaction data provided."
          }));

        case 4:
          total = transactions.reduce(function (sum, t) {
            return sum + t.amount;
          }, 0);
          breakdown = transactions.map(function (t) {
            return "".concat(t.category, ": ").concat(t.amount);
          }).join(", ");
          prompt = "\n      You are a financial assistant. Analyze the user's spending:\n      - Total spent: ".concat(total, "\n      - Breakdown: ").concat(breakdown, "\n      Provide 2-3 key insights and 1 personalized saving tip.\n    ");
          _context.next = 9;
          return regeneratorRuntime.awrap(openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: prompt
            }]
          }));

        case 9:
          response = _context.sent;
          aiMessage = response.choices[0].message.content.trim();
          res.json({
            insight: aiMessage
          });
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          console.error("AI analysis error:", _context.t0.message);
          res.status(500).json({
            insight: "AI analysis failed."
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.generateInsights = generateInsights;