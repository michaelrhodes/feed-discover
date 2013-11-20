# feed-discover
feed-discover is a module for the automatically discovery of RSS/Atom feeds.

[![Build status](https://travis-ci.org/michaelrhodes/feed-discover.png?branch=master)](https://travis-ci.org/michaelrhodes/feed-discover)

## Install
``` sh
$ npm install [-g] feed-discover
```

### Usage
#### cli
``` sh
$ feed-discover http://some-site.com
```

#### module
``` js
var split = require('split')
var discover = require('feed-discover')

var url = 'http://some-site.com'

discover(url)
  .pipe(split())
  .on('data', function(feed) {
    // http://some-site.com/rss.xml
  })
```

### License
[MIT](http://opensource.org/licenses/MIT)
