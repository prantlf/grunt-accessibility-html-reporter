'use strict'

const fs = require('fs')
const path = require('path')

const objectValues = require('object.values')
if (!Object.values) {
  objectValues.shim()
}

function formatFile (file) {
  const messageLog = file.messageLog
  var returnedErrors = ''
  var returnedWarnings = ''
  var returnedNotices = ''
  var panelColor = ''

  for (var i = 0; i < messageLog.length; i++) {
    const message = messageLog[i]
    const heading = message.heading
    if (heading === 'WARNING') {
      panelColor = 'warning'
    } else if (heading === 'ERROR') {
      panelColor = 'danger'
    } else if (heading === 'NOTICE') {
      panelColor = 'primary'
    }

    const issue = message.issue
    const description = message.description.split('<').join('&lt;').split('"').join('&quot;')
    const element = message.element.node.split('<').join('&lt;').split('"').join('&quot;')
    var position = message.position
    const lineNumber = position.lineNumber
    const columnNumber = position.columnNumber + 1
    position = 'line: ' + lineNumber + ', column: ' + columnNumber
    const audio = description + ' (at line ' + lineNumber + ' and column ' + columnNumber + ', code ' + issue + ')'
    const entry =
      '<div class="panel panel-' + panelColor + '" tabindex="0" aria-label="' + audio + '">\n' +
        '<div class="panel-heading">' + issue + '</div>\n' +
        '<div class="panel-body">\n' +
          '<div class="message">' + description + '</div>\n' +
          '<pre><code>' + element + '</code></pre>\n' +
        '</div>\n' +
        '<div class="panel-footer text-sm"><span class="heading3" role="heading" aria-level="3">' + position + '</span></div>\n' +
      '</div>\n'

    if (heading === 'ERROR') {
      returnedErrors = returnedErrors + entry
    } else if (heading === 'WARNING') {
      returnedWarnings = returnedWarnings + entry
    } else if (heading === 'NOTICE') {
      returnedNotices = returnedNotices + entry
    }
  }

  const counters = file.counters
  const buttonMarkup =
      '<button class="btn btn-sm btn-danger">Errors <span class="badge">' + counters.error + '</span></button>' +
      '<button class="btn btn-sm btn-warning">Warnings <span class="badge">' + counters.warning + '</span></button>' +
      '<button class="btn btn-sm btn-primary">Notices <span class="badge">' + counters.notice + '</span></button>'

  const content =
      '    <div class="row page">\n' +
      '      <button type="button"><span class="heading2" role="heading" aria-level="2">' + file.name + '</span></button>' +
      '      <span class="buttons">' + buttonMarkup + '</span>\n' +
      '    </div>\n' +
      '    <div class="row report">' + returnedErrors + returnedWarnings + returnedNotices + '</div>\n'

  return content
}

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
    })

  const template = fs.readFileSync(
    path.join(__dirname, 'template.html'), 'utf8')

  const buttonMarkup =
      '<button class="btn btn-sm btn-danger">Errors <span class="badge">' + errorCount + '</span></button>' +
      '<button class="btn btn-sm btn-warning">Warnings <span class="badge">' + warningCount + '</span></button>' +
      '<button class="btn btn-sm btn-primary">Notices <span class="badge">' + noticeCount + '</span></button>'

  const messageFilter = 'Enter text to filter messages with'
  const firstOccurrence = 'Warn about the first occurrence only'
  const heading =
      '    <div class="row summary">\n' +
      '      <button type="button"><span class="heading1" role="heading" aria-level="1">HTML Accessibility Report</span></button>' +
      '      <span class="buttons">' + buttonMarkup + '</span>\n' +
      '    </div>\n' +
      '    <div class="row filters form-group">\n' +
      '      <input id="message-filter" type="text" class="form-control input-lg" placeholder="' + messageFilter + '">\n' +
      '      <label><input id="first-occurrences" type="checkbox" aria-checked="false" aria-label="' + firstOccurrence + '"> ' + firstOccurrence + '</label>\n' +
      '    </div>\n'

  const content = Object.values(results)
    .map(formatFile)
    .join('\n')

  return template.replace('<!-- Heading goes here -->', heading)
    .replace('<!-- Content goes here -->', content)
}
