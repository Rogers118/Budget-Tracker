"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _Budget = _interopRequireDefault(require("../models/Budget.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/', _auth["default"], function _callee(req, res) {
  var budgets;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_Budget["default"].find({
            userId: req.user.userId
          }));

        case 3:
          budgets = _context.sent;
          res.json(budgets);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            msg: 'Server error'
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/', _auth["default"], function _callee2(req, res) {
  var _req$body, category, amount, budget;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, category = _req$body.category, amount = _req$body.amount;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_Budget["default"].findOne({
            userId: req.user.userId,
            category: category
          }));

        case 4:
          budget = _context2.sent;

          if (!budget) {
            _context2.next = 10;
            break;
          }

          budget.amount = amount;
          _context2.next = 9;
          return regeneratorRuntime.awrap(budget.save());

        case 9:
          return _context2.abrupt("return", res.json(budget));

        case 10:
          budget = new _Budget["default"]({
            userId: req.user.userId,
            category: category,
            amount: amount
          });
          _context2.next = 13;
          return regeneratorRuntime.awrap(budget.save());

        case 13:
          res.json(budget);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            msg: 'Server error'
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 16]]);
});
var _default = router;
exports["default"] = _default;