var run = require('tape').test
var request = require('request')
var concat = require('concat-stream')
var discover = require('../')

run('it works', function(test) {
  var sites = [
    'http://substack.net', 
    'https://tent.io',
    'http://0x8890.com',
  ]

  var expected = [
    'http://substack.net/blog.xml',
    'https://tent.io/blog.xml',
    'http://0x8890.com/feed.xml'
  ]

  test.plan(sites.length)

  sites.forEach(function(site, i) { 
    request(site)
      .pipe(discover(site))
      .pipe(concat(function(feeds) {
        test.equal(
          feeds.toString(), expected[i],
          'for ' + sites[i]
        )
      }))
  })
})
