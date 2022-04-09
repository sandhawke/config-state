import { loadConfig } from 'config-state'

const config = loadConfig('myapp1')
config.runCount = (config.runCount || 0) + 1
config.save()

console.log('This program has been run %d times', config.runCount)
