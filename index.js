/* jshint node: true */
'use strict';

var Promise   = require('ember-cli/lib/ext/promise');
var fs        = require('fs');
var path      = require('path');
var minimatch = require('minimatch');

var chalk     = require('chalk');
var blue      = chalk.blue;
var red       = chalk.red;

var denodeify = require('rsvp').denodeify;
var renameFile  = denodeify(fs.rename);

var validateConfig = require('./lib/utilities/validate-config');

module.exports = {
  name: 'ember-cli-deploy-gzip',

  createDeployPlugin: function(options) {
    var zlib = require('zlib');
    var fs = require('fs');

    function _gzipFileInPlace(distDir, filePath) {
      var fullPath = path.join(distDir, filePath);
      return new Promise(function(resolve, reject) {
        var gzip = zlib.createGzip();
        var inp = fs.createReadStream(fullPath);
        var out = fs.createWriteStream(fullPath + '.gz');

        inp.pipe(gzip).pipe(out);
        inp.on('error', function(err){
          reject(err);
        });
        inp.on('end', function(){
          resolve();
        });
      }).then(function(){
        return renameFile(fullPath + '.gz', fullPath);
      }).then(function(){
        return filePath;
      });
    }

    function _gzipFiles(distDir, distFiles, filePattern) {
      var filesToGzip = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));
      return Promise.map(filesToGzip, _gzipFileInPlace.bind(this, distDir));
    }

    function _beginMessage(ui, indexPath) {
      ui.write(blue('|      '));
      ui.write(blue('- GZipping `' + indexPath + '`\n'));

      return Promise.resolve();
    }

    function _successMessage(ui, key) {
      ui.write(blue('|      '));
      ui.write(blue('- GZipped with key `' + key + '`\n'));

      return Promise.resolve(key);
    }

    function _errorMessage(ui, error) {
      ui.write(blue('|      '));
      ui.write(red('- ' + error + '`\n'));

      return Promise.reject(error);
    }

    return {
      name: options.name,

      willDeploy: function(context) {
        var deployment = context.deployment;
        var ui         = deployment.ui;
        var config     = deployment.config[this.name] = deployment.config[this.name] || {};

        return validateConfig(ui, config)
          .then(function() {
            ui.write(blue('|    '));
            ui.writeLine(blue('- config ok'));
          });
      },

      willUpload: function(context) {
        var deployment = context.deployment;
        var ui         = deployment.ui;
        var config     = deployment.config[this.name] || {};

        var filePattern  = config.filePattern;
        var distDir     = context.distDir;
        var distFiles     = context.distFiles || [];

        return _beginMessage(ui, filePattern)
          .then(_gzipFiles.bind(this, distDir, distFiles, filePattern))
          .then(_successMessage.bind(this, ui))
          .then(function(gzippedFiles) {
            return { gzippedFiles: gzippedFiles };
          })
          .catch(_errorMessage.bind(this, ui));
      }
    };
  }
};
