'use strict'

const fs = require('fs')
const path = require('path')
const report = require('..')
const test = require('tap')

test.test('module exports a function', test => {
  test.equal(typeof report, 'function')
  test.end()
})

test.test('transforms JSON object to string in HTML format', test => {
  const file = path.join(__dirname, 'results', 'report.json')
  const results = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const expected = fs.readFileSync(path.join(__dirname, 'results',
    'full-path.html'), 'utf-8')
  const actual = report(results)
  test.equal(typeof actual, 'string')
  test.equal(expected, actual)
  test.end()
})

test.test('optionally generates page titles from file names without directory', test => {
  const file = path.join(__dirname, 'results', 'report.json')
  const results = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const expected = fs.readFileSync(path.join(__dirname, 'results',
    'name-only.html'), 'utf-8')
  const actual = report(results, {
    showFileNameOnly: true
  })
  test.equal(typeof actual, 'string')
  test.equal(expected, actual)
  test.end()
})
