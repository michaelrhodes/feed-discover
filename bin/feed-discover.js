#!/usr/bin/env node

var discover = require('../')
var parse = require('url').parse
var request = require('hyperquest')

var protocolify = function(partial) {
  var has = parse(partial)
  return (!has.protocol ? 
    'http://' + partial :
    partial
  )
}

var url = protocolify(process.argv[2])
var error = function(error) {
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

return request(url)
  .on('error', error)
  .pipe(discover(url))
  .on('data', write) 
