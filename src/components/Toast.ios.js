import Toast from '@remobile/react-native-toast'

export function show(message, duration) {
  switch (duration) {
  case 'LONG':
    Toast.showLongTop(message)
    break
  default:
    Toast.showShortTop(message)
  }
}

export default { show }
