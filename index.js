var url = require('url')
var util = require('util')
var stream = require('stream')
var cheerio = require('cheerio')
var request = require('hyperquest')

var protocolify = function(partial) {
  var has = url.parse(partial)
  return (!has.protocol ? 
    'http://' + partial :
    partial
  )
}

var Discover = function() {
  stream.Transform.call(this)
  this.unique = []
  this.dregs = ''
}

util.inherits(Discover, stream.Transform)

Discover.prototype.feeds = function(buffer) {
  var html = buffer.toString()
  var feeds = []
  var extract = function() {
    var feed = $(this).attr('href')
    feeds.push(feed)
  }
  
  if (this.dregs) {
    html = this.dregs + html
  }
  
  // Don't lose tags that were split apart
  // in the process of being streamed.
  var lines = html.split(/\n|\r/) 
  this.dregs = lines.slice(lines.length - 4).join('')

  var $ = cheerio.load(html)
  
  // Legit
  $('link[type*=rss]').each(extract)
  $('link[type*=atom]').each(extract)

  // Questionable
  $('a:contains(RSS)').each(extract)
  $('a[href*=feedburner]').each(extract)
  
  return feeds
}

Discover.prototype._transform = function(html, encoding, next) {
  this.feeds(html).forEach(function(feed) {
    if (this.unique.indexOf(feed) < 0) {
      this.unique.push(feed)
      this.push(feed + '\n')
    }
  }.bind(this))
  next()
}

module.exports = function(path) {
  var discover = new Discover

  request(protocolify(path))
    .pipe(discover)

  return discover
}
