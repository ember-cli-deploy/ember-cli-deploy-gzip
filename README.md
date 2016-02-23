# ember-cli-deploy-gzip

> An ember-cli-deploy plugin to compress files in-place using gzip compression

[![](https://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/plugins/ember-cli-deploy-gzip.svg)](http://ember-cli-deploy.github.io/ember-cli-deploy-version-badges/)

This plugin compresses files in-place using gzip compression. This is helpful to prepare for upload to an asset host that expects files to be pre-compressed.

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][1].

## Quick Start

To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][2] is installed and configured.

- Install this plugin

```bash
$ ember install ember-cli-deploy-gzip
```

- Run the pipeline

```bash
$ ember deploy
```

## Installation

Run the following command in your terminal:

```bash
ember install ember-cli-deploy-gzip
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][1].

- `configure`
- `willUpload`


## Configuration Options

For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][1].

### filePattern

Files matching this pattern will be gzipped.
Note: image files such as `.png`, `.jpg` and `.gif` should not be gzipped, as they already are compressed.

*Default:* `'\*\*/\*.{js,css,json,ico,map,xml,txt,svg,eot,ttf,woff,woff2}'`

### ignorePattern

Files matching this pattern will *not* be gzipped even if they match filePattern

*Default:* null

### distDir

The root directory where the files matching `filePattern` will be searched for. By default, this option will use the `distDir` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distDir`

### distFiles

The list of built project files. This option should be relative to `distDir` and should include the files that match `filePattern`. By default, this option will use the `distFiles` property of the deployment context, provided by [ember-cli-deploy-build][2].

*Default:* `context.distDir`

### zopfli

Use node-zopfli for compression (better than regular gzip compression, but slower).

If set to `true`, you will need to `npm install node-zopfli --save-dev` in your app.

*Default:* `false`

### keep

Keep original file and write compressed data to `originalFile.gz`

*Default:* `false`

## Prequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`      (provided by [ember-cli-deploy-build][2])
- `distFiles`    (provided by [ember-cli-deploy-build][2])

## Plugins known to work well with this one

[ember-cli-deploy-build][2]
[ember-cli-deploy-s3][3]

## Running Tests

- `npm test`

[1]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[2]: https://github.com/zapnito/ember-cli-deploy-build "ember-cli-deploy-build"
[3]: https://github.com/zapnito/ember-cli-deploy-s3 "ember-cli-deploy-s3"
