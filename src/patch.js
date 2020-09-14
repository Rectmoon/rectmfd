import { loadApp } from './main'

const REGEX_EVENTS_NAME = /^(hashchange|popstate)$/i
const routeEvents = ['hashchange', 'popstate']
const eventsPool = {
  hashchange: [],
  popstate: []
}

const reroute = function () {
  console.log('reroute')
  loadApp()
}

Function.prototype.after = function (fn) {
  const z = this
  return function (...args) {
    const result = z.apply(this, args)
    fn.apply(this, args)
    return result
  }
}

const rerouteCallback = state => {
  new PopStateEvent('popstate', { state })
  reroute()
}

window.history.pushState = window.history.pushState.after(rerouteCallback)
window.history.replaceState = window.history.replaceState.after(rerouteCallback)

const originalAddEventListener = window.addEventListener
const originalRemoveEventListener = window.removeEventListener

window.addEventListener = function (eventName, handler) {
  if (
    eventName &&
    REGEX_EVENTS_NAME.test(eventName) &&
    typeof handler === 'function'
  ) {
    eventsPool[eventName].indexOf(handler) === -1 &&
      eventsPool[eventName].push(handler)
  }
  originalAddEventListener.apply(this, arguments)
}

window.removeEventListener = function (eventName, handler) {
  if (eventName && REGEX_EVENTS_NAME.test(eventName)) {
    eventsPool[eventName].indexOf(handler) > -1 &&
      (eventsPool[eventName] = eventsList.filter(fn => fn !== handler))
  }
  originalRemoveEventListener.apply(this, arguments)
}

routeEvents.forEach(eventName => window.addEventListener(eventName, reroute))

export function callCapturedEvents (eventArgs) {
  if (!eventArgs) return
  if (!Array.isArray(eventArgs)) eventArgs = [eventArgs]

  const name = eventArgs[0].type

  if (!REGEX_EVENTS_NAME.test(name)) return
  eventsPool[name].forEach(handler => handler.apply(window, eventArgs))
}
