const fs = require('fs'),
  path = require('path'),
  Twig = require('twig'),
  process = require('process'),
  mkdirp = require('mkdirp');
  

function Reader(templatePath) {
  this.templatesPath = path.resolve(__dirname, '..' + templatePath);
}

Reader.prototype.readTemplate = function (filePath) {
  return this.readFile(this.templatesPath + filePath).toString('utf8');
};

Reader.prototype.readFile = function (filePath) {
  let file = fs.readFileSync(filePath);
  return file;
};

Reader.prototype.writeFile = async function (_path, data) {
  _path = this.writedFilePath(_path);
  try {
    await fs.promises.mkdir(path.dirname(_path), {recursive: true});
    await fs.promises.writeFile(_path, data);
  }catch(e){
    console.error(e);
  }
};

Reader.prototype.populate = function (template, data) {
  return Twig.twig({ data: template }).render(data);
};

Reader.prototype.writedFilePath = function(fileName) {
  return path.resolve(process.cwd(), fileName);
};

Reader.prototype.writeFolder = async function (path) {
  try {
    await fs.promises.mkdir(path, { recursive: true });
  }catch(e){
    console.error(e);
  }
};

module.exports = Reader;