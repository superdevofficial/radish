
const _ = require('lodash'),
  Tool = require('./tool.model'),
  { Question, TEXTS } = require('../utils'),
  mysql = require('promise-mysql');

const MYSQL_TEXTS = {
  BDD_HOST: 'Adresse du serveur BDD',
  BDD_PORT: 'Numéro de port',
  DATABASE: 'Nom de la base de données',
  BDD_USER: 'Utilisateur',
  BDD_PASSWORD: 'Mot de passe',
  MYSQL_FILE_PATH: 'Chemin du fichier à importer',
  RUN_SEARCH_AND_REPLACE: 'Exécuter un rechercher/remplacer avant l\'import ?',
  SEARCH_STR: 'Chaine recherchée',
  REPLACE_STR: 'Nouvelle valeur',
};

function MysqlTool(_options) {
  Tool.call(this, _options);
  this.name = 'mysql';
  this.questions = new Question({ cmd: this.cmd, questions: [
      { text: '', type: 'break' },
      { text: TEXTS.IMPORT_MYSQL, type: 'title' },
      { question: MYSQL_TEXTS.BDD_HOST, default: 'localhost', index: 'host' },
      { question: MYSQL_TEXTS.BDD_PORT, default: 30306, index: 'port' },
      { question: MYSQL_TEXTS.DATABASE, default: 'site', index: 'database' },
      { question: MYSQL_TEXTS.BDD_USER, default: 'root', index: 'user' },
      { question: MYSQL_TEXTS.BDD_PASSWORD, default: 'root', index: 'password' },
      { text: TEXTS.SUCCESS.CONNECTION_SUCCESS, condition: checkMysqlConnection, type: 'success' },
      { question: MYSQL_TEXTS.MYSQL_FILE_PATH, default: './init.sql', index: 'filePath' },
      { text: TEXTS.SUCCESS.FILE_OK, condition: checkFileRead, type: 'success' },
      { question: MYSQL_TEXTS.RUN_SEARCH_AND_REPLACE, default: false, index: 'replace' },
      { question: MYSQL_TEXTS.SEARCH_STR, index: 'searchStr', condition: 'this.res.replace == true', required: true },
      { question: MYSQL_TEXTS.REPLACE_STR, index: 'replaceStr', default: 'localhost:8080', condition: 'this.res.replace == true' }
    ]});
}

MysqlTool.prototype = Object.create(Tool.prototype);

MysqlTool.prototype.init = function() {
  this.questions.start().then(this.mysqlRunImport.bind(this));
};

MysqlTool.prototype.mysqlRunImport = async function(res) {
  try{
    this.cmd.log('start mysql import');
    res.multipleStatements = true;
    let connection = await mysql.createConnection(res);
    let content = await fs.promises.readFile(res.filePath, {encoding: 'utf8'});
    if(res.replace)
    {
      content = content.replace(new RegExp(res.searchStr,'gi'),res.replaceStr);
    }
    if(await this.hasTable(connection,res.database))
    {
      await this.dropAllTables(connection,res.database);
    }

    await this.runMysqlFile(connection,content);
    await connection.end()
    this.cmd.success('Import success');
  }catch(e){
    this.cmd.error('Import fail');
    this.cmd.error(e);
  }
  this.shutdown();
};

MysqlTool.prototype.runMysqlFile = async function(connection, content)
{
  content = content.replace(/^\/\*[\s\S]*?\*\/;?|(^|\s)\/\/.*$/gm,'');
  content = content.replace(/^--.*$/gm,'');

  await connection.query(content);
};

MysqlTool.prototype.dropAllTables = async function(connection,database) {
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
    SET FOREIGN_KEY_CHECKS = 1;`
  );
};

MysqlTool.prototype.hasTable = async function(connection,database) {
  let result = await connection.query(`SELECT COUNT(*) as val
    FROM information_schema.tables 
    WHERE table_schema = '${database}'`);
  return result[0].val > 0;
};

async function checkMysqlConnection(qst,question)
{
  try {
    await mysql.createConnection(question.res);
    return true;
  }catch(e){
    console.warn(e);
    return 1;
  }
}

async function checkFileRead(qst,question)
{
  try {
    await fs.promises.access(question.res.filePath, fs.constants.R_OK);
    return true;
  }catch(e){
    return 'repeat';
  }
}

module.exports = MysqlTool;
