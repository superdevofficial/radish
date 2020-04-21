/// <reference types="node" />
export interface IFileBuilder {
    readTemplate(_path: string): string;
    readFile(_path: string): Buffer;
    writeFile(_path: string, data: any): Promise<void>;
    populate(template: string, data: any): string;
    writedFilePath(fileName: string): string;
    writeFolder(_path: string): Promise<void>;
}
export declare class FileBuilder implements IFileBuilder {
    protected templatesPath: string;
    constructor(options: any);
    readTemplate(_path: string): string;
    readFile(_path: string): Buffer;
    writeFile(_path: string, data: any): Promise<void>;
    populate(template: string, data: any): string;
    writedFilePath(fileName: string): string;
    writeFolder(_path: string): Promise<void>;
}
