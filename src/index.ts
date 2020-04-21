
const pkg = require('../package.json');
import './utils/polyfills';
import * as _ from 'lodash';
import program from 'commander';
import readline from 'readline';
import process from 'process';
import shell from 'shelljs';
import Translator from './assets/texts';
import { FileBuilder, ProcessController } from './utils/index';
import { 
  WpModel, 
  StaticModel, 
  MysqlModel, 
  DockerModel,
  IBaseModel
} from './models';




export interface IRadish {
  init(type?: string, args?: any): Promise<void>;
  selectProjectType(): Promise<void>;
  watch(args: any): void;
  shutdown(): void;
}



export class Radish implements IRadish {

  protected rl: any;
  protected state: number = 0;
  protected options: any = {};
  protected reader: FileBuilder;
  protected cmd: ProcessController;
  protected tools: {[x: string]: IBaseModel};
  protected get TEXTS() { return this.cmd.TEXTS; }
  protected translator: Translator;

  constructor() {
    this.translator = Translator.initiliaze();
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    this.reader = new FileBuilder({ templatePath: '/templates' });
    this.cmd = new ProcessController({
      rl: this.rl,
      translator: this.translator,
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
      static: new StaticModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
      wordpress: new WpModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
      mysql: new MysqlModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
      docker: new DockerModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
    };

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
      .option('-fr, --fr', 'Translate radish in fr')
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
  async init(type?: string, args?: any): Promise<void> {
    if (args && args.fr === true) {
      this.changeLocality('FR');
    } else {
      this.changeLocality('EN');
    }

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
  }

  /**
   * Force user to select project Type
   */
  async selectProjectType(): Promise<void> {
    this.cmd.romanTitle(this.TEXTS.PROJECT.TITLE);
    this.cmd.askWithChoices(this.TEXTS.PROJECT.QUESTION, this.TEXTS.PROJECT.TYPES, async (res: any) => {
      res = _.isString(res) && res.toLowerCase().trim() || false;
      if (res && this.tools[res]) {
        await this.tools[res].init();
      } else {
        this.cmd.error(this.TEXTS.ERROR.TOOL_NOT_FOUND);
      }
    });
  };

  /**
   * Watch your application
   */
  watch(args: any): void {  
    if (!shell.which('npm')) {
      this.cmd.error(this.TEXTS.ERROR.INSTALL);
      this.cmd.break();
      this.shutdown();
      return;
    }

    if (args.sass) {
      shell.exec('npm run watch:sass', (params: any) => {});
    } else if (args.js) {
      shell.exec('npm run watch:js', (params: any) => {});
    } else {
      shell.exec('npm run watch', (params: any) => {});
    }
  };

  /**
   * Shutdown the process
   */
  shutdown(): void {
    this.cmd.shutdown();
  };

  protected changeLocality(local: any) {
    this.translator.changeLocality(local);
  }

}
