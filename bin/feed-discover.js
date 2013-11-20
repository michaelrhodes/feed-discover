#!/usr/bin/env node

require('../')(process.argv[2])
  .pipe(process.stdout)
