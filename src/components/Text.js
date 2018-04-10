import React from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'

const emptyStyle = {
  fontSize: 10,
}

export default class extends React.Component {
  static propTypes = {
    allowFontScaling: PropTypes.bool,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.any,
      PropTypes.arrayOf(PropTypes.any),
    ]),
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
  }
  static defaultProps = {
    allowFontScaling: false,
    style: emptyStyle,
    fontSize: 10,
    color: '',
    children: null,
  }
  shouldComponentUpdate(nextProps) {
    return (this.props.allowFontScaling !== nextProps.allowFontScaling ||
      this.props.fontSize !== nextProps.fontSize ||
      this.props.color !== nextProps.color ||
      this.props.style.fontSize !== nextProps.style.fontSize ||
      this.props.style.color !== nextProps.style.color ||
      this.props.children !== nextProps.children)
  }
  setNativeProps(props) {
    if (this.text) this.text.setNativeProps(props)
  }
  render() {
    const { style, children, ...otherProps } = this.props
    const _textStyle = [{
      includeFontPadding: false,
      textAlignVertical: 'center',
    }, style]
    return (
      <Text
        ref={text => (this.text = text)}
        style={_textStyle}
        {...otherProps}
      >
        {children}
      </Text>
    )
  }
}
