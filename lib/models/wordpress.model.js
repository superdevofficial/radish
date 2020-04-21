"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const shell = __importStar(require("shelljs"));
const base_model_1 = require("./base.model");
const dialog_panel_1 = require("../utils/dialog-panel");
const path_1 = __importDefault(require("path"));
class WpModel extends base_model_1.BaseModel {
    constructor(_options) {
        super(_options);
        this.name = 'wordpress';
        this.questions = new dialog_panel_1.DialogPanel({
            cmd: this.cmd,
            questions: [
                { text: '', type: 'break' },
                { text: this.TEXTS.WP.TITLE, type: 'romanTitle' },
                { text: this.TEXTS.WP.APP_TITLE, type: 'title' },
                { question: this.TEXTS.WP.APP_NAME, default: 'radish', index: 'name' },
                { question: this.TEXTS.WP.DESCRIPTION, default: '...', index: 'description' },
                { question: this.TEXTS.STATIC.MORE, default: true, index: 'useDefault' },
                { text: this.TEXTS.STATIC.MAIN_PATH, type: 'title', condition: 'this.res.useDefault == false' },
                { question: this.TEXTS.STATIC.INPUT, default: './src', index: 'input', condition: 'this.res.useDefault == false' },
                { question: this.TEXTS.STATIC.OUTPUT, default: './public', index: 'output', condition: 'this.res.useDefault == false' },
                { text: this.TEXTS.STATIC.SASS_PATH, type: 'title', condition: 'this.res.useDefault == false' },
                { question: this.TEXTS.STATIC.SASS_FILE, default: 'main', index: 'scssFile', condition: 'this.res.useDefault == false' },
                { text: this.TEXTS.STATIC.JS_PATH, type: 'title', condition: 'this.res.useDefault == false' },
                { question: this.TEXTS.STATIC.JS_FILE, default: 'main', index: 'jsFile', condition: 'this.res.useDefault == false' },
            ]
        });
    }
    async init(...args) {
        if (this.isValid) {
            try {
                this.options = lodash_1.default.merge(this.options, await this.questions.start());
                this.options.publicPath = '/wp-content/themes/' + path_1.default.basename(this.options.name) + '/public/';
                this.cmd.break();
                this.cmd.romanTitle(this.TEXTS.BUILD);
                await this.writeDefaultFiles();
                await this.writeWpFiles();
                this.cmd.success(this.TEXTS.SUCCESS.FILES);
                this.cmd.break();
                this.cmd.break();
                this.cmd.romanTitle(this.TEXTS.INSTALL);
                if (shell.which('npm')) {
                    shell.exec('npm i');
                    this.cmd.success(this.TEXTS.SUCCESS.INSTALL);
                    this.cmd.break();
                }
                else {
                    this.cmd.error(this.TEXTS.ERROR.INSTALL);
                    this.cmd.break();
                }
                this.shutdown();
            }
            catch (e) {
                console.error(e);
                this.shutdown();
            }
        }
        this.shutdown();
    }
    async writeWpFiles() {
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
    }
    async writeStaticFiles() {
        let htmlTmp = this.builder.readTemplate('/static/index.html.twig');
        htmlTmp = this.builder.populate(htmlTmp, this.options);
        let htmlFile = this.path([this.options.output, 'index.html']);
        await this.builder.writeFile(htmlFile, htmlTmp);
        this.cmd.message(`Fichier créé → ${htmlFile}`).break();
    }
    async writeDefaultFiles() {
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
    }
}
exports.WpModel = WpModel;
//# sourceMappingURL=wordpress.model.js.map