import { homedir } from 'os'
import * as fsprom from 'fs/promises'
import * as path from 'path'

/*
export function envPrefix (options) {
  const appName = options?.appName || 'app'
  const env = appName.toUpperCase() + '_CONFIG'
  // console.log({env})
  return env
}
*/

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
  const s = options.configName || options.env.config || 'main'
  if (s.endsWith('.json')) return s

  const home = homedir()
  // some question about whether to have this "config-state" segment
  // here, but there might be a lot of them, and you might actually
  // have other stuff in this dir that you want managed differently.
  const filename = path.join(home, '.config', options.appName, 'config-state', s) + '.json'
  return filename
}

export async function loadConfig (options = {}) {
  if (!options.appName) options.appName = 'app'
  if (!options.env) options.env = ourEnv(options)
  
  const filename = configFilename(options)
  const env = ourEnv(options)
  let text
  let create
  try {
    text = await fsprom.readFile(filename, 'utf8')
  } catch (e) {
    if (e.code === 'ENOENT') {
      const dirname = path.dirname(filename)
      await fsprom.mkdir(dirname, { recursive: true, mode: 0o700 })
      create = true
    } else {
      throw e
    }
  }

  const obj = {...(options?.initialConfig || {})}

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
  obj.save = async () => {
    const o2 = { ...obj }
    delete o2.configLocation
    delete o2.save
    for (const [k, v] of Object.entries(options.env)) {
      // if the value is just what was in env, then DONT save it
      if (o2[k] === v) delete o2[k]
    }
    await fsprom.writeFile(obj.configLocation, JSON.stringify(o2, null, 2) + '\n')
  }

  if (create) await obj.save()

  // console.log('config %O', obj)
  return obj
}

/*
export async function saveConfig (obj) {
  if (!obj.configLocation) throw Error('invalid config object')
  const o2 = { ...obj }
  delete o2.configLocation
  await fsprom.writeFile(obj.configLocation, JSON.stringify(o2, null, 2) + '\n')
}
*/
