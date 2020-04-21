"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../package.json');
require("./utils/polyfills");
const _ = __importStar(require("lodash"));
const commander_1 = __importDefault(require("commander"));
const readline_1 = __importDefault(require("readline"));
const process_1 = __importDefault(require("process"));
const shelljs_1 = __importDefault(require("shelljs"));
const texts_1 = __importDefault(require("./assets/texts"));
const index_1 = require("./utils/index");
const models_1 = require("./models");
class Radish {
    constructor() {
        this.state = 0;
        this.options = {};
        this.translator = texts_1.default.initiliaze();
        this.rl = readline_1.default.createInterface({ input: process_1.default.stdin, output: process_1.default.stdout });
        this.reader = new index_1.FileBuilder({ templatePath: '/templates' });
        this.cmd = new index_1.ProcessController({
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
            static: new models_1.StaticModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
            wordpress: new models_1.WpModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
            mysql: new models_1.MysqlModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
            docker: new models_1.DockerModel({ cmd: this.cmd, builder: this.reader, options: this.options }),
        };
        commander_1.default.version(pkg.version)
            .description(pkg.description)
            .usage('[options] <cmd>');
        commander_1.default.command('watch')
            .option('-s, --sass', 'Initialize a Wordpress project')
            .option('-j, --js', 'Initialize static project structure and scripts')
            .description('Run webpack in watch mode')
            .action(this.watch.bind(this));
        commander_1.default.command('mysql-import')
            .description('Tool for import or export mysql database')
            .action(this.tools.mysql.init.bind(this.tools.mysql));
        commander_1.default.command('docker <up|build> [options]')
            .description('Build docker file for local development')
            .action(this.tools.docker.init.bind(this.tools.docker));
        commander_1.default.command('init [type]')
            .option('-fr, --fr', 'Translate radish in fr')
            .description('Init project structure and scripts. ProjectType: static or wordpress')
            .action(this.init.bind(this));
        if (process_1.default.argv.length < 3) {
            commander_1.default.help();
        }
        else {
            commander_1.default.parse(process_1.default.argv);
        }
    }
    get TEXTS() { return this.cmd.TEXTS; }
    /**
     * Start radish experience !
     * @options object
     */
    async init(type, args) {
        if (args && args.fr === true) {
            this.changeLocality('FR');
        }
        else {
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
    async selectProjectType() {
        this.cmd.romanTitle(this.TEXTS.PROJECT.TITLE);
        this.cmd.askWithChoices(this.TEXTS.PROJECT.QUESTION, this.TEXTS.PROJECT.TYPES, async (res) => {
            res = _.isString(res) && res.toLowerCase().trim() || false;
            if (res && this.tools[res]) {
                await this.tools[res].init();
            }
            else {
                this.cmd.error(this.TEXTS.ERROR.TOOL_NOT_FOUND);
            }
        });
    }
    ;
    /**
     * Watch your application
     */
    watch(args) {
        if (!shelljs_1.default.which('npm')) {
            this.cmd.error(this.TEXTS.ERROR.INSTALL);
            this.cmd.break();
            this.shutdown();
            return;
        }
        if (args.sass) {
            shelljs_1.default.exec('npm run watch:sass', (params) => { });
        }
        else if (args.js) {
            shelljs_1.default.exec('npm run watch:js', (params) => { });
        }
        else {
            shelljs_1.default.exec('npm run watch', (params) => { });
        }
    }
    ;
    /**
     * Shutdown the process
     */
    shutdown() {
        this.cmd.shutdown();
    }
    ;
    changeLocality(local) {
        this.translator.changeLocality(local);
    }
}
exports.Radish = Radish;
//# sourceMappingURL=index.js.map