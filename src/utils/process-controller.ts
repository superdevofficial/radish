
const pkg = require('../../package.json');
import * as _ from 'lodash';
import chalk from 'chalk';
import * as figlet from 'figlet';
import { Subject } from 'rxjs';
import { ITranslator } from '../assets/texts';


export interface IProcessController {
  clear(): ProcessController;
  print(text: string): ProcessController;
  presentation(): ProcessController;
  line(): ProcessController;
  shutdown(): void;
  back(): ProcessController;
  break(): ProcessController;
  error(text: string): ProcessController;
  warn(text: string): ProcessController;
  ask(text: string, callback: any): ProcessController;
  askWithChoices(text: string, choices: any[], callback: any): void;
  question(text: string, defaultValue: any): ProcessController;
  success(text: string): ProcessController;
  title(text: string): ProcessController;
  romanTitle(text: string): ProcessController;
  message(text: string): ProcessController;
  select(choices: any[], choosed: any, defaultChoice: any): void;
  log(text: string, plus: any): ProcessController;
  getQuestion(text: string, defaultValue: string): string;
}


export class ProcessController implements IProcessController {

  protected isValid: boolean = false;
  protected rl: any;
  protected fonts: any;
  protected colors: any;
  protected options: any;
  protected keysHandlerSubject: Subject<any>;
  protected translator: ITranslator;

  get TEXTS() {
    return this.translator.TEXTS;
  }

  constructor (options: any) {
    if (!options) {
      throw new Error('You need to provided some options enculé !');
    }

    this.keysHandlerSubject = new Subject<any>();
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

  /**
   * Clear console
   */
  clear(): ProcessController {
    console.clear();
    return this;
  };

  /**
   * Write simple text
   */
  print(text: string): ProcessController {
    process.stdout.write(text);
    return this;
  };

  /**
   * Write presentation of your application
   */
  presentation(): ProcessController {
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
  line(): ProcessController {
    this.print(`----------------------------------------`).back();
    return this;
  }

  /**
   * Shutdown the console
   */
  shutdown(): void {
    if (this.isValid){
      this.rl.close();
      process.exit();
    }
  };

  /**
   * Print the back character
   */
  back(): ProcessController {
    this.print(`\n`);
    return this;
  };

  /**
   * Print the back character
   */
  break(): ProcessController {
    this.print(`\r`);
    return this;
  };

  /**
   * Print an error message
   */
  error(text: string): ProcessController {
    this.print(chalk.bold(chalk.hex(this.colors.red)('(ఠ_ఠ) ') + (`➜  `+ text || ''))).back();
    return this;
  };

  /**
   * Print a warn message
   */
  warn(text: string): ProcessController {
    this.print(chalk.bold(chalk.hex(this.colors.yellow)('(u_u) ') + (text || ''))).back();
    return this;
  };

  /**
   * Ask a question
   */
  ask(text: string, callback: any): ProcessController {
    let startLine = chalk.hex(this.colors.green)('(°o°) ');
    this.rl.question(chalk.bold(startLine + text) + ' ', (answer: string) => callback.bind(this)(answer));
    return this;
  };

  /**
   * Ask a question with choices
   */
  askWithChoices(text: string, choices: any[], callback: any): void {
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
  question(text: string, defaultValue: any): ProcessController {
    let startLine = chalk.hex(this.colors.green)('(°o°) ');
    this.print(chalk.bold(startLine + this.getQuestion(text, defaultValue)) + ' ').back();
    return this;
  };

  /**
   * Print a success message
   */
  success(text: string): ProcessController {
    this.print(chalk.hex(this.colors.blue)(chalk.bold('(^ပ^) ' + text))).back();
    return this;
  };

  /**
   * Print simple title
   */
  title(text: string): ProcessController {
    this.print(chalk.hex(this.colors.green)(chalk.bold('( ' + this.options.titleCount + ' ) ' + text || '')));
    this.options.titleCount++;
    this.back();
    return this;
  };

  /**
   * Print roman title
   */
  romanTitle(text: string): ProcessController {
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
  message(text: string): ProcessController {
    let startLine = chalk.hex(this.colors.green)('(^-^) ');
    this.print(chalk.bold(startLine + text)).back();
    return this;
  };

  /**
   * Print select input
   */
  select(choices: any[], choosed: any, defaultChoice: any): void {
    choosed = _.isNumber(choosed) && choosed || 0;
    defaultChoice = _.isString(defaultChoice) && defaultChoice || '';

    if (_.isArray(choices) && choices.length !== 0) {
      let textChoices = chalk.hex(this.colors.green)('  ↳  '), 
      startLine = chalk.hex(this.colors.green)('(°o°) ');

      choices.forEach((value: any, index: number) => {
        textChoices += choosed === index ? chalk.hex(this.colors.yellow)(`▣  ${value} `) : `▢  ${value} `;
      });

      this.break().print(textChoices);
    }
  };

  /**
   * Generic methods for print something
   */
  log(text: string, plus?: any): ProcessController{
    if (!this.isValid) {
      throw new Error('The Process Controller is not valid !');
    }

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
  getQuestion(text: string, defaultValue: string): string {
    return text + ' ' + this.getExample(defaultValue);
  };

  /**
   * Return a string who contains the exemple
   */
  protected getExample(data: any): string {
    data = _.isBoolean(data) && data === true && '[Y|n]' ||
        _.isBoolean(data) && data === false && '[y|N]' || 
        '(' + data + ')';

    return chalk.grey(data);
  };

  /**
   * Set up event handler
   */
  protected events(): void {
    process.stdin.on('keypress', (str: string, key: number) => this.keysHandlerSubject.next(key));
  }

}
