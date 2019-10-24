const Tool = require('./tool.model');
const { StaticTool } = require('./static.model');
const WpTool = require('./wordpress.model');
const MysqlTool = require('./mysql.model');
const DockerTool = require('./docker.model');

module.exports = {
  Tool,
  StaticTool,
  WpTool,
  MysqlTool,
  DockerTool
};
