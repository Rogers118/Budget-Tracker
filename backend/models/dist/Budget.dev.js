"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var budgetSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  period: {
    type: String,
    "default": 'monthly'
  }
});

var Budget = _mongoose["default"].model('Budget', budgetSchema);

var _default = Budget;
exports["default"] = _default;