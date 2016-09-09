'use strict'

const url = require('url')
const Parser = require('htmlparser2').Parser
const Transform = require('stream').Transform

class Discover extends Transform {
  constructor(path) {
    super()

    this.baseUrl = path
    this.urlList = []

    this._initParser()
  }

  _initParser() {
    this.parser = new Parser({
      'onopentag': (name, attrs) => {
        if (name == 'link' &&
            attrs &&
            attrs.type &&
            attrs.type.match(/(rss|atom)/) &&
            attrs.href) {
          this._emitFeed(attrs.href)
        }

        if (name == 'a' &&
            attrs &&
            attrs.href &&
            attrs.href.match(/feedburner/)) {
          this._emitFeed(attrs.href)
        }
      }
    })
  }

  _emitFeed(href) {
    let feedUrl = url.resolve(this.baseUrl, href)

    if (this.urlList.indexOf(feedUrl) < 0) {
      this.urlList.push(feedUrl)
      this.push(feedUrl)
    }
  }

  _transform(chunk, encoding, next) {
    this.parser.write(chunk)
    next()
  }
}

module.exports = function(path) {
  return new Discover(path)
}
