"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptText = exports.encryptText = void 0;
var crypto_js_1 = require("crypto-js");
var encryptText = function (text) {
    // const encrypted:string = cryptr.encrypt(text);
    var encrypted = (0, crypto_js_1.SHA256)(text);
    return encrypted;
};
exports.encryptText = encryptText;
var decryptText = function (encryptText) {
    // const decrypted:string = cryptr.decrypt(encryptText);
    // return decrypted;
    return "";
};
exports.decryptText = decryptText;
// import {Rabbit} from 'crypto-js'
// export const encryptText=(text:string):string=>{
//     const encrypted:any = Rabbit.encrypt(text, "Secret");
//     return encrypted;
// }
// export const decryptText=(encryptText:string):string=>{
//     const decrypted:any = Rabbit.decrypt(encryptText, "Secret");
//     return decrypted;
// }
