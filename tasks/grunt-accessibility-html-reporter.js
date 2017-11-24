'use strict'

const fs = require('fs')
const handlebars = require('handlebars')
const path = require('path')
const mkdirp = require('mkdirp')

function convertReport (input) {
  const files = JSON.parse(input)
  var errorCount = 0
  var warningCount = 0
  var noticeCount = 0

  Object.keys(files)
        .forEach(function (name) {
          const file = files[name]
          file.name = name

          const counters = file.counters
          errorCount += counters.error
          warningCount += counters.warning
          noticeCount += counters.notice

          const issues = file.messageLog
          file.errors = issues.filter(function (issue) {
            return issue.heading === 'ERROR'
          })
          file.warnings = issues.filter(function (issue) {
            return issue.heading === 'WARNING'
          })
          file.notices = issues.filter(function (issue) {
            return issue.heading === 'NOTICE'
          })
          delete file.messageLog
        })

  return {
    files: Object.values(files),
    errorCount: errorCount,
    warningCount: warningCount,
    noticeCount: noticeCount
  }
}

module.exports = function (grunt) {
  const template = handlebars.compile(fs.readFileSync(
            path.join(__dirname, 'template.hbs'), 'utf-8'))
  grunt.registerMultiTask('accessibility-html-reporter',
      'Converts the JSON report of the grunt-accessibility task to HTML.',
      function () {
        const data = this.data
        const output = data.output
        const options = this.options({
          force: false
        })

        try {
          const input = convertReport(fs.readFileSync(data.input, 'utf-8'))
          mkdirp.sync(path.dirname(output))
          fs.writeFileSync(output, template(input), 'utf-8')
        } catch (error) {
          grunt.verbose.error(error.stack)
          grunt.log.error(error)
          const warn = options.force ? grunt.log.warn : grunt.fail.warn
          warn('Converting the accessibility report failed.')
        }
      })
}
