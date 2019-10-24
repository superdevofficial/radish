const _ = require('lodash'),
  pkg = require('../package.json'),
  program = require('commander'),
  readline = require('readline'),
  process = require('process'),
  shell = require('shelljs'),
  { Reader, Cmd, TEXTS } = require('./utils/index'),
  { WpTool, StaticTool, MysqlTool, DockerTool } = require('./models');

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
    mysql: new MysqlTool({ cmd: this.cmd, builder: this.reader,  options: this.options }),
    docker: new DockerTool({ cmd: this.cmd, builder: this.reader,  options: this.options }),
  };

  // program.on('init *', function () {
  //   console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  //   process.exit(1);
  // });

  program.version(pkg.version)
    .description(pkg.description)
    .usage('[options] <cmd>');

  program.command('watch')
    .option('-s, --sass', 'Initialize a Wordpress project')
    .option('-j, --js', 'Initialize static project structure and scripts')
    .description('Run webpack in watch mode')
    .action(this.watch.bind(this));

  program.command('mysql-import')
    .description('Tool for import or export mysql database')
    .action(this.tools.mysql.init.bind(this.tools.mysql));

  program.command('docker <up|build> [options]')
    .description('Build docker file for local development')
    .action(this.tools.docker.init.bind(this.tools.docker));

  program.command('init [type]')
    .description('Init project structure and scripts. ProjectType: static or wordpress')
    .action(this.init.bind(this));

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
Radish.prototype.init = async function(type, _program) {
  type = _.isString(type) ? type : 'empty';
  this.cmd.log('presentation');
  this.options.projectType = (_.isString(type) && (type === 'static' || type === 'wordpress')) ? type : 'empty';

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

/**
 * Watch your application
 */
Radish.prototype.watch = function(args) {  
  if (!shell.which('npm')) {
    this.cmd.error(TEXTS.ERROR.INSTALL);
    this.cmd.break();
    this.shutdown();
    return;
  }

  if (args.sass) {
    shell.exec('npm run watch:sass', (params) => {});
  } else if (args.js) {
    shell.exec('npm run watch:js', (params) => {});
  } else {
    shell.exec('npm run watch', (params) => {});
  }
};

/**
 * Shutdown the process
 */
Radish.prototype.shutdown = function() {
  this.cmd.shutdown();
};

module.exports = Radish;