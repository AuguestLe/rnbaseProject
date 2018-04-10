const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export default function _fetch(url, options = {}, retry = 0) {
  const { noComplaints = false, ..._options } = options
  return fetch(url, _options)
    .then((response) => {
      if (response.ok !== true) {
        throw new Error(`HTTP ERROR CODE ${response.status} ${url}`)
      } else {
        return response
      }
    })
    .catch((e) => {
      if (e.message === 'HTTP ERROR CODE 401') {
        throw e
      }
      if (noComplaints === false) {
        // try {
        //   bugsnag.notify(e, (_report) => {
        //     const report = _report
        //     report.metadata.test = { url, options }
        //   })
        // } catch (ee) {
        //   bugsnag.notify(e)
        // }
      }
      if (retry > 0) {
        return delay(100).then(() => _fetch(url, options, retry - 1))
      }
      throw e
    })
}

export function fetchJSON(url, options, retry = 0) {
  return _fetch(url, options, retry)
    .then(response => response.json())
}

export function postJSON(url, options = {}) {
  const headers = Object.assign({}, {}, { 'Content-Type': 'application/json' }, options.headers)
  const body = JSON.stringify(options.body || '')
  return fetchJSON(url, Object.assign(
    {
      method: 'POST',
    },
    options, { headers, body },
  ))
}
