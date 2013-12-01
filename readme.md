# feed-discover
feed-discover is a module for automatic RSS/Atom feed discovery. It exposes a transform stream that reads in HTML and writes out feed URLs.

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
var request = require('hyperquest')
var discover = require('feed-discover')

var url = 'http://some-site.com'

request(url)
  .pipe(discover(url))
  .on('data', function(feed) {
    // http://some-site.com/rss.xml
  })
```

API
``` 
feed-discover(
  
  url (string):
    the address used to resolve absolute paths.
    eg. /path/to/feed -> http://some-site.com/path/to/feed

)
```

### License
[MIT](http://opensource.org/licenses/MIT)
