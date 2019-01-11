var run = require('tape').test
var request = require('request')
var concat = require('concat-stream')
var discover = require('../')

run('it works', function(test) {
  var sites = [
    'https://www.abc.net.au',
    'https://daily.bandcamp.com',
  ]

  var expected = [
    'https://www.abc.net.au/homepage/rss.xml',
    'https://daily.bandcamp.com/feed/https://daily.bandcamp.com/comments/feed/'
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
