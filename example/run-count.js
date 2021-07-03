import {loadConfig} from 'config-state'

const appName = 'run_count'

async function main () {
  const c = await loadConfig({appName})
  c.runCount = (c.runCount || 0) + 1
  await c.save()
  console.log(c)
}

main()
