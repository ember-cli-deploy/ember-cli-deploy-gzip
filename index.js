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
    var fs = require('fs');

    var DeployPlugin = DeployPluginBase.extend({
      name: options.name,
      defaultConfig: {
        filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2}',
        zopfli: false,
        keep: false,
        distDir: function(context){
          return context.distDir;
        },
        distFiles: function(context){
          return context.distFiles;
        }
      },

      configure: function(context) {
        this._super.configure.call(this, context);
        if (this.readConfig('zopfli')) {
          this.log("Using zopfli for compression")
          this.gzipLibrary = this.project.require('node-zopfli');
        } else {
          this.gzipLibrary = require('zlib');
        }
      },

      willUpload: function(context) {
        var self = this;

        var filePattern  = this.readConfig('filePattern');
        var distDir      = this.readConfig('distDir');
        var distFiles    = this.readConfig('distFiles') || [];
        var keep         = this.readConfig('keep');

        this.log('gzipping `' + filePattern + '`');
        return this._gzipFiles(distDir, distFiles, filePattern, keep)
          .then(function(gzippedFiles) {
            self.log('gzipped ' + gzippedFiles.length + ' files ok');
            return { gzippedFiles: gzippedFiles };
          })
          .catch(this._errorMessage.bind(this));
      },
      _gzipFiles: function(distDir, distFiles, filePattern, keep) {
        var filesToGzip = distFiles.filter(minimatch.filter(filePattern, { matchBase: true }));
        return Promise.map(filesToGzip, this._gzipFile.bind(this, distDir, keep));
      },
      _gzipFile: function(distDir, keep, filePath) {
        var self = this;
        var fullPath = path.join(distDir, filePath);
        var outFilePath = fullPath + '.gz';
        return new Promise(function(resolve, reject) {
          var gzip = self.gzipLibrary.createGzip({ format: 'gzip' });
          var inp = fs.createReadStream(fullPath);
          var out = fs.createWriteStream(outFilePath);

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
          if(!keep) {
            outFilePath = fullPath;
            return renameFile(fullPath + '.gz', fullPath);
          }
        }).then(function(){
          self.log('✔  ' + outFilePath);

          return outFilePath;
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
