"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _auth = _interopRequireDefault(require("./routes/auth.js"));

var _transaction = _interopRequireDefault(require("./routes/transaction.js"));

var _budget = _interopRequireDefault(require("./routes/budget.js"));

var _ai = _interopRequireDefault(require("./routes/ai.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])(); // Middleware

app.use((0, _cors["default"])());
app.use(_express["default"].json()); // MongoDB connection

_mongoose["default"].connect(process.env.MONGO_URI).then(function () {
  return console.log('MongoDB connected');
})["catch"](function (err) {
  return console.log(err);
}); // Routes


app.use('/api/auth', _auth["default"]);
app.use('/api/transaction', _transaction["default"]);
app.use('/api/budget', _budget["default"]);
app.use('/api/ai', _ai["default"]); // Server

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});