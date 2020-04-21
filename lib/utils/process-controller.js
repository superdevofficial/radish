"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../../package.json');
const _ = __importStar(require("lodash"));
const chalk_1 = __importDefault(require("chalk"));
const figlet = __importStar(require("figlet"));
const rxjs_1 = require("rxjs");
class ProcessController {
    constructor(options) {
        this.isValid = false;
        if (!options) {
            throw new Error('You need to provided some options enculé !');
        }
        this.keysHandlerSubject = new rxjs_1.Subject();
        this.translator = options.translator;
        this.rl = options.rl ? options.rl : null;
        this.fonts = options.fonts ? options.fonts : null;
        this.colors = options.colors ? options.colors : null;
        this.options = options.options ? options.options : null;
        if (this.rl && this.fonts && this.colors && this.options) {
            this.isValid = true;
            this.events();
        }
    }
    get TEXTS() {
        return this.translator.TEXTS;
    }
    /**
     * Clear console
     */
    clear() {
        console.clear();
        return this;
    }
    ;
    /**
     * Write simple text
     */
    print(text) {
        process.stdout.write(text);
        return this;
    }
    ;
    /**
     * Write presentation of your application
     */
    presentation() {
        this.clear()
            .print(figlet.textSync(pkg.title, this.fonts.main)).back()
            .line()
            .print(chalk_1.default.bold(pkg.description)).back()
            .line();
        return this;
    }
    ;
    /**
     * Write line
     */
    line() {
        this.print(`----------------------------------------`).back();
        return this;
    }
    /**
     * Shutdown the console
     */
    shutdown() {
        if (this.isValid) {
            this.rl.close();
            process.exit();
        }
    }
    ;
    /**
     * Print the back character
     */
    back() {
        this.print(`\n`);
        return this;
    }
    ;
    /**
     * Print the back character
     */
    break() {
        this.print(`\r`);
        return this;
    }
    ;
    /**
     * Print an error message
     */
    error(text) {
        this.print(chalk_1.default.bold(chalk_1.default.hex(this.colors.red)('(ఠ_ఠ) ') + (`➜  ` + text || ''))).back();
        return this;
    }
    ;
    /**
     * Print a warn message
     */
    warn(text) {
        this.print(chalk_1.default.bold(chalk_1.default.hex(this.colors.yellow)('(u_u) ') + (text || ''))).back();
        return this;
    }
    ;
    /**
     * Ask a question
     */
    ask(text, callback) {
        let startLine = chalk_1.default.hex(this.colors.green)('(°o°) ');
        this.rl.question(chalk_1.default.bold(startLine + text) + ' ', (answer) => callback.bind(this)(answer));
        return this;
    }
    ;
    /**
     * Ask a question with choices
     */
    askWithChoices(text, choices, callback) {
        let index = 0;
        this.question(_.isString(text) && text || '', choices[index]);
        this.select(choices, index, choices[index]);
        let subscriber = this.keysHandlerSubject.subscribe({
            next: key => {
                if (key.name === 'right' && index != choices.length - 1)
                    index++;
                if (key.name === 'left' && index != 0)
                    index--;
                if (key.name !== 'return') {
                    this.select(choices, index, choices[0]);
                }
                else {
                    if (_.isFunction(callback)) {
                        callback(choices[index]);
                    }
                    subscriber.unsubscribe();
                }
            }
        });
    }
    ;
    /**
     * Just print question text
     */
    question(text, defaultValue) {
        let startLine = chalk_1.default.hex(this.colors.green)('(°o°) ');
        this.print(chalk_1.default.bold(startLine + this.getQuestion(text, defaultValue)) + ' ').back();
        return this;
    }
    ;
    /**
     * Print a success message
     */
    success(text) {
        this.print(chalk_1.default.hex(this.colors.blue)(chalk_1.default.bold('(^ပ^) ' + text))).back();
        return this;
    }
    ;
    /**
     * Print simple title
     */
    title(text) {
        this.print(chalk_1.default.hex(this.colors.green)(chalk_1.default.bold('( ' + this.options.titleCount + ' ) ' + text || '')));
        this.options.titleCount++;
        this.back();
        return this;
    }
    ;
    /**
     * Print roman title
     */
    romanTitle(text) {
        let startLine = chalk_1.default.hex(this.colors.yellow)('[ ' + this.options.romanTitleCount.toRoman() + ' ] ');
        this.print(chalk_1.default.hex(this.colors.yellow)(chalk_1.default.bold(startLine + text || '')));
        this.options.romanTitleCount++;
        this.options.titleCount = 1;
        this.back();
        return this;
    }
    ;
    /**
     * Print simple message
     */
    message(text) {
        let startLine = chalk_1.default.hex(this.colors.green)('(^-^) ');
        this.print(chalk_1.default.bold(startLine + text)).back();
        return this;
    }
    ;
    /**
     * Print select input
     */
    select(choices, choosed, defaultChoice) {
        choosed = _.isNumber(choosed) && choosed || 0;
        defaultChoice = _.isString(defaultChoice) && defaultChoice || '';
        if (_.isArray(choices) && choices.length !== 0) {
            let textChoices = chalk_1.default.hex(this.colors.green)('  ↳  '), startLine = chalk_1.default.hex(this.colors.green)('(°o°) ');
            choices.forEach((value, index) => {
                textChoices += choosed === index ? chalk_1.default.hex(this.colors.yellow)(`▣  ${value} `) : `▢  ${value} `;
            });
            this.break().print(textChoices);
        }
    }
    ;
    /**
     * Generic methods for print something
     */
    log(text, plus) {
        if (!this.isValid) {
            throw new Error('The Process Controller is not valid !');
        }
        if (text === 'presentation') {
            this.presentation();
        }
        else if (text === 'line') {
            this.line();
        }
        else if (text === 'back') {
            this.back();
        }
        else if (text === 'break') {
            this.break();
        }
        else if (text === 'clean') {
            this.clear();
        }
        else if (text === 'romanTitle') {
            this.romanTitle(plus);
        }
        else if (text === 'title') {
            this.title(plus);
        }
        else if (text === 'warn') {
            this.warn(plus);
        }
        else if (text === 'error') {
            this.error(plus);
        }
        else if (typeof plus === 'function') {
            this.ask(text, plus);
        }
        else if (text === 'success') {
            this.success(plus);
        }
        else {
            this.message(text);
        }
        return this;
    }
    ;
    /**
     * Return a string who contains a question
     */
    getQuestion(text, defaultValue) {
        return text + ' ' + this.getExample(defaultValue);
    }
    ;
    /**
     * Return a string who contains the exemple
     */
    getExample(data) {
        data = _.isBoolean(data) && data === true && '[Y|n]' ||
            _.isBoolean(data) && data === false && '[y|N]' ||
            '(' + data + ')';
        return chalk_1.default.grey(data);
    }
    ;
    /**
     * Set up event handler
     */
    events() {
        process.stdin.on('keypress', (str, key) => this.keysHandlerSubject.next(key));
    }
}
exports.ProcessController = ProcessController;
//# sourceMappingURL=process-controller.js.map