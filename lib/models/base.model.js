"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class BaseModel {
    constructor(_options) {
        this.isValid = false;
        this.options = {};
        if (!lodash_1.default.isNil(_options) && lodash_1.default.isObject(_options.cmd) && lodash_1.default.isObject(_options.builder)) {
            this.isValid = true;
            this.cmd = _options.cmd;
            this.builder = _options.builder;
            this.options = _options.options || {};
        }
    }
    get TEXTS() { return this.cmd.TEXTS; }
    shutdown() {
        this.cmd.shutdown();
    }
    path(shards) {
        let path = '';
        if (lodash_1.default.isArray(shards)) {
            shards.forEach((shard, index) => {
                if (lodash_1.default.isString(shard)) {
                    if (index !== shards.length - 1) {
                        if (shard[0] === '/' && path[path.length - 1] === '/') {
                            path = path.substring(0, path.length - 1);
                        }
                        path += shard[shard.length - 1] === '/' ? shard : shard + '/';
                    }
                    else {
                        if (shard[0] === '.' && path[path.length - 1] === '/') {
                            path = path.substring(0, path.length - 1);
                        }
                        path += shard[shard.length - 1] === '/' ? shard.substring(0, shard.length - 1) : shard;
                    }
                }
            });
        }
        return path;
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=base.model.js.map