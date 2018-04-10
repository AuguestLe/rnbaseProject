/**
 * 主页面
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native'
import { deviceWidth } from '../constants'
import { Text } from '../components'
import { borderWidth, borderColor, mainColor } from '../styles'

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
    color: '#fff',
  },
  content1: {
    flex: 1,
    width: deviceWidth,
    backgroundColor: mainColor,
    alignItems: 'center',
    justifyContent: 'center',

  },
  content2: {
    flex: 2,
    width: deviceWidth,
  },
  contenRow: {
    flexDirection: 'row',
    flex: 1,
  },
})

const itemStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth / 3,
    borderRightWidth: borderWidth,
    borderRightColor: borderColor,
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  },
  icon: {
    height: 65,
    width: 65,
    backgroundColor: '#f002',
  },
  text: {
    fontSize: 16,
    marginTop: 20,
    color: '#5B5B5B',
  },
})

const rowData = [
  [{ key: 'JiShiPingGuXiTongPage', desc: '即时评估系统', icon: '' }, { key: 'KuaiShuXianShangPingGuPage', desc: '快速线上评估', icon: '' }, { key: 'ZhuanYeXianXiaJianCePage', desc: '专业线下检测', icon: '' }],
  [{ key: 'OrderStatisticsPage', desc: '订单统计', icon: '' }, { key: 'PingGuShiStatisticsPage', desc: '评估师统计', icon: '' }, { key: 'OrganizationStatisticsPage', desc: '机构统计', icon: '' }],
  [{ key: 'SettingPage', desc: '设置', icon: '' }]]

export default class Home extends Component {
  static propTypes = {
    router: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  }
  componentDidMount() {

  }

  onItemPress=(key, desc) => {
    this.props.router.navigate(key, { title: desc })
  }

  renderRowItem = (item) => {
    const { desc, key } = item
    return (
      <TouchableOpacity key={key} style={itemStyles.container} onPress={() => { this.onItemPress(key, desc) }}>
        <View style={itemStyles.icon} />
        <Text style={itemStyles.text}>{desc}</Text>
      </TouchableOpacity>
    )
  }
  renderRow = (items, index) => (
    <View key={`${index}`} style={styles.contenRow}>
      {items.map(item => this.renderRowItem(item))}
    </View>
  )
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content1} >
          <Text style={styles.welcome}>
          首页
          </Text>
        </View>
        <View style={styles.content2} >
          {rowData.map((items, index) => this.renderRow(items, index))}
        </View>
      </View>
    )
  }
}

