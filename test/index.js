var run = require('tape').test
var request = require('hyperquest')
var concat = require('concat-stream')
var discover = require('../')

run('it works', function(test) {
  test.plan(4)

  var sites = [
    'http://michaelrhod.es',
    'http://substack.net', 
    'http://javascriptjabber.com',
    'https://tent.io/blog'
  ]

  var expected = [
    'http://michaelrhod.es/rss',
    'http://substack.net/blog.xml',
    'http://feeds.feedburner.com/JavascriptJabber' +
    'http://javascriptjabber.com/feed/' +
    'http://javascriptjabber.com/comments/feed/',
    'https://tent.io/blog.xml'
  ]

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
