var Promise = require('ember-cli/lib/ext/promise');

var chalk  = require('chalk');
var yellow = chalk.yellow;
var blue   = chalk.blue;

function applyDefaultConfigIfNecessary(config, prop, defaultConfig, ui){
  if (!config[prop]) {
    var value = defaultConfig[prop];
    config[prop] = value;
    ui.write(blue('|    '));
    ui.writeLine(yellow('- Missing config: `' + prop + '`, using default: `' + value + '`'));
  }
}

module.exports = function(ui, config) {
  ui.write(blue('|    '));
  ui.writeLine(blue('- validating config'));

  var defaultConfig = {
    filePattern: '**/*.{js,css,png,gif,jpg,map,xml,txt}'
  };
  applyDefaultConfigIfNecessary(config, 'filePattern', defaultConfig, ui);

  return Promise.resolve();
}
