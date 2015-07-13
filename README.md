# ember-cli-deploy-gzip

NOTE: This plugin targets ember-cli-deploy 0.5.0 and later. 0.5.0 is in development at this time.

This ember-cli-deploy plugin compresses files in-place using gzip compression.

This is helpful to prepare for upload to a asset host that expects files to be
pre-compressed.

## Installation

* `ember install ember-cli-deploy-gzip`

## ember-cli-deploy Hooks Implemented

* configure
* willUpload

## Configuration Options

### filePattern

Files matching this pattern will be gzipped.

_Default:_ "\*\*/\*.{js,css,png,gif,jpg,map,xml,txt,svg,eot,ttf,woff,woff2}"

### distDir

Directory where assets have been written to

_Default:_ the `distDir` property of the deployment context

### distFiles

The Array of built assets.

_Default:_ the `distFiles` property of the deployment context

## Prequisites

The default configuration of this plugin expects the deployment context to have `distDir` and `distFiles` properties. These are conveniently created by the [ember-cli-deploy-build](https://github.com/zapnito/ember-cli-deploy-build) plugin so will work out of the box if you are using that plugin.

## Plugins known to work well with this one

[ember-cli-deploy-build](https://github.com/zapnito/ember-cli-deploy-build)
[ember-cli-deploy-s3](https://github.com/zapnito/ember-cli-deploy-s3)

## Running Tests

* `npm test`
