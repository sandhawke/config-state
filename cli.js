#!/usr/bin/env node

import {words} from 'clopt'
import {loadConfig} from './index.js'

const [appName, op, field, value] = words

if (!appName) usage()

const config = await loadConfig(appName)

switch (op) {
case 'get':
  console.log('config.%s = %o', field, config[field])
  break
case undefined:
case 'list':
  console.log('%O', config)
  break
case 'set':
  console.log('was config.%s = %o', field, config[field])
  config[field] = value
  await config.save()
  console.log('now config.%s = %o', field, config[field])
  break
default:
  usage()
}

function usage () {
    console.error(`usage: config-state <app> <op> [field] [value]

app is your app name, .config/__here__

op is "get", "set", "list", ...
`)
  process.exit(1)
}
