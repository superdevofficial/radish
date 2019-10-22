const pkg = require('../package.json'),
  program = require('commander'),
  readline = require('readline'),
  { Reader, Cmd, Question, TEXTS } = require('./utils/index'),
  _ = require('lodash'),
  process = require('process'),
  shell = require('shelljs'),
  fs = require('fs'),
  { WpTool, StaticTool, MysqlTool } = require('./models');

function Radish () {
  this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  this.state = 0;
  this.options = {};
  this.reader = new Reader('/templates');
  this.cmd = new Cmd({
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

  this.tools = {
    static: new StaticTool({ cmd: this.cmd, builder: this.reader,  options: this.options }),
    wordpress: new WpTool({ cmd: this.cmd, builder: this.reader,  options: this.options }),
    mysql: new MysqlTool({ cmd: this.cmd, builder: this.reader,  options: this.options })
  };

  program.version(pkg.version)
    .description(pkg.description)
    .usage('[options] <cmd>');

  program.command('watch')
    .description('Run webpack in watch mode')
    .action(this.watch.bind(this));

  program.command('mysql-import')
    .action(this.tools.mysql.init.bind(this.tools.mysql));

  program.command('init')
    .option('-wp, --wordpress', 'Initialize a Wordpress project')
    .option('-s, --static', 'Initialize static project structure and scripts')
    .description('Init project structure and scripts. ProjectType: static or wordpress')
    .action(this.init.bind(this));
  
  program.command('init-worpdress')
    .description('Initialize a Wordpress project')
    .action(this.init.bind(this, 'wordpress'));

  program.command('init-static')
    .description('Initialize static project structure and scripts')
    .action(this.init.bind(this, 'static'));

  if (process.argv.length < 3) {
    program.help();
  } else {
    program.parse(process.argv);
  }
}

/**
 * Start radish experience !
 * @options object
 */
Radish.prototype.init = async function(_program) {
  if (_.isObject(_program)) {
    _program = _program.static === true && 'static' || _program.wordpress === true && 'wordpress' || 'empty';
  }

  this.cmd.log('presentation');
  this.options.projectType = (_.isString(_program) && (_program === 'static' || _program === 'wordpress')) ? _program : 'empty';

  switch (this.options.projectType) {
    case 'wordpress':
      await this.tools.wordpress.init();
      break;
    case 'static':
      await this.tools.static.init();
      break;
    default:
      this.selectProjectType();
      break;
  }
};

/**
 * Force user to select project Type
 */
Radish.prototype.selectProjectType = async function() {
  this.cmd.romanTitle(TEXTS.PROJECT.TITLE);
  this.cmd.askWithChoices(TEXTS.PROJECT.QUESTION, TEXTS.PROJECT.TYPES, async (res) => {
    res = _.isString(res) && res.toLowerCase().trim() || false;
    if (res && this.tools[res]) {
      await this.tools[res].init();
    } else {
      this.cmd.error(TEXTS.ERROR.TOOL_NOT_FOUND);
    }
  });
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