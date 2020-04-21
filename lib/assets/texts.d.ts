declare type RadishLocality = 'EN' | 'FR';
export interface ITranslator {
    TEXTS: any;
    changeLocality(local: RadishLocality): void;
}
export default class Translator implements ITranslator {
    static current: Translator;
    static initiliaze(local?: RadishLocality): Translator;
    protected local: RadishLocality;
    get TEXTS(): any;
    constructor(local?: RadishLocality);
    changeLocality(local?: RadishLocality): void;
}
export {};
