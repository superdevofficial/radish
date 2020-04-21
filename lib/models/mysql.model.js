"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const base_model_1 = require("./base.model");
const dialog_panel_1 = require("../utils/dialog-panel");
const promise_mysql_1 = __importDefault(require("promise-mysql"));
class MysqlModel extends base_model_1.BaseModel {
    constructor(_options) {
        super(_options);
        this.name = 'mysql';
        this.questions = new dialog_panel_1.DialogPanel({
            cmd: this.cmd,
            questions: [
                { text: '', type: 'break' },
                { text: this.TEXTS.IMPORT_MYSQL, type: 'title' },
                { question: this.TEXTS.MYSQL.BDD_HOST, default: 'localhost', index: 'host' },
                { question: this.TEXTS.MYSQL.BDD_PORT, default: 30306, index: 'port' },
                { question: this.TEXTS.MYSQL.DATABASE, default: 'site', index: 'database' },
                { question: this.TEXTS.MYSQL.BDD_USER, default: 'root', index: 'user' },
                { question: this.TEXTS.MYSQL.BDD_PASSWORD, default: 'root', index: 'password' },
                { text: this.TEXTS.SUCCESS.CONNECTION_SUCCESS, condition: this.checkMysqlConnection.bind(this), type: 'success' },
                { question: this.TEXTS.MYSQL.MYSQL_FILE_PATH, default: './init.sql', index: 'filePath' },
                { text: this.TEXTS.SUCCESS.FILE_OK, condition: this.checkFileRead.bind(this), type: 'success' },
                { question: this.TEXTS.MYSQL.RUN_SEARCH_AND_REPLACE, default: false, index: 'replace' },
                { question: this.TEXTS.MYSQL.SEARCH_STR, index: 'searchStr', condition: 'this.res.replace == true', required: true },
                { question: this.TEXTS.MYSQL.REPLACE_STR, index: 'replaceStr', default: 'localhost:8080', condition: 'this.res.replace == true' }
            ]
        });
    }
    init() {
        this.questions.start().then(this.mysqlRunImport.bind(this));
    }
    async mysqlRunImport(res) {
        try {
            this.cmd.log('start mysql import');
            res.multipleStatements = true;
            let connection = await promise_mysql_1.default.createConnection(res);
            let content = await fs.promises.readFile(res.filePath, { encoding: 'utf8' });
            if (res.replace)
                content = content.replace(new RegExp(res.searchStr, 'gi'), res.replaceStr);
            if (await this.hasTable(connection, res.database))
                await this.dropAllTables(connection, res.database);
            await this.runMysqlFile(connection, content);
            await connection.end();
            this.cmd.success('Import success');
        }
        catch (e) {
            this.cmd.error('Import fail');
            this.cmd.error(e);
        }
        this.shutdown();
    }
    async runMysqlFile(connection, content) {
        content = content.replace(/^\/\*[\s\S]*?\*\/;?|(^|\s)\/\/.*$/gm, '');
        content = content.replace(/^--.*$/gm, '');
        await connection.query(content);
    }
    async dropAllTables(connection, database) {
        return await connection.query(`
      SET FOREIGN_KEY_CHECKS = 0; 
      SET @tables = NULL;
      SELECT GROUP_CONCAT('\`', table_schema, '\`.\`', table_name, '\`') INTO @tables
        FROM information_schema.tables 
        WHERE table_schema = '${database}';
      
      SET @tables = CONCAT('DROP TABLE ', @tables);
      PREPARE stmt FROM @tables;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
      SET FOREIGN_KEY_CHECKS = 1;`);
    }
    async hasTable(connection, database) {
        let result = await connection.query(`SELECT COUNT(*) as val
      FROM information_schema.tables 
      WHERE table_schema = '${database}'`);
        return result[0].val > 0;
    }
    ;
    async checkMysqlConnection(qst, question) {
        try {
            await promise_mysql_1.default.createConnection(question.res);
            return true;
        }
        catch (e) {
            console.warn(e);
            return 1;
        }
    }
    async checkFileRead(qst, question) {
        try {
            await fs.promises.access(question.res.filePath, fs.constants.R_OK);
            return true;
        }
        catch (e) {
            return 'repeat';
        }
    }
}
exports.MysqlModel = MysqlModel;
//# sourceMappingURL=mysql.model.js.map