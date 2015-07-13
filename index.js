/* jshint node: true */
'use strict';

var Promise   = require('ember-cli/lib/ext/promise');
var fs        = require('fs');
var path      = require('path');
var minimatch = require('minimatch');

var denodeify = require('rsvp').denodeify;
var renameFile  = denodeify(fs.rename);

var DeployPluginBase = require('ember-cli-deploy-plugin');

module.exports = {
  name: 'ember-cli-deploy-gzip',

  createDeployPlugin: function(options) {
    var zlib = require('zlib');
    var fs = require('fs');

    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        filePattern: '**/*.{js,css,png,gif,jpg,map,xml,txt,svg,eot,ttf,woff,woff2}',
        distDir: function(context){
          return context.distDir;
        },
        distFiles: function(context){
          return context.distFiles;
        }
      },

      willUpload: function(context) {
        var self = this;

        var filePattern  = this.readConfig('filePattern');
        var distDir      = this.readConfig('distDir');
        var distFiles    = this.readConfig('distFiles') || [];

        this.log('gzipping `' + filePattern + '`');
        return this._gzipFiles(distDir, distFiles, filePattern)
          .then(function(gzippedFiles) {
            self.log('gzipped ' + gzippedFiles.length + ' files ok');
            return { gzippedFiles: gzippedFiles };
          })
          .catch(this._errorMessage.bind(this));
      },
      _gzipFiles: function(distDir, distFiles, filePattern) {
        var filesToGzip = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));
        return Promise.map(filesToGzip, this._gzipFileInPlace.bind(this, distDir));
      },
      _gzipFileInPlace: function(distDir, filePath) {
        var self = this;
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
          self.log('✔  ' + filePath);
          return filePath;
        });
      },
      _errorMessage: function(error) {
        this.log(error, { color: 'red' });
        return Promise.reject(error);
      }
    });
    return new DeployPlugin();
  }
};
