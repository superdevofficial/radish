"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
String.prototype.unescape = function () {
    var target = this;
    return target.replace(/\r?\n|\r/g, '');
};
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.pluriel = function () {
    return this + 's';
};
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
Array.prototype.unescapeAll = function () {
    return this.map((match) => _.isString(match) ? match.unescape() : match);
};
Array.prototype.trimAll = function () {
    return this.map((match) => _.isString(match) ? match.trim() : match);
};
Array.prototype.copy = function () {
    let newOne = [];
    this.forEach((value, index) => newOne.push(value));
    return newOne;
};
Array.prototype.removeDuplicate = function () {
    return this.filter((elem, index, self) => index == self.indexOf(elem));
};
Number.prototype.toRoman = function () {
    // @ts-ignore
    if (isNaN(this))
        return NaN;
    let digits = String(+this).split(""), key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"], roman = "", i = 3, res = '';
    if (_.isArray(digits) && !_.isNil(digits)) {
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }
    return (Array(+digits.join("") + 1).join("M") + roman);
};
//# sourceMappingURL=polyfills.js.map