// @ts-nocheck
import { beforeAll } from 'bun:test'
import { JSDOM } from 'jsdom'

beforeAll(() => {
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable',
  })

  global.window = dom.window
  global.document = dom.window.document
  global.navigator = dom.window.navigator
  global.HTMLElement = dom.window.HTMLElement
  global.Text = dom.window.Text
  global.Element = dom.window.Element
  global.Node = dom.window.Node
  global.DocumentFragment = dom.window.DocumentFragment
  global.Event = dom.window.Event
  global.CustomEvent = dom.window.CustomEvent
  global.MutationObserver = dom.window.MutationObserver
  global.requestAnimationFrame = dom.window.requestAnimationFrame
  global.cancelAnimationFrame = dom.window.cancelAnimationFrame
  global.setTimeout = dom.window.setTimeout
  global.clearTimeout = dom.window.clearTimeout
  global.setInterval = dom.window.setInterval
  global.clearInterval = dom.window.clearInterval

  // Mock React testing environment
  global.IS_REACT_ACT_ENVIRONMENT = true
})
