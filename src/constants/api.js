import DeviceInfo from 'react-native-device-info'

// 单数 开发环境 双数 生产环境
const isProduction = DeviceInfo.getReadableVersion().split('.').pop() % 2 === 0

// 生产环境
const production = {
  apiServerUrl: 'https://api-bj01.jijiabaoxian.cn',
  apiVersion: 'v0.01',
}

// 测试环境
const staging = {
  apiServerUrl: 'http://54.223.56.12',
  apiVersion: 'v0.01',
}

const server = isProduction ? production : staging

exports.apiServerUrl = server.apiServerUrl
exports.isProduction = isProduction
exports.isTest = !isProduction

