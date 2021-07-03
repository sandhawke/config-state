/* eslint-env jest */
import * as my from '.'
import Debug from 'debug'
import { configFilename, loadConfig, saveConfig } from '.'
import { homedir } from 'os'
import { file } from 'tmp-promise'

const debug = new Debug('config-state/test')

test.only('filename', () => {
  expect(configFilename()).toBe(homedir() + '/.config/site/configs/main.json', {appName: 'site'})
})

test('filename env file', () => {
  process.env.SITE_CONFIG = 'foo.json'
  expect(configFilename()).toBe('foo.json')
})

test('filename env config', () => {
  process.env.SITE_CONFIG = 'foo'
  expect(configFilename()).toBe(homedir() + '/.config/site/configs/foo.json')
})

test('filename option', () => {
  expect(configFilename({ config: 'foo' })).toBe(
    homedir() + '/.config/site/configs/foo.json')
})

test('load blank, save, reload', async () => {
  const { path, cleanup } = await file({ postfix: '.json' })
  const p = await loadConfig({ config: path })
  expect(p).toEqual({
    pwd: 'https://writable.site/',
    configLocation: path
  })
  p.x = 100
  await saveConfig(p)
  p.x = 200

  const p2 = await loadConfig({ config: path })
  expect(p2).toEqual({
    pwd: 'https://writable.site/',
    configLocation: path,
    x: 100
  })

  await cleanup()
})
