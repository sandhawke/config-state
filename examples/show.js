import { loadConfig } from 'config-state'

// has to be run with CONFIG_STATE_APPNAME=something
// since this code doesn't provide one

const config = loadConfig()

console.log('Config is %O', config)
