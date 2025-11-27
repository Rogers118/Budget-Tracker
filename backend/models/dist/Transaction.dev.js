"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var transactionSchema = new _mongoose["default"].Schema({
  userId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    "enum": ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    get: function get(v) {
      return parseFloat(v.toFixed(2));
    }
  },
  currency: {
    type: String,
    "default": 'KES'
  },
  category: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    "default": Date.now
  },
  description: {
    type: String
  }
}, {
  toJSON: {
    getters: true
  }
});

var Transaction = _mongoose["default"].model('Transaction', transactionSchema);

var _default = Transaction;
exports["default"] = _default;