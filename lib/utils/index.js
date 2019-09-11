const Cmd = require('./cmd'),
  Reader =  require('./reader');

String.prototype.unescape = function() {
  var target = this;
  return target.replace(/\r?\n|\r/g,'');
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.split(search).join(replacement);
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.pluriel = function() {
  return this + 's';
};

String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
};

Array.prototype.unescapeAll = function() {
  return this.map(match => _.isString(match) ? match.unescape() : match);
};

Array.prototype.trimAll = function() {
  return this.map(match => _.isString(match) ? match.trim() : match);
};

Array.prototype.copy = function () {
  var newOne = [];
  this.forEach(function(value, index){ newOne.push(value); })
  return newOne;
};

Array.prototype.removeDuplicate = function() {
  return this.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
  });
};

Number.prototype.toRoman = function () {
  if (isNaN(this)) return NaN;
  var digits = String(+this).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
              "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
              "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--) roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
};

module.exports = {
  Cmd,
  Reader
}