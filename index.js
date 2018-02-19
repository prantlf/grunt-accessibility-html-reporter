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

    var element = message.element.node.split('<').join('&lt;')
    var position = message.position
    position = 'line: ' + position.lineNumber + ', column:' + (position.columnNumber + 1)
    var entry =
      '<div class="panel panel-' + panelColor + '">\n' +
        '<div class="panel-heading">' + message.issue + '</div>\n' +
        '<div class="panel-body">\n' +
          message.description + '<br><br>\n' +
          '<pre><code>' + element + '</code></pre>\n' +
        '</div>\n' +
        '<div class="panel-footer text-sm"><h4><small>' + position + '</small></h4></div>\n' +
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
  var buttonMarkup =
      '<button class="btn btn-sm btn-danger">Errors <span class="badge">' + counters.error + '</span></button>' +
      '<button class="btn btn-sm btn-warning">Warnings <span class="badge">' + counters.warning + '</span></button>' +
      '<button class="btn btn-sm btn-primary">Notices <span class="badge">' + counters.notice + '</span></button>'

  const url = file.name
  var content = returnedErrors + returnedWarnings + returnedNotices
  content =
      '    <div class="row">\n' +
      '      <a href="javascript:void(0)"><h2>' + url + '</h2></a>' +
      '      <span class="buttons">' + buttonMarkup + '</span>\n' +
      '    </div>\n' +
      '    <div class="row">' + content + '</div>\n'

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

  var template = fs.readFileSync(
    path.join(__dirname, 'template.html'), 'utf8')

  var buttonMarkup =
      '<button class="btn btn-sm btn-danger">Errors <span class="badge">' + errorCount + '</span></button>' +
      '<button class="btn btn-sm btn-warning">Warnings <span class="badge">' + warningCount + '</span></button>' +
      '<button class="btn btn-sm btn-primary">Notices <span class="badge">' + noticeCount + '</span></button>'

  var heading =
      '    <div class="row summary">\n' +
      '      <h1>HTML Accessibility Report</h1>' +
      '      <span class="buttons">' + buttonMarkup + '</span>\n' +
      '    </div>\n'

  var content = Object.values(results)
    .map(formatFile)
    .join('\n')

  return template.replace('<!-- Heading goes here -->', heading)
    .replace('<!-- Content goes here -->', content)
}
