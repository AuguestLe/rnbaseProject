import {
  PixelRatio,
  StyleSheet,
  Platform,
} from 'react-native'
import { rowHeigth } from '../constants'

export const fontFamily = (Platform.OS !== 'ios') ? 'sans-serif-light' : undefined
export const mainColor = '#1353AF'
export const greyColor = '#9F9FA0'
export const borderColor = '#C7C7C7'
export const borderWidth = 1 / PixelRatio.get()

export default StyleSheet.create({
  inputRow: {
    height: rowHeigth,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: borderWidth,
    borderColor,
    backgroundColor: '#FFF',
    paddingHorizontal: 13,
  },
  infoLabel: {
    fontSize: 16,
    color: '#3E3A39',
    fontWeight: '300',
    fontFamily,
    includeFontPadding: false,
  },
  planItemContainer: {
    height: 75,
    padding: 13,
    backgroundColor: '#FFF',
    borderBottomWidth: borderWidth,
    borderColor,
    flexDirection: 'row',
  },
  planItemTitle: {
    fontSize: 16,
    color: '#3E3A39',
    includeFontPadding: false,
  },
  planItemDesc: {
    fontSize: 14,
    color: '#9F9FA0',
    includeFontPadding: false,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
})
