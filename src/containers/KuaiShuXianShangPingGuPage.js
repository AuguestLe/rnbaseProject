/**
 * 快速线上评估
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})

type Props = {};
export default class KuaiShuXianShangPingGuPage extends Component<Props> {
  componentDidMount() {

  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
        快速线上评估
        </Text>
      </View>
    )
  }
}
