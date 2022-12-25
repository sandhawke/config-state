#!/usr/bin/env node

import { words, options } from 'clopt'
import { loadConfig } from './index.js'
import { get, set } from './jsonpath.js'

let appName = options.app || process.env.CONFIG_STATE_APPNAME
const [op, key, value] = words

if (!appName) usage()

const config = loadConfig(appName)

let was
if (key) was = get(config, key)

switch (op) {
case 'get':
  if (options.json) {
    console.log(JSON.stringify(was))
  } else {
    console.log('config.%s = %o', key, was)
  }
  break
case undefined:
case 'list':
  console.log('%s', JSON.stringify(config, null, 2))
  break
case 'set':
  console.log('was config.%s = %o', key, was, {value})
  set(config, key, value)
  config.save()
  console.log('now config.%s = %o', key, get(config, key))
  break
default:
  usage()
}

function usage () {
  console.error(`usage: config-state [--app <appname>] <op> [field] [value]

ops: get, set, list (default)

--app may be omited if CONFIG_STATE_APPNAME is set
`)
  process.exit(1)
}
