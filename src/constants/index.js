import {
  Dimensions,
  Platform,
} from 'react-native'
import DeviceInfo from 'react-native-device-info'

const getHeaderMarginTop = () => {
  if (Platform.OS === 'ios') {
    if (parseFloat(DeviceInfo.getSystemVersion()) < 11.0) {
      return 20
    }
    return 0
  }
  if (/^(5.0|4.4)/.test(DeviceInfo.getSystemVersion())) {
    const ExtraDimensions = require('react-native-extra-dimensions-android')
    return ExtraDimensions.get('STATUS_BAR_HEIGHT')
  }

  if (/^4/.test(DeviceInfo.getSystemVersion())) {
    return 0
  }

  return 20
}

export const headerMarginTop = getHeaderMarginTop()

export const headerTitleFlex = Platform.OS === 'ios' ? 0 : 1

export const WEIXINAPPID = '微信 APPID'
export const rowHeigth = 44
export const deviceWidth = Dimensions.get('window').width
export const deviceHeight = Dimensions.get('window').height
export const sexLabel = {
  M: '男',
  F: '女',
}
export const constellations = {
  aries: '白羊座',
  taurus: '金牛座',
  gemini: '双子座',
  cancer: '巨蟹座',
  leo: '狮子座',
  virgo: '处女座',
  libra: '天秤座',
  scorpio: '天蝎座',
  sagittarius: '射手座',
  capricorn: '魔羯座',
  aquarius: '水瓶座',
  pisces: '双鱼座',
}

export const colorTextVip = '#E73828'
export const colorTextNormal = '#3E3A39'

export const docVersion = '0.1.0'

export default { headerMarginTop }
