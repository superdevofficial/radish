import { BaseModel } from './base.model';
export declare class StaticModel extends BaseModel {
    name: string;
    constructor(_options: any);
    init(...args: any[]): Promise<void>;
    writeStaticFiles(): Promise<void>;
    writeDefaultFiles(): Promise<void>;
}
