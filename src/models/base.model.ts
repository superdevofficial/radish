
import _ from 'lodash';

export interface IBaseModel {
  isValid: boolean;
  name: string;
  questions: any;
  cmd: any;
  builder: any;
  options: any;
  init(): void;
  shutdown(): void;
  path(shards: any[]): string;
}

export abstract class BaseModel implements IBaseModel {
  
  abstract name: string;

  isValid: boolean = false;
  questions: any;
  cmd: any;
  builder: any;
  options: any = {};
  get TEXTS() { return this.cmd.TEXTS; }

  constructor (_options: any) {
    if (!_.isNil(_options) && _.isObject(_options.cmd) && _.isObject(_options.builder)) {
      this.isValid = true;
      this.cmd = _options.cmd;
      this.builder = _options.builder;
      this.options = _options.options || {};
    }
  }

  abstract init(): void;

  shutdown(): void {
    this.cmd.shutdown();
  }

  path(shards: any[]): string {
    let path: string = '';

    if (_.isArray(shards)) {
      shards.forEach((shard: any, index: number) => {
        if (_.isString(shard)) {
          if (index !== shards.length - 1) {
            if (shard[0] === '/' && path[path.length - 1] === '/') {
              path = path.substring(0, path.length - 1);
            }

            path += shard[shard.length - 1] === '/' ? shard : shard + '/';
          } else {
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
