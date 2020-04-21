import './utils/polyfills';
import Translator from './assets/texts';
import { FileBuilder, ProcessController } from './utils/index';
import { IBaseModel } from './models';
export interface IRadish {
    init(type?: string, args?: any): Promise<void>;
    selectProjectType(): Promise<void>;
    watch(args: any): void;
    shutdown(): void;
}
export declare class Radish implements IRadish {
    protected rl: any;
    protected state: number;
    protected options: any;
    protected reader: FileBuilder;
    protected cmd: ProcessController;
    protected tools: {
        [x: string]: IBaseModel;
    };
    protected get TEXTS(): any;
    protected translator: Translator;
    constructor();
    /**
     * Start radish experience !
     * @options object
     */
    init(type?: string, args?: any): Promise<void>;
    /**
     * Force user to select project Type
     */
    selectProjectType(): Promise<void>;
    /**
     * Watch your application
     */
    watch(args: any): void;
    /**
     * Shutdown the process
     */
    shutdown(): void;
    protected changeLocality(local: any): void;
}
