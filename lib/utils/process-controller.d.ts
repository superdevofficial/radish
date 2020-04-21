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
export declare class ProcessController implements IProcessController {
    protected isValid: boolean;
    protected rl: any;
    protected fonts: any;
    protected colors: any;
    protected options: any;
    protected keysHandlerSubject: Subject<any>;
    protected translator: ITranslator;
    get TEXTS(): any;
    constructor(options: any);
    /**
     * Clear console
     */
    clear(): ProcessController;
    /**
     * Write simple text
     */
    print(text: string): ProcessController;
    /**
     * Write presentation of your application
     */
    presentation(): ProcessController;
    /**
     * Write line
     */
    line(): ProcessController;
    /**
     * Shutdown the console
     */
    shutdown(): void;
    /**
     * Print the back character
     */
    back(): ProcessController;
    /**
     * Print the back character
     */
    break(): ProcessController;
    /**
     * Print an error message
     */
    error(text: string): ProcessController;
    /**
     * Print a warn message
     */
    warn(text: string): ProcessController;
    /**
     * Ask a question
     */
    ask(text: string, callback: any): ProcessController;
    /**
     * Ask a question with choices
     */
    askWithChoices(text: string, choices: any[], callback: any): void;
    /**
     * Just print question text
     */
    question(text: string, defaultValue: any): ProcessController;
    /**
     * Print a success message
     */
    success(text: string): ProcessController;
    /**
     * Print simple title
     */
    title(text: string): ProcessController;
    /**
     * Print roman title
     */
    romanTitle(text: string): ProcessController;
    /**
     * Print simple message
     */
    message(text: string): ProcessController;
    /**
     * Print select input
     */
    select(choices: any[], choosed: any, defaultChoice: any): void;
    /**
     * Generic methods for print something
     */
    log(text: string, plus?: any): ProcessController;
    /**
     * Return a string who contains a question
     */
    getQuestion(text: string, defaultValue: string): string;
    /**
     * Return a string who contains the exemple
     */
    protected getExample(data: any): string;
    /**
     * Set up event handler
     */
    protected events(): void;
}
