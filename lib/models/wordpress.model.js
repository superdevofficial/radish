
const _ = require('lodash'),
  StaticTool = require('./static.model'),
  { Question, TEXTS } = require('../utils'),
  path = require('path'),
  shell = require('shelljs');

const WP_TEXTS = {
  TITLE: 'Configuration thème Wordpress',
  APP_TITLE: 'Le thème',
  MORE: 'Utiliser les paramètres par défaut ?',
  INPUT_FILE: 'Chemin du fichier bootstrap',
  APP_NAME: 'Nom de votre thème',
  DESCRIPTION: 'Description de votre thème',
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

function WpTool(_options) {
  StaticTool.call(this, _options);
  this.name = 'wordpress';
  this.questions = new Question({ cmd: this.cmd, questions: [
      { text: '', type: 'break' },
      { text: WP_TEXTS.TITLE, type: 'romanTitle' },
      { text: WP_TEXTS.APP_TITLE, type: 'title' },
      { question: WP_TEXTS.APP_NAME, default: 'radish', index: 'name' },
      { question: WP_TEXTS.DESCRIPTION, default: '...', index: 'description' },
      { question: WP_TEXTS.MORE, default: true, index: 'useDefault' },
      { text: TEXTS.FOLDER_TITLES, type: 'title', condition: 'this.res.useDefault == false' },
      { question: WP_TEXTS.INPUT, default: './src', index: 'input', condition: 'this.res.useDefault == false' },
      { question: WP_TEXTS.INPUT_FILE, default: '/index', index: 'inputFile', condition: 'this.res.useDefault == false' },
      { question: WP_TEXTS.OUTPUT, default: './public', index: 'output', condition: 'this.res.useDefault == false' },
    ]});
}

WpTool.prototype = Object.create(StaticTool.prototype);

WpTool.prototype.init = async function (...args) {
  if (this.isValid) {
    try {
      this.options = _.merge(this.options, await this.questions.start());
      this.options.imgPath = '/wp-content/themes/' + path.basename(this.options.name) + '/public/img';
      this.cmd.break();
      this.cmd.romanTitle(TEXTS.BUILD);
      await this.writeDefaultFiles();
      await this.writeWpFiles();
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

StaticTool.prototype.writeWpFiles = async function() {
  let styleCss = this.builder.populate(this.builder.readTemplate('/wp/style.twig'), this.options);
  let functions = this.builder.populate(this.builder.readTemplate('/wp/functions.twig'), this.options);
  let index = this.builder.populate(this.builder.readTemplate('/wp/index.twig'), this.options);
  let headers = this.builder.populate(this.builder.readTemplate('/wp/header.twig'), this.options);
  let footers = this.builder.populate(this.builder.readTemplate('/wp/footer.twig'), this.options);
  let enqueue = this.builder.populate(this.builder.readTemplate('/wp/enqueue.twig'), this.options);
  let helpers = this.builder.populate(this.builder.readTemplate('/wp/helpers.twig'), this.options);

  await this.builder.writeFolder(this.options.input + '/config');

  await this.builder.writeFile('style.css', styleCss);
  this.cmd.message('Fichier créé → ./style.css').break();
  await this.builder.writeFile('functions.php', functions);
  this.cmd.message('Fichier créé → ./functions.php').break();
  await this.builder.writeFile('header.php', headers);
  this.cmd.message('Fichier créé → ./header.php').break();
  await this.builder.writeFile('footer.php', footers);
  this.cmd.message('Fichier créé → ./footer.php').break();
  await this.builder.writeFile('index.php', index);
  this.cmd.message('Fichier créé → ./index.php').break();
  await this.builder.writeFile('src/config/enqueue.php', enqueue);
  this.cmd.message('Fichier créé → ./src/config/enqueue.php').break();
  await this.builder.writeFile('src/config/helpers.php', helpers);
  this.cmd.message('Fichier créé → ./src/config/helpers.php').break();
};

module.exports = WpTool;
