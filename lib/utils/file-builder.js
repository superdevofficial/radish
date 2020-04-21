"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const fs = __importStar(require("fs"));
const fs_1 = require("fs");
const path = __importStar(require("path"));
const Twig = __importStar(require("twig"));
const process = __importStar(require("process"));
class FileBuilder {
    constructor(options) {
        options = options || {};
        this.templatesPath = path.resolve(__dirname, (options && _.isString(options.templatePath) ? '..' + options.templatePath : '/templates'));
    }
    readTemplate(_path) {
        return this.readFile(this.templatesPath + _path).toString('utf8');
    }
    readFile(_path) {
        let file = fs.readFileSync(_path);
        return file;
    }
    async writeFile(_path, data) {
        _path = this.writedFilePath(_path);
        try {
            await fs_1.promises.mkdir(path.dirname(_path), { recursive: true });
            await fs_1.promises.writeFile(_path, data);
        }
        catch (e) {
            console.error(e);
        }
    }
    populate(template, data) {
        return Twig.twig({ data: template }).render(data);
    }
    writedFilePath(fileName) {
        return path.resolve(process.cwd(), fileName);
    }
    async writeFolder(_path) {
        try {
            await fs_1.promises.mkdir(_path, { recursive: true });
        }
        catch (e) {
            console.error(e);
        }
    }
}
exports.FileBuilder = FileBuilder;
//# sourceMappingURL=file-builder.js.map