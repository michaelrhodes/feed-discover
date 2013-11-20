var run = require('tape').test
var concat = require('concat-stream')
var discover = require('../')

run('it works', function(test) {
  test.plan(4)

  var sites = [
    'http://michaelrhod.es',
    'substack.net', 
    'javascriptjabber.com',
    'https://tent.io/blog'
  ]

  var expected = [
    'http://michaelrhod.es/rss\n',
    'http://substack.net/blog.xml\n',
    'http://feeds.feedburner.com/JavascriptJabber\n' +
    'http://javascriptjabber.com/feed/\n' +
    'http://javascriptjabber.com/comments/feed/\n',
    'https://tent.io/blog.xml\n'
  ]

  sites.forEach(function(site, i) { 
    discover(site).pipe(concat(function(feeds) {
      test.equal(feeds.toString(), expected[i], sites[i])
    }))
  })
})
