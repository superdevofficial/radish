export declare type Question = {
    question?: string;
    index?: string;
    text?: string;
    type?: string;
    condition?: string | ((qst: Question, dialog: DialogPanel) => boolean);
    default?: any;
    values?: any;
    required?: boolean;
};
export interface IDialogPanel {
    start(): Promise<any>;
    next(questionIndex?: number): Promise<any>;
    evaluateCondition(qst: Question): Promise<any>;
    askQuestion(): Promise<any>;
    ask(qst: Question): Promise<any>;
    askWithChoices(qst: Question): void;
    end(): any;
}
export declare class DialogPanel implements IDialogPanel {
    protected isValid: boolean;
    protected questions: Question[];
    protected cmd: any;
    protected count: any;
    protected max: any;
    protected callback: any;
    protected res: any;
    constructor(options?: any);
    start(): Promise<any>;
    next(questionIndex?: number): Promise<any>;
    evaluateCondition(qst: Question): Promise<any>;
    askQuestion(): Promise<any>;
    ask(qst: Question): Promise<any>;
    askWithChoices(qst: Question): Promise<unknown>;
    end(): any;
    protected validateQuestion(): boolean;
    protected toBoolean(str: string): boolean;
}
