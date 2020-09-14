const rectmfd = require('../lib')
// import * as rectmfd from '../es'
// window.rectmfd = require('../dist/rectmfd')

rectmfd.registerApp(
  'http://localhost:8889',
  location => location.pathname === '/subapp1'
)

rectmfd.registerApp(
  'http://localhost:8890',
  location => location.pathname === '/subapp2'
)

rectmfd.loadApp()
