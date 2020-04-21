
import * as _ from 'lodash';

String.prototype.unescape = function() {
  var target = this;
  return target.replace(/\r?\n|\r/g,'');
};

String.prototype.replaceAll = function(search: string, replacement: string) {
  var target = this;
  return target.split(search).join(replacement);
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.pluriel = function() {
  return this + 's';
};

String.prototype.replaceAt = function(index: number, replacement: string) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

Array.prototype.unescapeAll = function() {
  return this.map((match: any) => _.isString(match) ? match.unescape() : match);
};

Array.prototype.trimAll = function() {
  return this.map((match: any) => _.isString(match) ? match.trim() : match);
};

Array.prototype.copy = function () {
  let newOne: any[] = [];
  this.forEach((value: any, index: number) => newOne.push(value))
  return newOne;
};

Array.prototype.removeDuplicate = function() {
  return this.filter((elem: any, index: number, self: any) => index == self.indexOf(elem));
};

Number.prototype.toRoman = function () {
  // @ts-ignore
  if (isNaN(this)) return NaN;

  let digits: string[] = String(+this).split(""),
    key: string[] = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
            "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
            "","I","II","III","IV","V","VI","VII","VIII","IX"],
    roman: string = "",
    i: number = 3,
    res: any = '';

  if (_.isArray(digits) && !_.isNil(digits)) {
    while (i--) roman = (key[+(digits as any[]).pop() + (i * 10)] || "") + roman;
  }

  return (Array(+digits.join("") + 1).join("M") + roman) as any;
};
