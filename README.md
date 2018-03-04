# grunt-accessibility-html-reporter

[![NPM version](https://badge.fury.io/js/grunt-accessibility-html-reporter.png)](http://badge.fury.io/js/grunt-accessibility-html-reporter) [![Build Status](https://travis-ci.org/prantlf/grunt-accessibility-html-reporter.svg?branch=master)](https://travis-ci.org/prantlf/grunt-accessibility-html-reporter) [![Dependency Status](https://david-dm.org/prantlf/grunt-accessibility-html-reporter.svg)](https://david-dm.org/prantlf/grunt-accessibility-html-reporter) [![devDependency Status](https://david-dm.org/prantlf/grunt-accessibility-html-reporter/dev-status.svg)](https://david-dm.org/prantlf/grunt-accessibility-html-reporter#info=devDependencies) [![Greenkeeper badge](https://badges.greenkeeper.io/prantlf/grunt-accessibility-html-reporter.svg)](https://greenkeeper.io/) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![NPM Downloads](https://nodei.co/npm/grunt-accessibility-html-reporter.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-accessibility-html-reporter)

A custom reporter for [grunt-accessibility] - the HTML accessibility checking task - which formats the validation results to HTML. There is a Grunt task available for converting already written report files, which uses this reporter - [grunt-accessibility-html-report-converter].

**Notice**: This project contained the Grunt task for the report format conversion in the version 0.0.1. If you look for this Grunt task, upgrade your project to depend on [grunt-accessibility-html-report-converter], which cartries on providing the original functionality.

## Installation

The reporter is usually installed and used together with other development tasks:

```shell
$ npm install grunt-accessibility-html-reporter --save-dev
```

## Usage

You can use the reporter programmatically to process validation results as an object in JavaScript. For example, for converting a JSON report file to a HTML report file:

```js
const report = require('grunt-accessibility-html-reporter')
const input = fs.readFileSync('report.json', 'utf-8')
const results = JSON.parse(input)
const output = report(results, {
  showFileNameOnly: false
})
fs.writeFileSync('report.html', output, 'utf-8')
```

### Options

#### showFileNameOnly
Type: `Boolean`
Default value: `false`

Cuts the directory from tested HTML files, when creating page titles from in the report. If you use unique names for files alone, you will not get too long page titles, if you flip this flag tp `true`.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.

## Release History

 * 2018-03-05   v2.2.0   Allow generating page titles from file names without directory
 * 2018-03-04   v2.1.0   Add filtering and accessibility to the reports
 * 2018-03-01   v2.0.2   Add \<meta charset="utf-8"\> to the HTML report page
 * 2018-02-19   v2.0.0   Change the HTML format to look like Koa11y reports
 * 2018-02-19   v1.0.0   Change column numbers from zero-based to one-based
 * 2017-11-25   v0.1.1   Support Node.js < 7
 * 2017-11-25   v0.1.0   Converted to a pure reporter module; the Grunt task
                         moved to grunt-accessibility-html-report-converter
 * 2017-11-22   v0.0.1   Initial release

## License

Copyright (c) 2017-2018 Ferdinand Prantl

Licensed under the MIT license.

[node]: https://nodejs.org
[npm]: https://npmjs.org
[package.json]: https://docs.npmjs.com/files/package.json
[Grunt]: https://gruntjs.com
[Gruntfile]: https://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[grunt-accessibility]: https://github.com/yargalot/grunt-accessibility
[grunt-accessibility-html-report-converter]: https://github.com/prantlf/grunt-accessibility-html-report-converter
