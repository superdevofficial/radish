
import * as _ from 'lodash';
import * as fs from 'fs';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import * as Twig from 'twig';
import * as process from 'process';

export interface IFileBuilder {
  readTemplate(_path: string): string;
  readFile(_path: string): Buffer;
  writeFile(_path: string, data: any): Promise<void>;
  populate(template: string, data: any): string;
  writedFilePath(fileName: string): string;
  writeFolder(_path: string): Promise<void>;
}

export class FileBuilder implements IFileBuilder {

  protected templatesPath: string;

  constructor (options: any) {
    options = options || {};

    this.templatesPath = path.resolve(__dirname, 
      (options && _.isString(options.templatePath) ? '..' + options.templatePath : '/templates'));
    }

  readTemplate(_path: string): string {
    return this.readFile(this.templatesPath + _path).toString('utf8');
  }

  readFile(_path: string): Buffer {
    let file: Buffer = fs.readFileSync(_path);
    return file;
  }

  async writeFile(_path: string, data: any): Promise<void> {
    _path = this.writedFilePath(_path);

    try {
      await fsPromises.mkdir(path.dirname(_path), {recursive: true});
      await fsPromises.writeFile(_path, data);
    } catch (e) {
      console.error(e);
    }
  }

  populate(template: string, data: any): string {
    return Twig.twig({ data: template }).render(data);
  }

  writedFilePath(fileName: string): string {
    return path.resolve(process.cwd(), fileName);
  }

  async writeFolder(_path: string): Promise<void> {
    try {
      await fsPromises.mkdir(_path, { recursive: true });
    } catch (e) {
      console.error(e);
    }
  }

}
