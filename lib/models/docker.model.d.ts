import { BaseModel } from './base.model';
export declare class DockerModel extends BaseModel {
    isValid: boolean;
    name: string;
    constructor(_options: any);
    init(...args: any[]): Promise<void>;
    up(_path: string): Promise<void>;
    build(): Promise<void>;
    writeDefaultFiles(): Promise<void>;
}
