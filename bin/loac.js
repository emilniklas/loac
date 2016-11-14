#!/usr/bin/env node

const { Compilation } = require('..')
const { readFileSync } = require('fs')

require('yargs')
  .usage('loac <cmd> [args]')
  .command('compile <file>', 'Compile a file', {}, ({ file }) => {
    try {
      console.log(
        Compilation.from(file, readFileSync(file).toString())
          .toErlang()
      )
    } catch (e) {
      console.error(e.stack)
      process.exit(1)
    }
  })
  .help()
  .argv
