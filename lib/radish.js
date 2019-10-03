const pkg = require('../package.json'),
  program = require('commander'),
  readline = require('readline'),
  utils = require('./utils/index'),
  _ = require('lodash'),
  process = require('process'),
  shell = require('shelljs'),
  mysql = require('promise-mysql')
  fs = require('fs');

const TEXTS = {
  BUILD: 'Construction',
  CONFIGURATION: 'Configuration',
  APP_TITLE: 'L\'application',
  FOLDER_TITLES: 'Chemin vers les dossiers',
  INSTALL: 'Installation',
  IMPORT_MYSQL: 'Import des données mysql',
  QUESTIONS: {
    MORE: 'Utiliser les paramètres par défaut ?',
    INPUT_FILE: 'Chemin du fichier bootstrap',
    APP_NAME: 'Nom de l\'application/site/licorne',
    DESCRIPTION: 'Description de votre projet',
    OUTPUT: 'Chemin du dossier où générer tous les fichiers minifiés',
    INPUT: 'Chemin du dossier où se trouve les fichiers sources',
    BDD_HOST: 'Adresse du serveur BDD',
    BDD_PORT: 'Numéro de port',
    DATABASE: 'Nom de la base de données',
    BDD_USER: 'Utilisateur',
    BDD_PASSWORD: 'Mot de passe',
    MYSQL_FILE_PATH: 'Chemin du fichier à importer',
    RUN_SEARCH_AND_REPLACE: 'Exécuter un rechercher/remplacer avant l\'import ?',
    SEARCH_STR: 'Chaine recherchée',
    REPLACE_STR: 'Nouvelle valeur',
  },
  ERROR: {
    PREFIX: 'You break something idiot ! ',
    SELECT_SOMETHING: 'You need to select at least a builder AND a model',
    MODEL_EMPTY: 'No model imported !',
    NEED_THIS_QUESTION: 'This question is required !',
    INSTALL: 'Npm is required !',
    CONNECTION_FAILED: 'Echec de connexion à la base mysql'
  },
  SUCCESS: {
    FILES: 'Les fichiers ont bien été créés !',
    INSTALL: 'L\'installation a réussi !',
    CONNECTION_SUCCESS: 'Base de données connectée',
    FILE_OK: 'Fichier valide'
  }
};

const QUESTIONS = [
  { text: '', type: 'break' },
  { text: TEXTS.CONFIGURATION, type: 'romanTitle' },
  { text: TEXTS.APP_TITLE, type: 'title' },
  { question: TEXTS.QUESTIONS.APP_NAME, default: 'radish', index: 'name' },
  { question: TEXTS.QUESTIONS.DESCRIPTION, default: '...', index: 'description' },
  { question: TEXTS.QUESTIONS.MORE, default: true, index: 'useDefault' },
  { text: TEXTS.FOLDER_TITLES, type: 'title', condition: 'this.res.useDefault == false' },
  { question: TEXTS.QUESTIONS.INPUT, default: './src', index: 'input', condition: 'this.res.useDefault == false' },
  { question: TEXTS.QUESTIONS.INPUT_FILE, default: '/js/index.js', index: 'inputFile', condition: 'this.res.useDefault == false' },
  { question: TEXTS.QUESTIONS.OUTPUT, default: './public', index: 'output', condition: 'this.res.useDefault == false' },
];

const QUESTIONS_MYSQL_IMPORT = [
  { text: '', type: 'break' },
  { text: TEXTS.IMPORT_MYSQL, type: 'title' },
  { question: TEXTS.QUESTIONS.BDD_HOST, default: 'localhost', index: 'host' },
  { question: TEXTS.QUESTIONS.BDD_PORT, default: 30306, index: 'port' },
  { question: TEXTS.QUESTIONS.DATABASE, default: 'site', index: 'database' },
  { question: TEXTS.QUESTIONS.BDD_USER, default: 'root', index: 'user' },
  { question: TEXTS.QUESTIONS.BDD_PASSWORD, default: 'root', index: 'password' },
  { text: TEXTS.SUCCESS.CONNECTION_SUCCESS, condition: checkMysqlConnection, type: 'success' },
  { question: TEXTS.QUESTIONS.MYSQL_FILE_PATH, default: './init.sql', index: 'filePath' },
  { text: TEXTS.SUCCESS.FILE_OK, condition: checkFileRead, type: 'success' },
  { question: TEXTS.QUESTIONS.RUN_SEARCH_AND_REPLACE, default: false, index: 'replace' },
  { question: TEXTS.QUESTIONS.SEARCH_STR, index: 'searchStr', condition: 'this.res.replace == true', required: true },
  { question: TEXTS.QUESTIONS.REPLACE_STR, index: 'replaceStr', default: 'localhost:8080', condition: 'this.res.replace == true' }
];

