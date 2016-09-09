var url = require('url')
var util = require('util')
var Parser = require('htmlparser2').Parser
var Transform = require('stream').Transform

function Discover(path) {
  if (!(this instanceof Discover)) {
    return new Discover(path);
  }

  Transform.call(this);

  this.baseUrl = path
  this.urlList = []

  this._initParser()
}

util.inherits(Discover, Transform);

Discover.prototype._initParser = function() {
  var self = this;

  this.parser = new Parser({
    'onopentag': function(name, attrs) {
      if (name == 'link' &&
          attrs &&
          attrs.type &&
          attrs.type.match(/(rss|atom)/) &&
          attrs.href) {
        self._emitFeed(attrs.href)
      }

      if (name == 'a' &&
          attrs &&
          attrs.href &&
          attrs.href.match(/feedburner/)) {
        self._emitFeed(attrs.href)
      }
    }
  })
}

Discover.prototype._emitFeed = function(href) {
  var feedUrl = url.resolve(this.baseUrl, href)

  if (this.urlList.indexOf(feedUrl) < 0) {
    this.urlList.push(feedUrl)
    this.push(feedUrl)
  }
}

Discover.prototype._transform = function(chunk, encoding, next) {
  this.parser.write(chunk)
  next()
}

module.exports = Discover
