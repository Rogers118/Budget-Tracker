"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = _interopRequireDefault(require("../middleware/auth.js"));

var _Transaction = _interopRequireDefault(require("../models/Transaction.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/', _auth["default"], function _callee(req, res) {
  var transactions;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_Transaction["default"].find({
            userId: req.user && req.user.userId
          }));

        case 3:
          transactions = _context.sent;
          res.json(transactions);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching transactions:', _context.t0);
          res.status(500).json({
            msg: 'Server error'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/', _auth["default"], function _callee2(req, res) {
  var _req$body, type, amount, category, description, userId, transaction;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, type = _req$body.type, amount = _req$body.amount, category = _req$body.category, description = _req$body.description;
          _context2.prev = 1;
          userId = req.user && req.user.userId;

          if (userId) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            msg: 'Unauthorized user'
          }));

        case 5:
          transaction = new _Transaction["default"]({
            userId: userId,
            type: type,
            amount: amount,
            category: category,
            description: description
          });
          _context2.next = 8;
          return regeneratorRuntime.awrap(transaction.save());

        case 8:
          res.json(transaction);
          _context2.next = 15;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](1);
          console.error('Error saving transaction:', _context2.t0);
          res.status(500).json({
            msg: 'Server error'
          });

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 11]]);
});
router.put('/:id', _auth["default"], function _callee3(req, res) {
  var transaction;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_Transaction["default"].findById(req.params.id));

        case 3:
          transaction = _context3.sent;

          if (transaction) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            msg: 'Transaction not found'
          }));

        case 6:
          if (!(transaction.userId.toString() !== (req.user && req.user.userId))) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(403).json({
            msg: 'Unauthorized'
          }));

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(_Transaction["default"].findByIdAndUpdate(req.params.id, {
            $set: req.body
          }, {
            "new": true
          }));

        case 10:
          transaction = _context3.sent;
          res.json(transaction);
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.error('Error updating transaction:', _context3.t0);
          res.status(500).json({
            msg: 'Server error'
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
});
router["delete"]('/:id', _auth["default"], function _callee4(req, res) {
  var transaction;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_Transaction["default"].findById(req.params.id));

        case 3:
          transaction = _context4.sent;

          if (transaction) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            msg: 'Transaction not found'
          }));

        case 6:
          if (!(transaction.userId.toString() !== (req.user && req.user.userId))) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(403).json({
            msg: 'Unauthorized'
          }));

        case 8:
          _context4.next = 10;
          return regeneratorRuntime.awrap(_Transaction["default"].findByIdAndDelete(req.params.id));

        case 10:
          res.json({
            msg: 'Transaction deleted successfully'
          });
          _context4.next = 17;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error('Error deleting transaction:', _context4.t0);
          res.status(500).json({
            msg: 'Server error'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
});
var _default = router;
exports["default"] = _default;