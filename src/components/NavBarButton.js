import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Icon } from '../components/'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
  },
})

export default class NavBarButton extends React.PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    testID: PropTypes.string,
  }

  static defaultProps = {
    icon: null,
    onPress: null,
    testID: 'navButton',
  }

  handlePress = () => {
    const now = Date.now()
    if (now - (this.lastClick || 0) < 1000) {
      this.lastClick = now
      // console.warn('press a button twice or more in 1s and ignored')
    } else {
      this.lastClick = now
      if (this.props && this.props.onPress) {
        this.props.onPress()
      }
    }
  }

  render() {
    const { text, icon } = this.props
    return (
      <TouchableOpacity
        accessibilityLabel={text}
        onPress={this.handlePress}
        style={styles.container}
        testID={this.props.testID}
      >
        {icon && (<Icon
          name={icon}
          size={20}
          color="#FFF"
        />)}
        {text && (<Text style={styles.text}>{text}</Text>)}
      </TouchableOpacity>
    )
  }
}
