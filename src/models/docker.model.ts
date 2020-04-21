
import _ from 'lodash';
import * as shell from 'shelljs';
import { BaseModel } from './base.model';
import * as fs from 'fs';

export class DockerModel extends BaseModel {

  isValid: boolean = true;
  name: string = 'docker';

  constructor (_options: any) {
    super(_options);
  }

  async init(...args: any[]): Promise<void> {
    const action: string = _.isArray(args) && _.isString(args[0]) && args[0] !== '' && args[0] || 'up';
    const options: any = _.isArray(args) && _.isString(args[1]) && args[1] !== '' && args[1] || null;

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

  async up(_path: string) {
    try {
      if (!shell.which('docker-compose')) {
        throw new Error(this.TEXTS.DOCKER.DOCKER_COMPOSE_MISSING);
      }
  
      let filePath = _.isString(_path) && _path !== '' && _path.includes('.yml') && _path ||
        fs.existsSync('./docker-compose.yml') && './docker-compose.yml' || 
        fs.existsSync('./docker/docker-compose.yml') && './docker/docker-compose.yml' || 
        false;
  
      if (!filePath) {
        throw new Error(this.TEXTS.DOCKER.DOCKER_FILE_MISSING);
      }
  
      shell.exec(`docker-compose up`)
    } catch (e) {
      this.cmd.error(e);
      this.shutdown();
      return;
    }
  };
  
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
    } catch (e) {
      console.log(',');
      this.cmd.error(e);
      this.shutdown();
    }
  
    this.shutdown();
  };
  
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
  };

}
