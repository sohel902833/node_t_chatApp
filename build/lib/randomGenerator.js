"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = void 0;
var getRandomNumber = function (min, max) {
    var minm = min ? min : 100000;
    var maxm = max ? max : 999999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
};
exports.getRandomNumber = getRandomNumber;
