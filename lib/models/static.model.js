
const _ = require('lodash');
const Tool = require('./tool.model');
const shell = require('shelljs');
const { Question, TEXTS } = require('../utils');

TEXTS.STATIC = {
  TITLE: 'Configuration projet static',
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
  MAIN_PATH: 'Configuration chemins principaux',
  SASS_PATH: 'Configuration SASS',
  SASS_FILE: 'Nom du fichier d\'entrée pour le SASS',
  JS_PATH: 'Configuration JS',
  JS_FILE: 'Nom du fichier d\'entrée pour le JavaScript',
};

const staticQuestions = [
  { question: TEXTS.STATIC.MORE, default: true, index: 'useDefault' },
  { text: TEXTS.STATIC.MAIN_PATH, type: 'title', condition: 'this.res.useDefault == false' },
  { question: TEXTS.STATIC.INPUT, default: './src', index: 'input', condition: 'this.res.useDefault == false' },
  { question: TEXTS.STATIC.OUTPUT, default: './public', index: 'output', condition: 'this.res.useDefault == false' },
  { text: TEXTS.STATIC.SASS_PATH, type: 'title', condition: 'this.res.useDefault == false' },
  { question: TEXTS.STATIC.SASS_FILE, default: 'main', index: 'scssFile', condition: 'this.res.useDefault == false' },
  { text: TEXTS.STATIC.JS_PATH, type: 'title', condition: 'this.res.useDefault == false' },
  { question: TEXTS.STATIC.JS_FILE, default: 'main', index: 'jsFile', condition: 'this.res.useDefault == false' },
];

function StaticTool(_options) {
  Tool.call(this, _options);
  this.name = 'static';
  this.questions = new Question({ 
    cmd: this.cmd, 
    questions: _.concat([
        { text: '', type: 'break' },
        { text: TEXTS.STATIC.TITLE, type: 'romanTitle' },
        { text: TEXTS.APP_TITLE, type: 'title' },
        { question: TEXTS.STATIC.APP_NAME, default: 'radish', index: 'name' },
        { question: TEXTS.STATIC.DESCRIPTION, default: '...', index: 'description' }
      ], staticQuestions)
  });
}

StaticTool.prototype = Object.create(Tool.prototype);

StaticTool.prototype.init = async function (...args) {
  if (this.isValid) {
    try {
      this.options = _.merge(this.options, await this.questions.start());
      this.options.publicPath = '../';
      this.cmd.break();
      this.cmd.romanTitle(TEXTS.BUILD);
      await this.writeDefaultFiles();
      await this.writeStaticFiles();
      this.cmd.success(TEXTS.SUCCESS.FILES);
      this.cmd.break();
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
    } catch (e) {
      console.error(e);
      this.shutdown();
    }
  }

  this.shutdown();
};

StaticTool.prototype.writeStaticFiles = async function() {
  let htmlTmp = this.builder.readTemplate('/static/index.html.twig');
  htmlTmp = this.builder.populate(htmlTmp, this.options);

  let htmlFile = this.path([this.options.output, 'index.html']);
  await this.builder.writeFile(htmlFile, htmlTmp);
  this.cmd.message(`Fichier créé → ${htmlFile}`).break();
};

StaticTool.prototype.writeDefaultFiles = async function() {
  let webpackTmp = this.builder.readTemplate('/webpack.twig');
  let packageTmp = this.builder.readTemplate('/package.twig');
  let scssTmp = this.builder.readTemplate('/main.scss.twig');
  let jsTmp = this.builder.readTemplate('/main.js.twig');

  webpackTmp = this.builder.populate(webpackTmp, this.options);
  packageTmp = this.builder.populate(packageTmp, this.options);
  scssTmp = this.builder.populate(scssTmp, this.options);
  jsTmp = this.builder.populate(jsTmp, this.options);

  console.log(this.options.input);

  await this.builder.writeFolder(this.options.input + '/js');
  await this.builder.writeFolder(this.options.input + '/scss');
  await this.builder.writeFolder(this.options.input + '/img');
  await this.builder.writeFolder(this.options.input + '/content');
  await this.builder.writeFolder(this.options.output);

  await this.builder.writeFile('webpack.config.js', webpackTmp);
  this.cmd.message('Fichier créé → ./webpack.config.js').break();

  await this.builder.writeFile('package.json', packageTmp);
  this.cmd.message('Fichier créé → ./package.json').break();

  let jsFile = this.path([this.options.input, '/js', this.options.jsFile, '.js']);
  await this.builder.writeFile(jsFile, jsTmp);
  this.cmd.message(`Fichier créé → ${jsFile}`).break();

  let scssFile = this.path([this.options.input, '/scss', this.options.scssFile, '.scss']);
  await this.builder.writeFile(scssFile, scssTmp);
  this.cmd.message(`Fichier créé → ${scssFile}`).break();
};

module.exports = {
  StaticTool,
  staticQuestions
};
