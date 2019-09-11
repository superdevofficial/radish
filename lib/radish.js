const pkg = require('../package.json'),
  program = require('commander'),
  readline = require('readline'),
  utils = require('./utils/index'),
  _ = require('lodash'),
  process = require('process');

const TEXTS = {
  BUILD: 'Construction',
  CONFIGURATION: 'Configuration',
  APP_TITLE: 'L\'application',
  FOLDER_TITLES: 'Chemin vers les dossiers',
  QUESTIONS: {
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
    NEED_THIS_QUESTION: 'This question is required !'
  },
  SUCCESS: 'Votre projet a bien été initialisé !'
};

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

  program.version(pkg.version)
    .description('Generate starter files structure for SuperDev projects')
    .action(this.init.bind(this));

  program.parse(process.argv);
}

/**
 * Start radish experience !
 * @options object
 */
Radish.prototype.init = function() {
  this.cmd.log('presentation');
  this.controller(1);
}

/**
 * Check if all is good for start the building
 */
Radish.prototype.controller = function(state) {
  this.state = typeof state === 'number' ? state : this.state + 1;

  switch (this.state) {
    case 1:
      this.configureApp();
      break;
    case 2:
      this.configureDescription();
      break;
    case 3:
      this.configureInput();
      break;
    case 4:
      this.configureInputFile();
      break;
    case 5:
      this.configureOutput();
      break;
    case 6:
      this.build();
      break;
    case 7:
      this.shutdown();
      break;
    default:
      this.init();
      break;
  }
};

Radish.prototype.configureApp = function () {
  var value = "radish";

  this.cmd.break();
  this.cmd.romanTitle(TEXTS.CONFIGURATION);
  this.cmd.title(TEXTS.APP_TITLE);
  this.cmd.ask(this.cmd.question(TEXTS.QUESTIONS.APP_NAME, value), answer => {
    anwser = typeof anwser === 'string' ? anwser.trim() : value;
    this.options.name = answer != '' ? answer : value;
    this.controller();
  });
};

Radish.prototype.configureDescription = function() {
  var value = '';

  this.cmd.ask(this.cmd.question(TEXTS.QUESTIONS.DESCRIPTION, '...'), answer => {
    anwser = typeof anwser === 'string' ? anwser.trim() : value;
    this.options.description = answer != '' ? answer : value;
    this.controller();
  });
};

Radish.prototype.configureInputFile = function () {
  var value = '/index.js';

  this.cmd.ask(this.cmd.question(TEXTS.QUESTIONS.INPUT_FILE, value), answer => {
    anwser = typeof anwser === 'string' ? anwser.trim() : value;
    this.options.inputFile = answer != '' ? answer : value;
    this.controller();
  });
};

Radish.prototype.configureInput = function() {
  var value = "./src";

  this.cmd.ask(this.cmd.question(TEXTS.QUESTIONS.INPUT, value), answer => {
    anwser = typeof anwser === 'string' ? anwser.trim() : value;
    this.options.input = answer != '' ? answer : value;
    this.controller();
  });
};

Radish.prototype.configureOutput = function () {
  var value = "./public";

  this.cmd.title(TEXTS.FOLDER_TITLES);
  this.cmd.ask(this.cmd.question(TEXTS.QUESTIONS.OUTPUT, value), answer => {
    anwser = typeof anwser === 'string' ? anwser.trim() : value;
    this.options.output = answer != '' ? answer : value;
    this.controller();
  });
};

Radish.prototype.build = function() {
  this.cmd.break();
  this.cmd.romanTitle(TEXTS.BUILD);

  let webpackTmp = this.reader.readTemplate('/webpack.twig');
  let packageTmp = this.reader.readTemplate('/package.twig');

  webpackTmp = this.reader.populate(webpackTmp, this.options);
  packageTmp = this.reader.populate(packageTmp, this.options);

  this.reader.writeFile('webpack.config.js', webpackTmp);
  this.reader.writeFile('package.json', packageTmp);

  this.cmd.success(TEXTS.SUCCESS);
  this.cmd.break();
  this.shutdown();
};

Radish.prototype.shutdown = function() {
  this.cmd.shutdown();
};

module.exports = Radish;