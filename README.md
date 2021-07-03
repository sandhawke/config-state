# config-state
[![NPM version][npm-image]][npm-url]

Manage node.js app configs in JSON with write-back and multiple configs per app.

Settings can also come from environment variables, but those settings
are not written back to the config files.

```js
import {loadConfig} from 'config-state'

const appName = 'run_count'

async function main () {
  const c = await loadConfig({appName})
  c.runCount = (c.runCount || 0) + 1
  await c.save()
  console.log(c)
}

main()
```

Simple use:

```terminal
$ node example/run-count.js
{
  configLocation: '/home/sandro/.config/run_count/config-state/main.json',
  save: [AsyncFunction (anonymous)],
  runCount: 1
}
$ cat /home/sandro/.config/run_count/config-state/main.json
{
  "runCount": 1
}
$ node example/run-count.js
{
  runCount: 2,
  configLocation: '/home/sandro/.config/run_count/config-state/main.json',
  save: [AsyncFunction (anonymous)]
}
$ cat /home/sandro/.config/run_count/config-state/main.json
{
  "runCount": 2
}
```

Use an alternative config by name:

```terminal
$ RUN_COUNT_CONFIG=beta node example/run-count.js
{
  config: 'beta',
  CONFIG: 'beta',
  configLocation: '/home/sandro/.config/run_count/config-state/beta.json',
  save: [AsyncFunction (anonymous)],
  runCount: 1
}
$ cat /home/sandro/.config/run_count/config-state/beta.json
{
  "runCount": 1
}
$ RUN_COUNT_CONFIG=beta node example/run-count.js
{
  runCount: 2,
  config: 'beta',
  CONFIG: 'beta',
  configLocation: '/home/sandro/.config/run_count/config-state/beta.json',
  save: [AsyncFunction (anonymous)]
}
$ cat /home/sandro/.config/run_count/config-state/beta.json
{
  "runCount": 2
}
$ 
```

Also

```terminal
$ RUN_COUNT_CONFIG=some-file.json node example/run-count.js
{
  config: 'some-file.json',
  CONFIG: 'some-file.json',
  configLocation: 'some-file.json',
  save: [AsyncFunction (anonymous)],
  runCount: 1
}
```

### Options

* appName, the directory under .config we should be using.  If you let
  it default to 'app', you better pick really good & distinct key
  names (or provide configName as a json file)

* configName (env CONFIG), either the name of the config for this app
  *we're using, or* if it ends in ".json", the filename to
  *use. Defaults to 'main'.

* initialConfig a json-able object to use when there's no existing
  config.

[npm-image]: https://img.shields.io/npm/v/config-state.svg?style=flat-square
[npm-url]: https://npmjs.org/package/config-state
