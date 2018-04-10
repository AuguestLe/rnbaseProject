import React from 'react'
import PropTypes from 'prop-types'
import { View, ViewPropTypes } from 'react-native'
import IconFontAwesome from 'react-native-vector-icons/FontAwesome'
import IconIonicons from 'react-native-vector-icons/Ionicons'
import { isEqual } from 'lodash'

const fontFamilies = { fontawesome: IconFontAwesome, ion: IconIonicons }

class Icons extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    style: ViewPropTypes.style,
    accessibilityLabel: PropTypes.string,
    testID: PropTypes.string,
  }

  static defaultProps = {
    style: {},
    accessibilityLabel: '',
    testID: '',
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props)
  }

  render() {
    const { name, accessibilityLabel, testID, style, size, color } = this.props
    const [fontFamily, fontName] = name.split('|')
    const Icon = fontFamilies[fontFamily]
    return (
      <View
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        style={[{ alignItems: 'center', justifyContent: 'center' }, style]}
      >
        <Icon
          name={fontName}
          size={size}
          color={color}
        />
      </View>
    )
  }
}

export default Icons
