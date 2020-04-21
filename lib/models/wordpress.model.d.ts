import { BaseModel } from './base.model';
export declare class WpModel extends BaseModel {
    name: string;
    constructor(_options: any);
    init(...args: any[]): Promise<void>;
    writeWpFiles(): Promise<void>;
    writeStaticFiles(): Promise<void>;
    writeDefaultFiles(): Promise<void>;
}
