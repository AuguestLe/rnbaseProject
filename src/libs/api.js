import qs from 'querystring'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'
import { apiServerUrl, apiVersion } from '../constants/api'
import fetch, { fetchJSON } from './fetch'

const DEFAULT_TOKEN = '8881bc9737a7fbe26a0d4ee5fa1e4da4b65b62c4'

const userAgent = DeviceInfo.getUserAgent()
const UA = userAgent ? userAgent.replace(/[^\x1F-\x7F]/g, '*') : 'UA'
const DeviceID = DeviceInfo.getUniqueID()
const Device = `${DeviceInfo.getManufacturer()} ${DeviceInfo.getModel()} ${DeviceInfo.getSystemVersion()}`
const Version = `${DeviceInfo.getVersion()}.${(Platform.OS === 'ios') ? DeviceInfo.getBuildNumber() : (DeviceInfo.getBuildNumber() % 1048576)}`
const AppInfo = `${DeviceInfo.getBundleId()} ${Version}`
const MSISDN = DeviceInfo.getPhoneNumber() || '-'

export class JJApi {
  token = {
    access_token: DEFAULT_TOKEN,
  };

  constructor(serverUrl) {
    this.version = `/${apiVersion}`
    this.serverUrl = serverUrl
  }

  static realFetch(...options) {
    return fetch(...options).then((res) => {
      if (res.ok) {
        return res.json()
      } else if (res.status !== 200) {
        throw new Error(`API_SERVER_ERROR_${res.status}`)
      } else {
        return res.json().then((e) => {
          throw e
        })
      }
    })
  }

  fetchWithToken(url, options) {
    const headers = this.getHttpHeader()
    Object.assign(options.headers, headers)

    return JJApi.realFetch(url, options).catch((err) => {
      if (err.error && err.error === 'invalid_token') {
        return this.refreshToken().then(() => this.fetchWithToken(url, options))
      }
      throw err
    })
  }

  getHttpHeader = () => ({
    'User-Agent': UA,
    Accept: 'application/json',
    Authorization: `Bearer ${this.token.access_token || DEFAULT_TOKEN}`,
    'X-Device-ID': DeviceID,
    'X-Device-Info': encodeURIComponent(Device),
    'X-App-Info': AppInfo,
    'X-MSISDN': MSISDN,
  })

  getJSON(url, options = {}, retry = 0) {
    const headers = Object.assign({}, this.getHttpHeader(), options.headers)
    return fetchJSON(url, Object.assign({}, options, { headers }), retry)
      .catch((e) => {
        if (e.message === 'HTTP ERROR CODE 401' && !options.refreshed && this.token.refresh_token) {
          const newOptions = Object.assign({}, options)
          newOptions.refreshed = true
          return this.refreshToken()
            .then(() => this.getJSON(url, newOptions)).catch(() => { })
        }
        throw e
      })
  }

  postJSON(url, options = {}) {
    const headers = Object.assign({}, this.getHttpHeader(), { 'Content-Type': 'application/json' }, options.headers)
    const body = JSON.stringify(options.body || {})
    return fetchJSON(url, Object.assign(
      {
        method: 'POST',
      },
      options, { headers, body },
    ))
  }

  refreshToken() {
    const url = `${this.serverUrl}/oauth/token`
    const { client_id: clientId, refresh_token: refreshToken } = this.token
    if (!refreshToken) return Promise.reject(new Error('refresh_token not exist'))
    return JJApi.realFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: qs.stringify({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: refreshToken,
      }),
    }).then(res => this.setAccessToken(Object.assign({}, res.jijia_token, {
      refresh_time: new Date().getTime(),
      client_id: clientId,
    })))
  }

  setAccessToken = (token = { access_token: DEFAULT_TOKEN }) => {
    this.token = token
  }

  getToken = async (code) => {
    const url = `${this.serverUrl}/oauth/authcode?code=${code}`
    try {
      const response = await fetch(url, { headers: this.getHttpHeader() })
      return response.json()
    } catch (error) {
      throw error
    }
  }

  async getPlayerInfo() {
    const url = `${this.serverUrl}/api${this.version}/me`
    const response = await fetch(url, { headers: this.getHttpHeader() })
    return response.json().then((body) => {
      if (body.result === true && body.user) {
        return body.user
      }
      throw new Error('Api Error')
    })
  }

  async savePlayerInfo(body) {
    const url = `${this.serverUrl}/api${this.version}/me/save`
    const response = await fetch(url, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, this.getHttpHeader()), body: JSON.stringify(body) })
    return response.json().then((resBody) => {
      if (resBody.result === true) {
        return true
      }
      throw new Error('Api Error')
    })
  }

  init(body = { type: 'startApp' }) {
    const url = `${this.serverUrl}/api${this.version}/log`
    return this.fetchWithToken(url, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, this.getHttpHeader()), body: JSON.stringify(body) }).catch(() => { })
  }


  // post 请求
  uploadDeviceTocken(body) {
    const url = `${this.serverUrl}/api${this.version}/users/appletoken`
    return this.postJSON(url, { body })
  }

  //  get 请求
  getMymonthly() {
    const url = `${this.serverUrl}/api${this.version}/dynamics/mymonthly`
    return this.getJSON(url)
  }
}

export default new JJApi(apiServerUrl)
