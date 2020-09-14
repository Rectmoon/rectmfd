const REGEX_CDN = /https?:\/\/([\w.]+\/?)\S*/
const Apps = []

export function registerApp (entry, activeRule) {
  Apps.push({
    entry,
    activeRule
  })
}

export function loadApp () {
  const shouldMountApp =
    Apps.find(app => app.activeRule(window.location)) || Apps[0]
  const { entry } = shouldMountApp

  fetch(entry)
    .then(response => response.text())
    .then(async text => {
      const dom = document.createElement('div')
      dom.innerHTML = text
      const subApp = document.querySelector('#sub-app-content')
      subApp.appendChild(dom)

      fetchStyles(entry, subApp, dom)
      fetchScripts(entry, subApp, dom)
    })
}

async function fetchStyles (entry, subApp, dom) {
  const styles = Array.from(dom.querySelectorAll('style'))
  const links = Array.from(dom.querySelectorAll('link')).filter(
    link => link.rel === 'stylesheet'
  )
  const stylesPromise = styles.map(style => Promise.resolve(style.innerText))
  const linksPromise = links.map(link => {
    const needEntryPath = !REGEX_CDN.test(
      link.href.replace(location.origin, '')
    )
    const linkUrl = `${needEntryPath ? entry : ''}${link.href}`.replace(
      location.origin,
      ''
    )
    return fetch(linkUrl).then(response => response.text())
  })

  const res = await Promise.all([...stylesPromise, ...linksPromise])

  if (res && res.length > 0) {
    res.forEach(item => {
      console.log(item)
      const style = document.createElement('style')
      style.innerHTML = item
      subApp.appendChild(style)
    })
  }
}

async function fetchScripts (entry, subApp, dom) {
  const scripts = Array.from(dom.querySelectorAll('script'))
  const promises = scripts.map(script => {
    if (script.src) {
      const needEntryPath = !REGEX_CDN.test(
        script.src.replace(location.origin, '')
      )
      const scriptUrl = `${needEntryPath ? entry : ''}${script.src}`.replace(
        location.origin,
        ''
      )
      return fetch(scriptUrl).then(response => response.text())
    }
    return Promise.resolve(script.textContent)
  })

  const res = await Promise.all(promises)

  if (res && res.length) {
    res.forEach(item => {
      const $script = document.createElement('script')
      $script.innerText = item
      subApp.appendChild($script)
    })
  }
}
