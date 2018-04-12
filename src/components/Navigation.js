import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as screens from '../containers'
import { headerMarginTop, headerTitleFlex } from '../constants'
import { NavBackButton, NavBarButton } from './'
import { mainColor } from '../styles'

const styles = StyleSheet.create({
  defaultHeaderTitleStyle: {
    alignSelf: 'center',
    fontSize: 16,
    flex: headerTitleFlex,
    textAlign: 'center',
  },
  defaulteHaderStyle: {
    paddingTop: headerMarginTop,
    backgroundColor: mainColor,
    height: 44 + headerMarginTop,
  },
  navHeaderRight: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

// 用于存储_handleNavigationChange事件
const subscribedComponents = []

// 获取路由的名字
function _getCurrentRouteName(navigationState) {
  if (!navigationState) return null
  const route = navigationState.routes[navigationState.index]
  if (route.routes) return _getCurrentRouteName(route)
  return route.routeName
}

// 界面焦点事件更新
export function updateFocus(currentState) {
  const currentRoute = _getCurrentRouteName(currentState)
  subscribedComponents.forEach(f => f(currentRoute))
}

// 默认导航属性
const defaultNavigationOptions = {
  headerTintColor: '#FFFFFF',
  headerTitleStyle: styles.defaultHeaderTitleStyle,
  headerStyle: styles.defaulteHaderStyle,
}

// 自定义导航
const customNavigationOptions = {
  header: null,
}

// 获取容器组件
function getScreen(WrappedComponent, { title, screenName } = {}) {
  return class extends React.Component {
    // 类型定义
    static propTypes = {
      screenProps: PropTypes.shape({}),
      navigation: PropTypes.shape({
        setParams: PropTypes.func.isRequired,
        goBack: PropTypes.func.isRequired,
        state: PropTypes.shape({
          params: PropTypes.shape({}),
        }).isRequired,
      }).isRequired,
    }

    // 定义默认值
    static defaultProps = {
      screenProps: {},
    }

    // 导航栏
    /**
     * 使用
     static navigator = {
        title: '团队申请',// 导航栏标题
        backgroundColor:'red',// 导航栏颜色
        goBack:()=>{},// 导航栏返回点击事件
        rightButton:{
          title:'保存',// 导航栏右按钮标题
          onPress:()=>{},// 导航栏右点击事件
        }
      }
     */
    static navigationOptions = ({ navigation }) => {
      // 导航栏标题
      let headerTitle = title
      if (headerTitle === undefined && WrappedComponent.navigator) {
        headerTitle = WrappedComponent.navigator.title
      }
      if (WrappedComponent.navigator) {
        const navBackGroundColor = WrappedComponent.navigator.backgroundColor
        defaultNavigationOptions.headerStyle = [
          defaultNavigationOptions.headerStyle, {
            backgroundColor: navBackGroundColor || mainColor,
          }]
      }
      const { params = {} } = navigation.state
      headerTitle = params.title || headerTitle

      // 左按钮
      const { leftButton } = params
      let headerLeft = (<NavBackButton
        style={{ paddingHorizontal: 10 }}
        onPress={() => {
          navigation.goBack()
        }}
      />)
      if (leftButton) {
        headerLeft = (<NavBackButton
          style={{ paddingHorizontal: 10 }}
          onPress={() => {
            leftButton.onPress()
          }}
        />)
      }

      // 右按钮
      const { rightButton } = params
      let headerRight
      if (rightButton) {
        headerRight = (
          <View style={styles.navHeaderRight}>
            <NavBarButton
              text={rightButton.text}
              onPress={rightButton.onPress}
            />
          </View>
        )
      } else if (headerTitle) {
        headerRight = (
          <View style={styles.navHeaderRight}>
            <NavBarButton
              text="  "
            />
          </View>
        )
      }

      return {
        gesturesEnabled: false,
        headerBackTitle: null,
        headerTitle,
        headerLeft,
        headerRight,
        ...((headerTitle || headerRight) ? defaultNavigationOptions : customNavigationOptions),
        ...(WrappedComponent.navigationOptions || {}),
      }
    }

    componentDidMount() {
      subscribedComponents.push(this._handleNavigationChange)
      if (this.wrappedInstance) {
        const { navigator } = WrappedComponent
        if (navigator) {
          const wrappedInstance = this.wrappedInstance.wrappedInstance
            ? this.wrappedInstance.wrappedInstance
            : this.wrappedInstance
          let leftButton
          let rightButton
          if (navigator.goBack) {
            leftButton = {
              onPress: wrappedInstance[navigator.goBack],
            }
          }
          if (navigator.rightButton) {
            const { rightButton: rightButton2 } = navigator
            rightButton = {
              text: rightButton2.text,
              onPress: wrappedInstance[rightButton2.onPress],
            }
          }
          this.props.navigation.setParams({
            leftButton,
            rightButton,
          })
        }
      }
    }

    componentWillUnmount() {
      for (let i = 0; i < subscribedComponents.length; i += 1) {
        if (subscribedComponents[i] === this._handleNavigationChange) {
          subscribedComponents.splice(i, 1)
          break
        }
      }
    }

    isFocused = true
    // 导航改变时调用componentWillFocus、componentDidFocus方法，相当于增加了将要成为焦点、已经成为焦点两个生命方法
    _handleNavigationChange = (routeName) => {
      const isFocused = screenName === routeName
      if (this.isFocused !== isFocused) {
        this.isFocused = isFocused
        if (this.wrappedInstance) {
          const wrappedInstance = this.wrappedInstance.wrappedInstance
            ? this.wrappedInstance.wrappedInstance
            : this.wrappedInstance
          if (isFocused && wrappedInstance.componentWillFocus) {
            wrappedInstance.componentWillFocus()
          }
          if (isFocused && wrappedInstance.componentDidFocus) {
            wrappedInstance.componentDidFocus()
          }
        }
      }
    }

    render() {
      const { navigation, screenProps } = this.props
      const { params = {}, key, routeName } = navigation.state
      const routerKeys = [].concat(params.routerKeys || []).concat({ key, routeName })
      return (
        <WrappedComponent
          ref={wrappedInstance => this.wrappedInstance = wrappedInstance}
          {...screenProps}
          {...params}
          router={{
            // 返回栈顶
            /**
             * 使用
              this.props.router.popToTop()
             */
            popToTop: () => {
              navigation.goBack(routerKeys[1].key)
            },
            // 根据路由名字出栈,返回到指定页面
            /**
             * 使用
              this.props.router.popTo('HomePage')
             */
            popTo: (nextRouteName) => {
              for (let i = routerKeys.length - 1; i > 0; i -= 1) {
                if (routerKeys[i - 1].routeName === nextRouteName) {
                  navigation.goBack(routerKeys[i].key)
                }
              }
            },
            // 根据个数出栈, 返回到前第几个界面
            /**
             * 使用
              this.props.router.popN(1)
             */
            popN: (number = 1) => {
              navigation.goBack(routerKeys[routerKeys.length - number].key)
            },
            // 返回上一层
            /**
             * 使用
              this.props.router.pop()
             */
            pop: () => {
              navigation.goBack()
            },
            // 入栈, 跳转到哪一个页面
            /**
             * 使用
              this.props.router.navigate('HomePage',{})
             */
            navigate: (nextRouteName, options) => {
              navigation.navigate(nextRouteName, { ...options, routerKeys })
            },
          }}
          navigation={navigation}
        />
      )
    }
  }
}

// 注册导航栈
export function registerScreens(views) {
  // 初始化导航
  /**
   * 把 src/containers/index.js 文件定义的页面格式化成 StackNavigator 需要的格式
   */
  const ret = StackNavigator(Object.keys(views).reduce((obj, key) => {
    const screen = views[key] && getScreen(views[key], { screenName: key })
    return Object.assign(obj, { [key]: { screen } })
  }, {}), { headerMode: 'float' })
  return ret
}

// 注册登录导航
const { LoginPage } = screens
export const LoginNavigator = registerScreens({ LoginPage })

export default registerScreens(screens)
