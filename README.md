# config-state
[![NPM version][npm-image]][npm-url]

Simple, unified, synchronous, read-write JSON configuration storage for node.js apps.

* Settings are stored in ~/.config/APPNAME/state.json by default
* Environment variables override settings, when present
* Permissions kept at 600, for bearer tokens and API keys
* Includes CLI `config-state`

```terminal
$ config-state myapp1
{
  "configLocation": "/home/sandro/.config/myapp1/state.json"
}
$ config-state myapp1 set maxWidth 100
was config.maxWidth = undefined
now config.maxWidth = 100
$ config-state myapp1 set color red
was config.color = undefined
now config.color = 'red'
$ config-state myapp1
{
  "maxWidth": 100,
  "color": "red",
  "configLocation": "/home/sandro/.config/myapp1/state.json"
}
$ cat /home/sandro/.config/myapp1/state.json
{
  "maxWidth": 100,
  "color": "red"
}
```

Very easy to use in your code:

```js
import {loadConfig} from 'config-state'

const config = loadConfig('myapp1')
config.runCount = (config.runCount || 0) + 1
config.save()

console.log('This program has been run %d times', config.runCount)
```

Simple use:

```terminal
$ node exampls/myapp1
This program has been run 1 times
$ node exampls/myapp1
This program has been run 3 times
$ node exampls/myapp1
This program has been run 3 times
$ config-state myapp1
{
  "maxWidth": 100,
  "color": "red",
  "runCount": 3,
  "configLocation": "/home/sandro/.config/myapp1/state.json"
}
```

Useful environment variables:
* DEBUG as usual
* MYAPP1_CONFIG defaults to "state"
* MYAPP1_CONFIGFILE defaults to ~/.config/$(appname)/$(config).json
* MYAPP1_FOO overrides 'foo' and 'FOO' in the config

Options to loadConfig:

* appName, the directory under .config
* configName (env appname_CONFIG), the name of the config for this app to use
* initialConfig a json-able object to use when there's no existing config.

Limitations:

* While values can be arbitrary JSON objects, the CLI doesn't provide any way to modify elements within values
* There's no locking done; concurrency could cause problems.

[npm-image]: https://img.shields.io/npm/v/config-state.svg?style=flat-square
[npm-url]: https://npmjs.org/package/config-state
