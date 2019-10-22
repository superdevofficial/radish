const _ = require('lodash');

function Question(options = {}) {
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
}

Question.prototype.start = async function () {
  if (this.isValid === true) {
    this.res = {};
    this.count = 0;
    try {
      await this.askQuestion();
      return this.end();
    }catch(e){
      console.error('Something wrong');
      console.error(e);
      process.exit(1);
    }
  }
};

Question.prototype.next = async function (questionIndex) {
  this.count = _.isNumber(questionIndex) ? questionIndex : this.count + 1;
  if (this.count < this.max) {
    return await this.askQuestion();
  }
};

Question.prototype.evaluateCondition = async function(qst) {
  let conditionResult = _.isString(qst.condition) ? eval(qst.condition) : await qst.condition(qst,this);

  if (qst.index) {
    this.res[qst.index] = qst.default;
  }

  if(_.isBoolean(conditionResult) && !conditionResult)
    return this.next();
  else if(_.isNumber(conditionResult))
    return this.next(conditionResult);
  else if(conditionResult === 'break')
    return this.end();
  else if(conditionResult === 'repeat')
    return this.next(this.count - 1);
  return 'continue';
}

Question.prototype.askQuestion = async function () {
  let qst = this.questions[this.count];

  let conditionResult = '';
  if (qst.condition) {
    conditionResult = await this.evaluateCondition(qst);    
  }
  if(!qst.condition || conditionResult === 'continue')
  {
    if (qst && qst.question && qst.index) {
      let answer = qst.values && _.isArray(qst.values) && await this.askWithChoices(qst) || await this.ask(qst);
      answer = answer.trim();
      answer = answer || qst.default || '';

      if(answer.length == 0 && qst.required)
      {
        return await this.askQuestion();
      }

      if (_.isBoolean(qst.default)) {
        answer = _.isBoolean(answer) && answer || answer.includes('true') || answer == '1' ? true : false;
        answer = answer === '' ? qst.default : answer;
      } else if (_.isNumber(qst.default)) {
        answer = typeof parseInt(answer, 10) === 'number' ? parseInt(answer, 10) : qst.default;
      }

      this.res[qst.index] = answer;
      return this.next();
    } else if (qst && qst.text && qst.type) {

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
  }else{
    return conditionResult;
  }
};

Question.prototype.ask = async function(qst) {
  return new Promise((resolve) => {
    this.cmd.ask(this.cmd.getQuestion(qst.question, qst.default),resolve);
  });
}

Question.prototype.askWithChoices = async function(qst) {
  return new Promise((resolve) => {
    this.cmd.askWithChoices(qst.question, qst.values, (response) => resolve(response));
  })
}

Question.prototype.validateQuestion = function () {
  let verdict = false, newArray = [];

  for (let i=0 ; i<this.questions.length ; i++) {
    if (this.questions[i] && this.questions[i].question && this.questions[i].index) {
      newArray.push(this.questions[i]);
      verdict = true;
    } else if (this.questions[i] && this.questions[i].text && this.questions[i].type) {
      newArray.push(this.questions[i]);
      verdict = true;
    }
  }

  if (verdict === true) {
    this.questions = newArray;
  }

  return verdict;
};

Question.prototype.end = function () {
  if(_.isFunction(this.callback))
    this.callback(this.res);
  return this.res;
};

module.exports = Question;