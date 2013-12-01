#!/usr/bin/env node

var discover = require('../')
var parse = require('url').parse
var request = require('request')
var stream = require('as-stream')

var protocolify = function(partial) {
  var has = parse(partial)
  return (!has.protocol ? 
    'http://' + partial : partial
  )
}

var url = protocolify(process.argv[2])
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
  process.stderr.write(
    message + '\n'
  )
}
var write = function(feed) {
  process.stdout.write(
    feed + '\n'
  )
}

return request(url, function(error, response, body) {
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
