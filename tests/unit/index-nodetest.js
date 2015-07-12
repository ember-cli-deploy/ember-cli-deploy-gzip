'use strict';

var Promise = require('ember-cli/lib/ext/promise');
var assert  = require('ember-cli/tests/helpers/assert');
var fs  = require('fs');
var path  = require('path');
var rimraf  = Promise.denodeify(require('rimraf'));

describe('gzip plugin', function() {
  var subject, mockUi, config;

  beforeEach(function() {
    subject = require('../../index');
    mockUi = {
      messages: [],
      write: function() { },
      writeLine: function(message) {
        this.messages.push(message);
      }
    };
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

    assert.equal(typeof result.configure, 'function');
    assert.equal(typeof result.willUpload, 'function');
  });

  describe('configure hook', function() {
    var plugin, context;
    describe('without providing config', function () {
      beforeEach(function() {
        config = { };
        plugin = subject.createDeployPlugin({
          name: 'gzip'
        });
        context = {
          ui: mockUi,
          config: config
        };
        plugin.beforeHook(context);
      });
      it('warns about missing optional config', function() {
        plugin.configure(context);
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing config:\s.*, using default:\s/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);

        assert.equal(messages.length, 3);
      });

      it('adds default config to the config object', function() {
        plugin.configure(context);
        assert.isDefined(config.gzip.filePattern);
        assert.isDefined(config.gzip.distDir);
        assert.isDefined(config.gzip.distFiles);
      });
    });
    describe('with a filePattern, distDir, and distFiles provided', function () {
      beforeEach(function() {
        config = {
          gzip: {
            filePattern: '**/*.*',
            distDir: 'tmp/dist-deploy',
            distFiles: []
          }
        };
        plugin = subject.createDeployPlugin({
          name: 'gzip'
        });
        context = {
          ui: mockUi,
          config: config
        };
        plugin.beforeHook(context);
      });
      it('does not warn about missing optional config', function() {
        plugin.configure(context);
        var messages = mockUi.messages.reduce(function(previous, current) {
          if (/- Missing config:\s.*, using default:\s/.test(current)) {
            previous.push(current);
          }

          return previous;
        }, []);
        assert.equal(messages.length, 0);
      });
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
        ui: mockUi,
        project: { name: function() { return 'test-project'; } },
        config: {
          gzip: {
            filePattern: '**/*.js',
            distDir: function(context){ return context.distDir; },
            distFiles: function(context){ return context.distFiles; }
          }
        }
      };
      if (!fs.existsSync('tmp')) { fs.mkdirSync('tmp'); }
      if (!fs.existsSync(context.distDir)) { fs.mkdirSync(context.distDir); }
      if (!fs.existsSync(path.join(context.distDir, 'assets'))) { fs.mkdirSync(path.join(context.distDir, 'assets')); }
      fs.writeFileSync(path.join(context.distDir, context.distFiles[0]), 'alert("Hello foo world!");', 'utf8');
      fs.writeFileSync(path.join(context.distDir, context.distFiles[1]), 'alert("Hello bar world!");', 'utf8');
      plugin.beforeHook(context);
    });

    afterEach(function(){
      return rimraf(context.distDir);
    });

    it('gzips the matching files', function(done) {
      return assert.isFulfilled(plugin.willUpload(context))
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
