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

Reader.prototype.writeFile = function (_path, data) {
  _path = this.writedFilePath(_path);
  mkdirp(path.dirname(_path), function (err) {
    if (err) console.error(err);
    fs.writeFileSync(_path, data);
  });
};

Reader.prototype.populate = function (template, data) {
  return Twig.twig({ data: template }).render(data);
};

Reader.prototype.writedFilePath = function(fileName) {
  return path.resolve(process.cwd(), fileName);
};

module.exports = Reader;