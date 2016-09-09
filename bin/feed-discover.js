#!/usr/bin/env node

var discover = require('../')
var parse = require('url').parse
var request = require('request')
var stream = require('as-stream')
var valid = require('is-url')

var sanitise = function(url) {
  if (!url) {
    return null
  }

  var has = parse(url)

  if (!has.protocol) {
    url = 'http://' + url
  }

  if (!valid(url)) {
    return null
  }

  return url
}

var write = function(url) {
  console.log(url.toString())
}

var fail = function(error) {
  var https = /^https/.test(url)
  var message = (
    error.code === 'ENOTFOUND' ?
      url + ' doesn’t seem to exist.' :

    error.code === 'ECONNREFUSED' ?
    'The connection was refused.' +
    (https ? ' Maybe try regular old http.' : '') :

    'S̵om̴e̷͢t͏̧h̨i͟n͢͢ģ͜ ̢͟w̴̴e̵͟͝nt̛͡͝ ̧͠h̕͏o̷rríbĺ͘y̶̨ w̵̴̨ŗo̢͏n̴̸͠g̷…͠'
  )

  console.error(message)
  process.exit(1)
}

var url = sanitise(process.argv[2])

if (!url) {
  console.log('Usage: feed-discover <url>')
  process.exit(1)
}

request(url, function(error, response, body) {
  var shouldFail = response.statusCode >= 400

  if (!error && shouldFail) {
    error = new Error
    error.code = 'ENOTFOUND'
  }

  if (error) {
    fail(error)
    return
  }

  stream(body)
    .pipe(discover(url))
    .on('data', write)
})
