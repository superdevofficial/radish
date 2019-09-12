const pkg = require('../package.json'),
  program = require('commander'),
  readline = require('readline'),
  utils = require('./utils/index'),
  _ = require('lodash'),
  process = require('process'),
  shell = require('shelljs');

const TEXTS = {
  BUILD: 'Construction',
  CONFIGURATION: 'Configuration',
  APP_TITLE: 'L\'application',
  FOLDER_TITLES: 'Chemin vers les dossiers',
  INSTALL: 'Installation',
  QUESTIONS: {
    MORE: 'Utiliser les paramètres par défaut ?',
    INPUT_FILE: 'Chemin du fichier bootstrap',
    APP_NAME: 'Nom de l\'application/site/licorne',
    DESCRIPTION: 'Description de votre projet',
    OUTPUT: 'Chemin du dossier où générer tous les fichiers minifiés',
    INPUT: 'Chemin du dossier où se trouve les fichiers sources'
  },
  ERROR: {
    PREFIX: 'You break something idiot ! ',
    SELECT_SOMETHING: 'You need to select at least a builder AND a model',
    MODEL_EMPTY: 'No model imported !',
    NEED_THIS_QUESTION: 'This question is required !',
    INSTALL: 'Npm is required !'
  },
  SUCCESS: {
    FILES: 'Les fichiers ont bien été créés !',
    INSTALL: 'L\'installation a réussi !'
  }
};

const QUESTIONS = [
  { text: '', type: 'break' },
  { text: TEXTS.CONFIGURATION, type: 'romanTitle' },
  { text: TEXTS.APP_TITLE, type: 'title' },
  { question: TEXTS.QUESTIONS.APP_NAME, default: 'radish', index: 'name' },
  { question: TEXTS.QUESTIONS.DESCRIPTION, default: '...', index: 'description' },
  { question: TEXTS.QUESTIONS.MORE, default: false, index: 'more' },
  { text: TEXTS.FOLDER_TITLES, type: 'title', condition: 'this.res.more == true' },
  { question: TEXTS.QUESTIONS.INPUT, default: './src', index: 'input', condition: 'this.res.more == true' },
  { question: TEXTS.QUESTIONS.INPUT_FILE, default: '/js/index.js', index: 'inputFile', condition: 'this.res.more == true' },
  { question: TEXTS.QUESTIONS.OUTPUT, default: './public', index: 'output', condition: 'this.res.more == true' },
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
  this.question = new utils.Question({ cmd: this.cmd, questions: QUESTIONS, callback: this.storeResponse.bind(this) });

  program.version(pkg.version)
    .description('Generate starter files structure for SuperDev projects')
    .action(this.init.bind(this));

  program.parse(process.argv);
}

/**
 * Start radish experience !
 * @options object
 */
Radish.prototype.init = function(line) {
  if (typeof line === 'string' && line == 'watch') {
    this.watch();
  } else {
    this.cmd.log('presentation');
    this.controller(1);
  }
}

/**
 * Check if all is good for start the building
 */
Radish.prototype.controller = function(state) {
  this.state = typeof state === 'number' ? state : this.state + 1;

  switch (this.state) {
    case 1:
      this.start();
      break;
    case 2:
      this.build();
      break;
    case 3:
      this.install();
      break;
    case 4:
      this.shutdown();
      break;
    default:
      this.init();
      break;
  }
};

Radish.prototype.start = function () {
  this.question.start();
};

Radish.prototype.storeResponse = function(response) {
  this.options = response;
  this.controller();
};

Radish.prototype.build = function() {
  this.cmd.break();
  this.cmd.romanTitle(TEXTS.BUILD);

  let webpackTmp = this.reader.readTemplate('/webpack.twig');
  let packageTmp = this.reader.readTemplate('/package.twig');
  let bootstrapTmp = this.reader.readTemplate('/bootstrap.twig');

  webpackTmp = this.reader.populate(webpackTmp, this.options);
  packageTmp = this.reader.populate(packageTmp, this.options);

  this.reader.writeFolder(this.options.input);
  this.reader.writeFolder(this.options.output);
  this.reader.writeFile('webpack.config.js', webpackTmp);
  this.reader.writeFile('package.json', packageTmp);
  this.reader.writeFile(this.options.input + this.options.inputFile, bootstrapTmp);

  this.cmd.success(TEXTS.SUCCESS.FILES);
  this.cmd.break();
  this.controller();
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
};

module.exports = Radish;