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
class DialogPanel {
    constructor(options = {}) {
        this.isValid = false;
        if (options && options.questions && Array.isArray(options.questions) && options.cmd) {
            this.questions = options.questions;
            if (this.validateQuestion()) {
                this.cmd = options.cmd;
                this.count = 0;
                this.max = this.questions.length;
                this.callback = options.callback || null;
                this.isValid = true;
                this.res = {};
            }
        }
        else {
            throw new Error('Questions is needed');
        }
    }
    async start() {
        if (this.isValid === true) {
            this.res = {};
            this.count = 0;
            try {
                await this.askQuestion();
                return this.end();
            }
            catch (e) {
                console.error('Something wrong');
                console.error(e);
                process.exit(1);
            }
        }
    }
    async next(questionIndex) {
        this.count = _.isNumber(questionIndex) ? questionIndex : this.count + 1;
        if (this.count < this.max) {
            return await this.askQuestion();
        }
    }
    async evaluateCondition(qst) {
        if (!qst.condition)
            return;
        let conditionResult = _.isString(qst.condition) ? eval(qst.condition) : await qst.condition(qst, this);
        if (qst.index) {
            this.res[qst.index] = qst.default;
        }
        if (_.isBoolean(conditionResult) && !conditionResult)
            return this.next();
        else if (_.isNumber(conditionResult))
            return this.next(conditionResult);
        else if (conditionResult === 'break')
            return this.end();
        else if (conditionResult === 'repeat')
            return this.next(this.count - 1);
        return 'continue';
    }
    async askQuestion() {
        let qst = this.questions[this.count], conditionResult = '';
        if (qst.condition) {
            conditionResult = await this.evaluateCondition(qst);
        }
        if (!qst.condition || conditionResult === 'continue') {
            if (qst && qst.question && qst.index) {
                let answer = qst.values && _.isArray(qst.values) && await this.askWithChoices(qst) || await this.ask(qst);
                answer = answer.trim();
                answer = answer || qst.default || '';
                if (answer.length == 0 && qst.required) {
                    return await this.askQuestion();
                }
                if (_.isBoolean(qst.default)) {
                    answer = this.toBoolean(answer);
                    answer = answer === '' ? qst.default : answer;
                }
                else if (_.isNumber(qst.default)) {
                    answer = typeof parseInt(answer, 10) === 'number' ? parseInt(answer, 10) : qst.default;
                }
                this.res[qst.index] = answer;
                return this.next();
            }
            else if (qst && qst.text && qst.type) {
                switch (qst.type) {
                    case 'break':
                        this.cmd.break();
                        break;
                    case 'romanTitle':
                        this.cmd.romanTitle(qst.text);
                        break;
                    case 'title':
                        this.cmd.title(qst.text);
                        break;
                    default:
                        this.cmd.log(qst.text);
                        break;
                }
                return this.next();
            }
        }
        else {
            return conditionResult;
        }
    }
    async ask(qst) {
        return new Promise((resolve) => this.cmd.ask(this.cmd.getQuestion(qst.question, qst.default), resolve));
    }
    async askWithChoices(qst) {
        return new Promise((resolve) => this.cmd.askWithChoices(qst.question, qst.values, (response) => resolve(response)));
    }
    end() {
        if (_.isFunction(this.callback))
            this.callback(this.res);
        return this.res;
    }
    validateQuestion() {
        let verdict = false, newArray = [];
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i] && this.questions[i].question && this.questions[i].index) {
                newArray.push(this.questions[i]);
                verdict = true;
            }
            else if (this.questions[i] && this.questions[i].text && this.questions[i].type) {
                newArray.push(this.questions[i]);
                verdict = true;
            }
        }
        if (verdict === true) {
            this.questions = newArray;
        }
        return verdict;
    }
    toBoolean(str) {
        if (_.isBoolean(str)) {
            return str;
        }
        if (str.includes('true') || str.trim().toLowerCase() === 'y') {
            return true;
        }
        if (str.includes('false') || str.trim().toLowerCase() === 'n') {
            return false;
        }
        if (_.isNumber(parseInt(str))) {
            return parseInt(str) > 0;
        }
        return false;
    }
}
exports.DialogPanel = DialogPanel;
//# sourceMappingURL=dialog-panel.js.map