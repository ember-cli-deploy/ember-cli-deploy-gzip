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

    function _gzipFileInPlace(ui, distDir, filePath) {
      var fullPath = path.join(distDir, filePath);
      return new Promise(function(resolve, reject) {
        var gzip = zlib.createGzip();
        var inp = fs.createReadStream(fullPath);
        var out = fs.createWriteStream(fullPath + '.gz');

        inp.pipe(gzip).pipe(out);
        inp.on('error', function(err){
          reject(err);
        });
        out.on('error', function(err){
          reject(err);
        });
        out.on('finish', function(){
          resolve();
        });
      }).then(function(){
        return renameFile(fullPath + '.gz', fullPath);
      }).then(function(){
        ui.write(blue('|      '));
        ui.write(blue('- ✔  ' + filePath + '\n'));
        return filePath;
      });
    }

    function _gzipFiles(distDir, distFiles, filePattern, ui) {
      var filesToGzip = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));
      return Promise.map(filesToGzip, _gzipFileInPlace.bind(this, ui, distDir));
    }

    function _beginMessage(ui, indexPath) {
      ui.write(blue('|      '));
      ui.write(blue('- gzipping `' + indexPath + '`\n'));

      return Promise.resolve();
    }

    function _successMessage(ui, count) {
      ui.write(blue('|      '));
      ui.write(blue('- gzipped ' + count + ' files ok\n'));
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
          .then(_gzipFiles.bind(this, distDir, distFiles, filePattern, ui))
          .then(function(gzippedFiles) {
            _successMessage(ui, gzippedFiles.length);
            return { gzippedFiles: gzippedFiles };
          })
          .catch(_errorMessage.bind(this, ui));
      }
    };
  }
};
