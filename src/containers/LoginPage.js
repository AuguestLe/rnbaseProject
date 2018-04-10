/**
 * 登录页面
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { mainColor } from '../styles'
import { deviceWidth } from '../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    width: deviceWidth - 100,
    height: 50,
    backgroundColor: mainColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  login: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#fff',
  },
})

export default class LoginPage extends Component {
    static propTypes = {
      actions: PropTypes.shape({
        logon: PropTypes.func.isRequired,
      }).isRequired,
    }
    componentDidMount() {

    }

  onLoginPress=() => {
    this.props.actions.logon()
    // alert('登录')
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.welcome} onPress={this.onLoginPress}>
          <Text style={styles.login}>
            登录
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
