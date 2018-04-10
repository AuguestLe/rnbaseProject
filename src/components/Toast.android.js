import { ToastAndroid } from 'react-native'

export function show(message, duration) {
  switch (duration) {
  case 'LONG':
    ToastAndroid.show(message, ToastAndroid.LONG)
    break
  default:
    ToastAndroid.show(message, ToastAndroid.SHORT)
  }
}

export default { show }
