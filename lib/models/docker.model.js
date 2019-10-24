
const _ = require('lodash');
const Tool = require('./tool.model');
const { TEXTS } = require('../utils');
const shell = require('shelljs');
const fs = require('fs');

TEXTS.DOCKER = {
  ACTION_UNDEFINED: 'Cette action n\'existe pas !',
  DOCKER_COMPOSE_MISSING: 'Le package "docker-compose" n\'est pas installé !',
  DOCKER_FILE_MISSING: 'Le fichier "docker-compose.yml" est introuvable !'
};

function DockerTool(_options) {
  Tool.call(this, _options);
  this.name = 'docker';
  this.isValid = true;
}

DockerTool.prototype = Object.create(Tool.prototype);

DockerTool.prototype.init = async function (...args) {
  const action = _.isArray(args) && _.isString(args[0]) && args[0] !== '' && args[0] || 'up';
  const options = _.isArray(args) && _.isString(args[1]) && args[1] !== '' && args[1] || null;

  switch (action) {
    case 'up':
      await this.up(options);
      break;
    case 'build':
      await this.build();
      break;
    default:
      this.cmd.error(TEXTS.DOCKER.ACTION_UNDEFINED);
      break;
  }
  this.shutdown();
};

DockerTool.prototype.up = async function(path) {
  try {
    if (!shell.which('docker-compose')) {
      throw new Error(TEXTS.DOCKER.DOCKER_COMPOSE_MISSING);
    }

    let filePath = _.isString(path) && path !== '' && path.includes('.yml') && path ||
      fs.existsSync('./docker-compose.yml') && './docker-compose.yml' || 
      fs.existsSync('./docker/docker-compose.yml') && './docker/docker-compose.yml' || 
      false;

    if (!filePath) {
      throw new Error(TEXTS.DOCKER.DOCKER_FILE_MISSING);
    }

    shell.exec(`docker-compose up`)
  } catch (e) {
    this.cmd.error(e);
    this.shutdown();
    return;
  }
};

DockerTool.prototype.build = async function() {
  try {
    if (!this.isValid) {
      throw new Error('L\'outil n\'est pas disponible !');
    }

    this.cmd.break();
    this.cmd.romanTitle(TEXTS.BUILD);
    await this.writeDefaultFiles();
    this.cmd.success(TEXTS.SUCCESS.FILES);
    this.cmd.break();
    this.cmd.break();
  } catch (e) {
    console.log(',');
    this.cmd.error(e);
    this.shutdown();
  }

  this.shutdown();
};

DockerTool.prototype.writeDefaultFiles = async function() {
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

module.exports = DockerTool;
