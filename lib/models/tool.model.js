
const _ = require('lodash');

function Tool(_options) {
  this.isValid = false;
  this.name = '';
  this.questions = null;

  if (_.isObject(_options) && _.isObject(_options.cmd) && _.isObject(_options.builder)) {
    this.isValid = true;
    this.cmd = _options.cmd;
    this.builder = _options.builder;
    this.options = _options.options || {};
  }
}

Tool.prototype.init = async function (...args) {

};

Tool.prototype.shutdown = function() {
  this.cmd.shutdown();
};

module.exports = Tool;
