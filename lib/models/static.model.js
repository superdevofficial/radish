
const _ = require('lodash');
const Tool = require('./tool.model');
const { Question, TEXTS } = require('../utils');
const shell = require('shelljs');

const STATIC_TEXTS = {
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
};

function StaticTool(_options) {
  Tool.call(this, _options);
  this.name = 'static';
  this.questions = new Question({ cmd: this.cmd, questions: [
      { text: '', type: 'break' },
      { text: STATIC_TEXTS.TITLE, type: 'romanTitle' },
      { text: TEXTS.APP_TITLE, type: 'title' },
      { question: STATIC_TEXTS.APP_NAME, default: 'radish', index: 'name' },
      { question: STATIC_TEXTS.DESCRIPTION, default: '...', index: 'description' },
      { question: STATIC_TEXTS.MORE, default: true, index: 'useDefault' },
      { text: TEXTS.FOLDER_TITLES, type: 'title', condition: 'this.res.useDefault == false' },
      { question: STATIC_TEXTS.INPUT, default: './src', index: 'input', condition: 'this.res.useDefault == false' },
      { question: STATIC_TEXTS.INPUT_FILE, default: '/index', index: 'inputFile', condition: 'this.res.useDefault == false' },
      { question: STATIC_TEXTS.OUTPUT, default: './public', index: 'output', condition: 'this.res.useDefault == false' },
    ]});
}

StaticTool.prototype = Object.create(Tool.prototype);

StaticTool.prototype.init = async function (...args) {
  if (this.isValid) {
    try {
      this.options = _.merge(this.options, await this.questions.start());
      this.options.imgPath = '/public/img';
      this.cmd.break();
      this.cmd.romanTitle(TEXTS.BUILD);
      await this.writeDefaultFiles();
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
      console.error(err);
      this.shutdown();
    }
  }

  this.shutdown();
};

StaticTool.prototype.writeDefaultFiles = async function() {
  let webpackTmp = this.builder.readTemplate('/webpack.twig');
  let packageTmp = this.builder.readTemplate('/package.twig');
  let bootstrapTmp = this.builder.readTemplate('/bootstrap.twig');

  webpackTmp = this.builder.populate(webpackTmp, this.options);
  packageTmp = this.builder.populate(packageTmp, this.options);

  await this.builder.writeFolder(this.options.input);
  await this.builder.writeFolder(this.options.input + '/js');
  await this.builder.writeFolder(this.options.input + '/scss');
  await this.builder.writeFolder(this.options.input + '/img');
  await this.builder.writeFolder(this.options.input + '/content');
  await this.builder.writeFolder(this.options.output);

  await this.builder.writeFile('webpack.config.js', webpackTmp);
  this.cmd.message('Fichier créé → ./webpack.config.js').break();
  await this.builder.writeFile('package.json', packageTmp);
  this.cmd.message('Fichier créé → ./package.json').break();
  await this.builder.writeFile(this.options.input + this.options.inputFile, bootstrapTmp);
  this.cmd.message(`Fichier créé → ${this.options.input + this.options.inputFile}`).break();
};

module.exports = StaticTool;
