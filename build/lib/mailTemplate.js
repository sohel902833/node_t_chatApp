"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPasswordResetCodeTemplate = exports.getVerifyMailTemplate = void 0;
var getVerifyMailTemplate = function (url, text) {
    return " <div\n    style=\"\n      text-align: center;\n      border-radius: 5px;\n      padding: 10px;\n      border: 1px solid blue;\n      height: 600px;\n      width: 600px;\n      background-color: white;\n      margin: 0 auto;\n    \"\n  >\n    <h1\n      style=\"\n        text-align: center;\n        color: blue;\n        font-weight: 600;\n        font-family: Arial, Helvetica, sans-serif;\n      \"\n    >\n      Thanks For Choosing Us,, Click Below Link To Verify Your Account.\n    </h1>\n    <a\n      style=\"margin-top: 50px; text-align: center\"\n      href=\"".concat(url, "\"\n      ><button\n        style=\"\n          outline: none;\n          border: none;\n          font-weight: bolder;\n          cursor: pointer;\n          color: white;\n          background-color: blue;\n          padding: 10px 20px;\n          margin-top: 40px;\n        \"\n      >\n        Verify\n      </button></a\n    >\n    <p style=\"margin-top: 20px\">").concat(text, "</p>\n  </div>");
};
exports.getVerifyMailTemplate = getVerifyMailTemplate;
var getPasswordResetCodeTemplate = function (code, text) {
    return " <div\n  style=\"\n    text-align: center;\n    border-radius: 5px;\n    padding: 10px;\n    border: 1px solid blue;\n    height: 600px;\n    width: 600px;\n    background-color: white;\n    margin: 0 auto;\n  \"\n>\n  <h1\n    style=\"\n      text-align: center;\n      color: blue;\n      font-weight: 600;\n      font-family: Arial, Helvetica, sans-serif;\n    \"\n  >\n    Use Below Code for reset your password\n  </h1>\n  <button\n    style=\"\n      outline: none;\n      border: none;\n      font-weight: bolder;\n      cursor: pointer;\n      color: white;\n      background-color: blue;\n      padding: 10px 20px;\n      margin-top: 40px;\n      font-size: 30px;\n    \"\n  >\n    ".concat(code, "\n  </button>\n  <p style=\"margin-top: 20px\">").concat(text, "</p>\n</div>");
};
exports.getPasswordResetCodeTemplate = getPasswordResetCodeTemplate;