function Radish () {
  this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  this.state = 0;
  this.options = {};
  this.cmd = new utils.Cmd({
    rl: this.rl,
    options: {
      romanTitleCount: 1,
      titleCount: 1
    },
    fonts: {
      main: {
        font: 'Big',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }
    },
    colors: {
      green: '#44b752',
      red: '#ce5454',
      yellow: '#d8ce5f',
      blue: '#42a8bc',
    }
  });

  this.reader = new utils.Reader('/templates');
  this.question = new utils.Question({ cmd: this.cmd, questions: QUESTIONS });

  program.version(pkg.version)
    .description(pkg.description)
    .usage('[options] <cmd>');

  program.command('watch')
    .description('Run webpack in watch mode')
    .action(this.watch.bind(this));
  
  program.command('init <projectType>')
    .description('Init project structure and scripts. ProjectType: static or wordpress')
    .action(this.init.bind(this));
  
  program.command('mysql-import')
    .action(this.mysqlStartImport.bind(this));

  if (process.argv.length < 3) {
    program.help()
  }else{
    program.parse(process.argv);
  }
}

/**
 * Start radish experience !
 * @options object
 */
Radish.prototype.init = async function(line) {
  this.cmd.log('presentation');
  return this.controller(1);
}

/**
 * Check if all is good for start the building
 */
Radish.prototype.controller = async function(state) {
  this.state = typeof state === 'number' ? state : this.state + 1;

  switch (this.state) {
    case 1:
      await this.start();
      break;
    case 2:
      await this.build();
      break;
    case 3:
      await this.install();
      break;
    case 4:
      await this.shutdown();
      break;
    default:
      await this.init();
      break;
  }
};

Radish.prototype.start = async function () {
  await this.question.start().then((response) => {
    this.options = response;
    return this.controller();
  },err => {
    console.error(err);
    process.exit(1);
  });
};

Radish.prototype.build = async function() {
  this.cmd.break();
  this.cmd.romanTitle(TEXTS.BUILD);

  let webpackTmp = this.reader.readTemplate('/webpack.twig');
  let packageTmp = this.reader.readTemplate('/package.twig');
  let bootstrapTmp = this.reader.readTemplate('/bootstrap.twig');

  webpackTmp = this.reader.populate(webpackTmp, this.options);
  packageTmp = this.reader.populate(packageTmp, this.options);

  await this.reader.writeFolder(this.options.input);
  await this.reader.writeFolder(this.options.output);
  await this.reader.writeFile('webpack.config.js', webpackTmp);
  await this.reader.writeFile('package.json', packageTmp);
  await this.reader.writeFile(this.options.input + this.options.inputFile, bootstrapTmp);

  this.cmd.success(TEXTS.SUCCESS.FILES);
  this.cmd.break();
  return this.controller();
};

Radish.prototype.install = function() {
  this.cmd.break();
  this.cmd.romanTitle(TEXTS.INSTALL);

  if (shell.which('npm')) {
    shell.exec('npm i');
    this.cmd.success(TEXTS.SUCCESS.INSTALL);
    this.cmd.break();    
  } else {
    this.cmd.error(TEXTS.ERROR.INSTALL);
    this.cmd.break();
  }

  this.shutdown();
};

Radish.prototype.mysqlStartImport = function() {
  this.cmd.log('presentation');
  var question = new utils.Question({ cmd: this.cmd, questions: QUESTIONS_MYSQL_IMPORT });
  question.start().then(this.mysqlRunImport.bind(this));
}

Radish.prototype.mysqlRunImport = async function(res) {
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
}

Radish.prototype.runMysqlFile = async function(connection, content)
{
  //remove comments
  content = content.replace(/^\/\*[\s\S]*?\*\/;?|(^|\s)\/\/.*$/gm,'');
  content = content.replace(/^--.*$/gm,'');

  await connection.query(content);
}

Radish.prototype.dropAllTables = async function(connection,database) {
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
}

Radish.prototype.hasTable = async function(connection,database) {
  let result = await connection.query(`SELECT COUNT(*) as val
    FROM information_schema.tables 
    WHERE table_schema = '${database}'`);
  return result[0].val > 0;
}

Radish.prototype.watch = function() {
  if (shell.which('npm')) {
    shell.exec('npm run watch', (params) => { });
  } else {
    this.cmd.error(TEXTS.ERROR.INSTALL);
    this.cmd.break();
  }
};

Radish.prototype.shutdown = function() {
  this.cmd.shutdown();
  process.exit();
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

module.exports = Radish;