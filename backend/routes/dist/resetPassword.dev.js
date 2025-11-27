"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _User = _interopRequireDefault(require("../models/User.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post("/verify-email", function _callee(req, res) {
  var email, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.body.email;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_User["default"].findOne({
            email: email
          }));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Email not found"
          }));

        case 7:
          return _context.abrupt("return", res.json({
            message: "Email verified",
            userId: user._id
          }));

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", res.status(500).json({
            message: "Server error"
          }));

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
});
router.post("/reset-password", function _callee2(req, res) {
  var _req$body, userId, newPassword, user, salt;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, newPassword = _req$body.newPassword;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_User["default"].findById(userId));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_bcryptjs["default"].genSalt(10));

        case 9:
          salt = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, salt));

        case 12:
          user.password = _context2.sent;
          _context2.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          return _context2.abrupt("return", res.json({
            message: "Password updated successfully"
          }));

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](1);
          return _context2.abrupt("return", res.status(500).json({
            message: "Server error"
          }));

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 18]]);
});
var _default = router;
exports["default"] = _default;