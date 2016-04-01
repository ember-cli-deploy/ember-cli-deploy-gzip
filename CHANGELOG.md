# Changelog

## [0.2.3](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/0.2.3) (2016-04-01)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.2.2...0.2.3)

- Remove unused redis dependency [\#20](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/20) ([dannyfallon](https://github.com/dannyfallon))

## [0.2.2](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.2.2) (2016-02-26)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.2.1...v0.2.2)

- Add ignorePattern option for removing specific files [#18](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/18) ([@jrjohnson](https://github.com/jrjohnson))
- Fix the plugin return object for keep-enabled gzipping [#19](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/19) ([@dannyfallon/df](https://github.com/dannyfallon/df))

## [0.2.1](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.2.1) (2016-02-06)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.2.0...v0.2.1)

- Update ember-deploy-plugin version again

## [0.2.0](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.2.0) (2016-02-06)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.1.1...v0.2.0)

- Add the gzipped file to the context's distFiles when keep is true [\#17](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/17) ([dannyfallon](https://github.com/dannyfallon))
- Update ember-deploy-plugin version

## [v0.1.1](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.1.1) (2015-12-31)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.1.0...v0.1.1)

- Fix \#14: only compress uncompressed files [\#15](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/15) ([buschtoens](https://github.com/buschtoens))

## [v0.1.0](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.1.0) (2015-10-25)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.1.0-beta.2...v0.1.0)

- Update to use new verbose option for logging [\#13](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/13) ([lukemelia](https://github.com/lukemelia))

## [v0.1.0-beta.2](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.1.0-beta.2) (2015-10-19)
[Full Changelog](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/compare/v0.1.0-beta.1...v0.1.0-beta.2)

- Add keep option with tests [\#12](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/12) ([dschmidt](https://github.com/dschmidt))
- Revert "Add keep option" pending a fresh PR with tests [\#10](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/10) ([lukemelia](https://github.com/lukemelia))
- Add keep option [\#9](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/9) ([dschmidt](https://github.com/dschmidt))
- add ico to default filePattern [\#8](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/8) ([jasonkriss](https://github.com/jasonkriss))
- add swf to default filePattern [\#7](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/7) ([jasonkriss](https://github.com/jasonkriss))

## [v0.1.0-beta.1](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/tree/v0.1.0-beta.1) (2015-08-08)

- Update README for 0.5.0 [\#6](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/6) ([achambers](https://github.com/achambers))
- opt-in Zopfli and ember-cli-deploy-plugin bump [\#5](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/5) ([lukemelia](https://github.com/lukemelia))
- Removed debugger statement [\#4](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/4) ([achambers](https://github.com/achambers))
- Restructure to be based on ember-cli-deploy-plugin. [\#3](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/3) ([lukemelia](https://github.com/lukemelia))
- Use new `configure` hook instead of `willDeploy` [\#2](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/2) ([lukemelia](https://github.com/lukemelia))
- Fix issue where plugin can resolve its promise before the gzip stream is done writing [\#1](https://github.com/ember-cli-deploy/ember-cli-deploy-gzip/pull/1) ([lukemelia](https://github.com/lukemelia))
