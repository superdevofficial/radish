export interface IBaseModel {
    isValid: boolean;
    name: string;
    questions: any;
    cmd: any;
    builder: any;
    options: any;
    init(): void;
    shutdown(): void;
    path(shards: any[]): string;
}
export declare abstract class BaseModel implements IBaseModel {
    abstract name: string;
    isValid: boolean;
    questions: any;
    cmd: any;
    builder: any;
    options: any;
    get TEXTS(): any;
    constructor(_options: any);
    abstract init(): void;
    shutdown(): void;
    path(shards: any[]): string;
}
