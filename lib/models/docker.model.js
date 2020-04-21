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
const fs = __importStar(require("fs"));
class DockerModel extends base_model_1.BaseModel {
    constructor(_options) {
        super(_options);
        this.isValid = true;
        this.name = 'docker';
    }
    async init(...args) {
        const action = lodash_1.default.isArray(args) && lodash_1.default.isString(args[0]) && args[0] !== '' && args[0] || 'up';
        const options = lodash_1.default.isArray(args) && lodash_1.default.isString(args[1]) && args[1] !== '' && args[1] || null;
        switch (action) {
            case 'up':
                await this.up(options);
                break;
            case 'build':
                await this.build();
                break;
            default:
                this.cmd.error(this.TEXTS.DOCKER.ACTION_UNDEFINED);
                break;
        }
        this.shutdown();
    }
    async up(_path) {
        try {
            if (!shell.which('docker-compose')) {
                throw new Error(this.TEXTS.DOCKER.DOCKER_COMPOSE_MISSING);
            }
            let filePath = lodash_1.default.isString(_path) && _path !== '' && _path.includes('.yml') && _path ||
                fs.existsSync('./docker-compose.yml') && './docker-compose.yml' ||
                fs.existsSync('./docker/docker-compose.yml') && './docker/docker-compose.yml' ||
                false;
            if (!filePath) {
                throw new Error(this.TEXTS.DOCKER.DOCKER_FILE_MISSING);
            }
            shell.exec(`docker-compose up`);
        }
        catch (e) {
            this.cmd.error(e);
            this.shutdown();
            return;
        }
    }
    ;
    async build() {
        try {
            if (!this.isValid) {
                throw new Error('L\'outil n\'est pas disponible !');
            }
            this.cmd.break();
            this.cmd.romanTitle(this.TEXTS.BUILD);
            await this.writeDefaultFiles();
            this.cmd.success(this.TEXTS.SUCCESS.FILES);
            this.cmd.break();
            this.cmd.break();
        }
        catch (e) {
            console.log(',');
            this.cmd.error(e);
            this.shutdown();
        }
        this.shutdown();
    }
    ;
    async writeDefaultFiles() {
        let dockerCompose = this.builder.readTemplate('/docker/docker-compose.twig');
        dockerCompose = this.builder.populate(dockerCompose, this.options);
        let nginxDefault = this.builder.readTemplate('/docker/nginx-default.twig');
        nginxDefault = this.builder.populate(nginxDefault, this.options);
        await this.builder.writeFolder('./docker/nginx');
        await this.builder.writeFile('./docker/docker-compose.yml', dockerCompose);
        this.cmd.message(`Fichier créé → ./docker/docker-compose.yml`).break();
        await this.builder.writeFile('./docker/nginx/default.conf', nginxDefault);
        this.cmd.message(`Fichier créé → ./docker/nginx/default.conf`).break();
    }
    ;
}
exports.DockerModel = DockerModel;
//# sourceMappingURL=docker.model.js.map