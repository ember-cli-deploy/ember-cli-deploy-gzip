'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var assert  = require('ember-cli/tests/helpers/assert');
var fs  = require('fs');
var path  = require('path');
var rimraf  = Promise.denodeify(require('rimraf'));

describe('gzip plugin', function() {
  var subject;

  before(function() {
    subject = require('../../index');
  });

  it('has a name', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(result.name, 'test-plugin');
  });

  it('implements the correct hooks', function() {
    var result = subject.createDeployPlugin({
      name: 'test-plugin'
    });

    assert.equal(typeof result.willDeploy, 'function');
    assert.equal(typeof result.willUpload, 'function');
  });

  describe('willDeploy hook', function() {
    it('resolves if config is ok', function() {
      var plugin = subject.createDeployPlugin({
        name: 'redis'
      });

      var context = {
        deployment: {
          ui: { write: function() {}, writeLine: function() {} },
          config: {
            redis: {
              host: 'somehost',
              port: 1234
            }
          }
        }
      };

      return assert.isFulfilled(plugin.willDeploy.call(plugin, context))
    });
  });

  describe('willUpload hook', function() {
    var plugin;
    var context;

    beforeEach(function() {
      plugin = subject.createDeployPlugin({
        name: 'gzip'
      });

      context = {
        distDir: 'tmp/test-dist',
        distFiles: [
          'assets/foo.js',
          'assets/bar.notjs',
        ],
        deployment: {
          ui: { write: function() {} },
          project: { name: function() { return 'test-project'; } },
          config: {
            gzip: {
              filePattern: '**/*.js'
            }
          }
        }
      };
      if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp'); }
      if (!fs.existsSync(context.distDir)) { fs.mkdirSync(context.distDir); }
      if (!fs.existsSync(path.join(context.distDir, 'assets'))) { fs.mkdirSync(path.join(context.distDir, 'assets')); }
      fs.writeFileSync(path.join(context.distDir, context.distFiles[0]), 'alert("Hello foo world!");', 'utf8');
      fs.writeFileSync(path.join(context.distDir, context.distFiles[1]), 'alert("Hello bar world!");', 'utf8');
    });

    afterEach(function(){
      return rimraf(context.distDir);
    });

    it('gzips the matching files', function(done) {
      return assert.isFulfilled(plugin.willUpload.call(plugin, context))
        .then(function(result) {
          assert.deepEqual(result, { gzippedFiles: ['assets/foo.js'] });
          done();
        }).catch(function(reason){
          console.log(reason.actual.stack);
          done(reason);
        });
    });
  });
});
