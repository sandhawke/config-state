/* eslint-env jest */
import * as my from './jsonpath.js'

test('basics', () => {
  const x = {}
  my.set(x, 'a', 1)
  expect(x).toEqual({a:1})
  expect(() => {my.set(x, 'a.b', 1)}).toThrow()
  
  my.set(x, 'd.e.f', 2)
  expect(x).toEqual({ a: 1, d: { e: { f: 2 } } })
  expect(my.get(x, 'd.e.f')).toBe(2)
  // console.log(x)
})

test('array? sort of!', () => {
  const x = [0,1,2,[10, 20, 30],4,5,6]
  my.set(x, '3.1', 1)
  expect(x).toEqual([ 0, 1, 2, [ 10, 1, 30 ], 4, 5, 6 ])
  my.set(x, '3.+', 100)
  my.set(x, '3.+', 200)
  expect(x).toEqual([ 0, 1, 2, [ 10, 1, 30, 100, 200 ], 4, 5, 6 ])
  // console.log(x)
})
