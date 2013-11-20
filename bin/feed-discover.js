#!/usr/bin/env node

var url = process.argv[2]
require('../')(url)
  .on('error', function(error) {
  
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
  })
  .pipe(process.stdout)
