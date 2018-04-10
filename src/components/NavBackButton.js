/*
  导航栏返回按钮
*/
import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, ViewPropTypes } from 'react-native'
import { Icon } from '../components/'

export default class NavBackButton extends React.PureComponent {
  static propTypes = {
    onPress: PropTypes.func,
    style: ViewPropTypes.style,
  }

  static defaultProps = {
    onPress: () => {},
    style: {},
  }

  lastClick = 0

  handlePress = () => {
    const now = Date.now()
    if (now - (this.lastClick || 0) < 1000) {
      this.lastClick = now
    } else {
      this.lastClick = now
      if (this.props && this.props.onPress) {
        this.props.onPress()
      }
    }
  }

  render() {
    const { style } = this.props
    return (
      <TouchableOpacity
        testID="navBackButton"
        style={style}
        onPress={this.handlePress}
      >
        <Icon
          accessibilityLabel="backButton"
          testID="backButton"
          name="ion|ios-arrow-back"
          size={24}
          color="#FFF"
        />
      </TouchableOpacity>
    )
  }
}
