const pkg = require('../../package.json'),
  chalk = require('chalk'),
  figlet = require('figlet'),
  rxjs = require('rxjs'),
  _ = require('lodash');

function Cmd(options = {}) {
  this.isValid = false;

  if (typeof options === "object" && options != null) {
    this.rl = options.rl ? options.rl : null;
    this.fonts = options.fonts ? options.fonts : null;
    this.colors = options.colors ? options.colors : null;
    this.options = options.options ? options.options : null;
    this.keysHandlerSubject = new rxjs.Subject();

    if (this.rl && this.fonts && this.colors && this.options) {
      this.isValid = true;
      events.call(this);
    }
  }

  /**
   * Set up event handler
   */
  function events() {
    process.stdin.on('keypress', (str, key) => this.keysHandlerSubject.next(key));
  }
}

/**
 * Clear console
 */
Cmd.prototype.clear = function() {
  console.clear();
  return this;
};

/**
 * Write simple text
 */
Cmd.prototype.print = function(text) {
  process.stdout.write(text);
  return this;
};

/**
 * Write presentation of your application
 */
Cmd.prototype.presentation = function() {
  this.clear()
    .print(figlet.textSync(pkg.title, this.fonts.main)).back()
    .line()
    .print(chalk.bold(pkg.description)).back()
    .line();
  return this;
};

/**
 * Write line
 */
Cmd.prototype.line = function() {
  this.print(`----------------------------------------`).back();
  return this;
}

/**
 * Shutdown the console
 */
Cmd.prototype.shutdown = function() {
  if (this.isValid){
    this.rl.close();
    process.exit();
  }
};

/**
 * Print the back character
 */
Cmd.prototype.back = function() {
  this.print(`\n`);
  return this;
};

/**
 * Print the back character
 */
Cmd.prototype.break = function() {
  this.print(`\r`);
  return this;
};

/**
 * Print an error message
 */
Cmd.prototype.error = function(text) {
  this.print(chalk.bold(chalk.hex(this.colors.red)('(ఠ_ఠ) ') + (`➜  `+ text || ''))).back();
  return this;
};

/**
 * Print a warn message
 */
Cmd.prototype.warn = function(text) {
  this.print(chalk.bold(chalk.hex(this.colors.yellow)('(u_u) ') + (text || ''))).back();
  return this;
};

/**
 * Ask a question
 */
Cmd.prototype.ask = function(text, callback) {
  let startLine = chalk.hex(this.colors.green)('(°o°) ');
  this.rl.question(chalk.bold(startLine + text) + ' ', answer => callback.bind(this)(answer));
  return this;
};

/**
 * Ask a question with choices
 */
Cmd.prototype.askWithChoices = function(text, choices, callback) {
  let index = 0;
  this.question(_.isString(text) && text || '', choices[index]);
  this.select(choices, index, choices[index]);

  let subscriber = this.keysHandlerSubject.subscribe({
    next: key => {
      if (key.name === 'right' && index != choices.length - 1) index++;
      if (key.name === 'left' && index != 0) index--;

      if (key.name !== 'return') {
        this.select(choices, index, choices[0]);
      } else {
        if (_.isFunction(callback)) {
          callback(choices[index]);
        }

        subscriber.unsubscribe();
      }
    }
  });
};

/**
 * Just print question text
 */
Cmd.prototype.question = function(text, defaultValue) {
  let startLine = chalk.hex(this.colors.green)('(°o°) ');
  this.print(chalk.bold(startLine + this.getQuestion(text, defaultValue)) + ' ').back();
  return this;
};

/**
 * Print a success message
 */
Cmd.prototype.success = function(text) {
  this.print(chalk.hex(this.colors.blue)(chalk.bold('(^ပ^) ' + text))).back();
  return this;
};

/**
 * Print simple title
 */
Cmd.prototype.title = function(text) {
  this.print(chalk.hex(this.colors.green)(chalk.bold('( ' + this.options.titleCount + ' ) ' + text || '')));
  this.options.titleCount++;
  this.back();
  return this;
};

/**
 * Print roman title
 */
Cmd.prototype.romanTitle = function(text) {
  let startLine = chalk.hex(this.colors.yellow)('[ ' + this.options.romanTitleCount.toRoman() + ' ] ');
  this.print(chalk.hex(this.colors.yellow)(chalk.bold(startLine + text || '')));
  this.options.romanTitleCount++;
  this.options.titleCount = 1;
  this.back();
  return this;
};

/**
 * Print simple message
 */
Cmd.prototype.message = function(text) {
  let startLine = chalk.hex(this.colors.green)('(^-^) ');
  this.print(chalk.bold(startLine + text)).back();
  return this;
};

/**
 * Print select input
 */
Cmd.prototype.select = function(choices, choosed, defaultChoice) {
  choosed = _.isNumber(choosed) && choosed || 0;
  defaultChoice = _.isString(defaultChoice) && defaultChoice || '';

  if (_.isArray(choices) && choices.length !== 0) {
    let textChoices = chalk.hex(this.colors.green)('  ↳  '), 
    startLine = chalk.hex(this.colors.green)('(°o°) ');

    choices.forEach((value, index) => {
      textChoices += choosed === index ? chalk.hex(this.colors.yellow)(`▣  ${value} `) : `▢  ${value} `;
    });

    this.break().print(textChoices);
  }
};

/**
 * Generic methods for print something
 */
Cmd.prototype.log = function(text, plus) {
  if (!this.isValid) return;

  if ( text === 'presentation' ) {
    this.presentation();
  } else if (text === 'line') {
    this.line();
  } else if (text === 'back') {
    this.back();
  } else if (text === 'break') {
    this.break();
  } else if (text === 'clean') {
    this.clear();
  } else if (text === 'romanTitle') {
    this.romanTitle(plus);
  } else if (text === 'title') {
    this.title(plus);
  } else if (text === 'warn') {
    this.warn(plus);
  } else if (text === 'error') {
    this.error(plus);
  } else if ( typeof plus === 'function' ) {
    this.ask(text, plus);
  } else if (text === 'success') {
    this.success(plus);
  } else {
    this.message(text);
  }
  return this;
};

/**
 * Return a string who contains a question
 */
Cmd.prototype.getQuestion = function (text, defaultValue) {
  return text + ' ' + Cmd.getExample(defaultValue);
};

/**
 * Return a string who contains the exemple
 */
Cmd.getExample = function(data) {
  data = _.isBoolean(data) && data === true && '[Y|n]' ||
      _.isBoolean(data) && data === false && '[y|N]' || 
      '(' + data + ')';

  return chalk.grey(data);
};

module.exports = Cmd;
