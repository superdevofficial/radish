import { BaseModel } from './base.model';
import { Question } from '../utils/dialog-panel';
export declare class MysqlModel extends BaseModel {
    name: string;
    constructor(_options: any);
    init(): void;
    mysqlRunImport(res: any): Promise<void>;
    runMysqlFile(connection: any, content: string): Promise<void>;
    dropAllTables(connection: any, database: string): Promise<any>;
    hasTable(connection: any, database: string): Promise<boolean>;
    checkMysqlConnection(qst: Question, question: any): Promise<boolean | number>;
    checkFileRead(qst: Question, question: any): Promise<boolean | string>;
}
