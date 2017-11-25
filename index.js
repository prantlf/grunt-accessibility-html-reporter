'use strict'

const fs = require('fs')
const handlebars = require('handlebars')
const path = require('path')
const template = handlebars.compile(fs.readFileSync(
          path.join(__dirname, 'template.hbs'), 'utf-8'))

module.exports = function (results) {
  var errorCount = 0
  var warningCount = 0
  var noticeCount = 0

  Object.keys(results)
        .forEach(function (name) {
          const file = results[name]
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

  return template({
    files: Object.values(results),
    errorCount: errorCount,
    warningCount: warningCount,
    noticeCount: noticeCount
  })
}
