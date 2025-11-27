"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var auth = function auth(req, res, next) {
  var authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({
    msg: 'No token, authorization denied'
  });
  var token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({
    msg: 'No token, authorization denied'
  });

  try {
    var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);

    req.user = decoded;
  } catch (err) {
    return res.status(401).json({
      msg: 'Invalid or expired token'
    });
  }
};

var _default = auth;
exports["default"] = _default;