const pkg = require('../../package.json'),
  chalk = require('chalk'),
  figlet = require('figlet');

function Cmd(options = {}) {
  this.isValid = false;

  if (typeof options === "object" && options != null) {
    this.rl = options.rl ? options.rl : null;
    this.fonts = options.fonts ? options.fonts : null;
    this.colors = options.colors ? options.colors : null;
    this.options = options.options ? options.options : null;

    if (this.rl && this.fonts && this.colors && this.options) {
      this.isValid = true;
    }
  }
}

Cmd.prototype.shutdown = function() {
  if (this.isValid)
    this.rl.close();
}

Cmd.prototype.break = function(text) {
  this.log('break');
};

Cmd.prototype.error = function(text) {
  this.log('error', text);
};

Cmd.prototype.ask = function(text, callback) {
  this.log(text, callback);
};

Cmd.prototype.success = function(text) {
  this.log('success', text);
};

Cmd.prototype.question = function (text, defaultValue) {
  return text + ' ' + this.example(defaultValue);
};

Cmd.prototype.example = function(data) {
  return chalk.grey( data === 'boolean' ? '[Y/n]' : '(' + data + ')');
};

Cmd.prototype.title = function(text) {
  this.log('title', text);
};

Cmd.prototype.romanTitle = function(text) {
  this.log('romanTitle', text);
};

Cmd.prototype.log = function(text, plus) {
  if (!this.isValid) return;

  let self = this;

  if ( text === 'presentation' ) {
    console.clear();
    console.log(figlet.textSync(pkg.title, this.fonts.main));
    this.log('line');
    console.log(chalk.bold(pkg.description));
    this.log('line');
  } else if ( text === 'line' ) {
    console.log(`----------------------------------------\r`);
  } else if ( text === 'back' ) {
    console.log(`\n`);
  } else if ( text === 'break' ) {
      console.log(`\r`);
  } else if ( text === 'clean' ) {
    console.clear();
  } else if ( text === 'romanTitle' ) {
    let startLine = chalk.hex(this.colors.yellow)('[ ' + this.options.romanTitleCount.toRoman() + ' ] ');
    console.log(chalk.hex(this.colors.yellow)(chalk.bold(startLine + plus || '')));
    this.options.romanTitleCount++;
    this.options.titleCount = 1;
  } else if ( text === 'title' ) {
    console.log(chalk.hex(this.colors.green)(chalk.bold('( ' + this.options.titleCount + ' ) ' + plus || '')));
    this.options.titleCount++;
  } else if ( text === 'warn' ) {
    console.log(chalk.bold(chalk.hex(this.colors.yellow)('(u_u) ') + (plus || '')));
  } else if ( text === 'error' ) {
    console.log(chalk.bold(chalk.hex(this.colors.red)('(ఠ_ఠ) ' + TEXTS.ERROR.PREFIX) + (`➜  `+plus || '')));
  } else if ( typeof plus === 'function' ) {
    let startLine = chalk.hex(this.colors.green)('(°o°) ');
    self.rl.question( chalk.bold(startLine + text) + ' ', answer => plus.bind(self)(answer) );
  } else if ( text === 'success' ) {
    console.log(chalk.hex(this.colors.blue)(chalk.bold('(^ပ^) ' + plus)));
  } else {
    let startLine = chalk.hex(this.colors.green)('(^-^) ');
    console.log(chalk.bold(startLine + text));
  }
};

module.exports = Cmd;