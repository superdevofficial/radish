function Question(options = {}) {
  this.isValid = false;

  if (options && options.questions && Array.isArray(options.questions) && options.cmd) {
    this.questions = options.questions;
    if (this.validateQuestion()) {
      this.cmd = options.cmd;
      this.count = 0;
      this.max = this.questions.length;
      this.callback = options.callback || (() => console.log('Done.'));
      this.isValid = true; 
      this.res = {};
    }
  }
}

Question.prototype.start = function () {
  if (this.isValid === true) {
    this.res = {};
    this.count = 0;
    this.askQuestion();
  }
};

Question.prototype.next = function () {
  this.count++;
  if (this.count < this.max) {
    this.askQuestion();
  } else {
    this.end();
  }
};

Question.prototype.askQuestion = function () {
  let qst = this.questions[this.count];

  if (qst.condition && eval(qst.condition) == false) {
    if (qst.index) {
      this.res[qst.index] = qst.default;
    }

    this.next();
  } else {
    if (qst && qst.question && qst.index) {
      this.cmd.ask(this.cmd.question(qst.question, qst.default), answer => {
        anwser = typeof anwser === 'string' ? anwser.trim() : qst.default;

        if (typeof qst.default === 'boolean') {
          answer = answer.includes('true') || answer == '1' ? true : false;
          answer = anwser === '' ? qst.default : answer;
        } else if (typeof qst.default === 'string') {
          anwser = anwser.trim() !== '' ? anwser.trim() : qst.default;
        } else if (typeof qst.default === 'number') {
          anwser = typeof parseInt(answer, 10) === 'number' ? parseInt(anwser, 10) : qst.default;
        }

        this.res[qst.index] = answer;
        this.next();
      });
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

      this.next();
    }
  }
};

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
  this.callback(this.res);
};

module.exports = Question;