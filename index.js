import { homedir } from 'os'
import * as fs from 'fs'
import * as path from 'path'
import dbg from 'debug'

const debug = dbg('config-state')

export function ourEnv (options) {
  const prefix = options.appName.toUpperCase() + '_'
  const e = {}
  for (const [k, v] of Object.entries(process.env)) {
    // console.log('%o %o %o', prefix, k, v)
    if (k.startsWith(prefix)) {
      // grrrr, I really don't want to be case sensitive, but
      // I don't want to have to make a proxy object, so let's
      // just keep all 3 case versions.
      const k2 = k.slice(prefix.length).toLowerCase()
      e[k2] = v
      const k3 = k.slice(prefix.length).toUpperCase()
      e[k3] = v
      const k4 = k.slice(prefix.length)
      e[k4] = v
    }
  }
  // console.log({e})
  return e
}

export function configFilename (options) {
  if (options.configFile) return options.configFile
  if (options.env.configfile) return options.env.configfile
  const s = options.configName || options.env.config || 'state'
  if (s.endsWith('.json')) return s

  const home = homedir()
  const filename = path.join(home, '.config', options.appName, s) + '.json'
  return filename
}

export function loadConfig (options = {}) {
  if (typeof options === 'string') options = { appName: options }
  if (process.env.CONFIG_STATE_APPNAME) {
    options.appName = process.env.CONFIG_STATE_APPNAME
  }
  // Maybe also APPNAME??
  
  if (!options.appName) throw Error('config-state appname not provided')

  if (!options.env) options.env = ourEnv(options)

  const filename = configFilename(options)
  const env = options.env
  let text
  let create
  let stats
  try {
    text = fs.readFileSync(filename, 'utf8')
    stats = fs.statSync(filename)
    debug('loaded from', filename)
  } catch (e) {
    if (e.code === 'ENOENT') {
      const dirname = path.dirname(filename)
      fs.mkdirSync(dirname, { recursive: true, mode: 0o700 })
      debug('mkdir', dirname)
      create = true
    } else {
      throw e
    }
  }
  if (stats) {
    if (stats.mode & 0o77) {
      throw Error(`file ${filename} has too lax permissions`)
    }
  }

  const obj = { ...(options?.initialConfig || {}) }

  if (text) {
    try {
      const j = JSON.parse(text)
      Object.assign(obj, j)
    } catch (e) {
      throw Error('Corrupt config: ' + filename)
    }
  }

  Object.assign(obj, env)

  obj.configLocation = filename

  // this way, or saveConfig ??
  //
  // also this is a pretty poor way to do it -- deleting stuff.
  // Maybe we could use object inheritance or something.
  obj.save = () => {
    const o2 = { ...obj }
    delete o2.configLocation
    delete o2.save
    for (const [k, v] of Object.entries(options.env)) {
      // if the value is just what was in env, then DONT save it
      if (o2[k] === v) delete o2[k]
    }
    fs.writeFileSync(obj.configLocation, JSON.stringify(o2, null, 2) + '\n')
    debug('wrote', filename)
  }

  if (create) {
    debug('creating', filename)
    obj.save()
    fs.chmodSync(filename, 0o600)
  }

  // console.log('config %O', obj)
  return obj
}
