import React from 'react'
import PropTypes from 'prop-types'
import { View, DeviceEventEmitter } from 'react-native'
import { StackNavigator } from 'react-navigation'
import * as screens from '../containers'
import { headerMarginTop, headerTitleFlex } from '../constants'
import { NavBackButton, NavBarButton } from './'
import { mainColor } from '../styles'

const subscribedComponents = []

let gRouterKeys = []

function _getCurrentRouteName(navigationState) {
  if (!navigationState) return null
  const route = navigationState.routes[navigationState.index]
  if (route.routes) return _getCurrentRouteName(route)
  return route.routeName
}

export function updateFocus(currentState) {
  const currentRoute = _getCurrentRouteName(currentState)
  subscribedComponents.forEach(f => f(currentRoute))
}

const defaultNavigationOptions = {
  headerTintColor: '#FFFFFF',
  headerTitleStyle: { alignSelf: 'center', fontSize: 16, flex: headerTitleFlex, textAlign: 'center' },
  headerStyle: { paddingTop: headerMarginTop, backgroundColor: mainColor, height: 44 + headerMarginTop },
}

const customNavigationOptions = {
  header: null,
}

function getScreen(WrappedComponent, { title, screenName } = {}) {
  return class extends React.Component {
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

    static defaultProps = {
      screenProps: {},
    }

    static navigationOptions = ({ navigation }) => {
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
      // if (headerTitle) {
      //   headerTitle = (
      //     <Text style={{ color: '#FFF', fontSize: 20 }}>{headerTitle}</Text>
      //   )
      // }

      const { leftButton } = params
      let headerLeft = (<NavBackButton
        style={{ paddingHorizontal: 10 }}
        onPress={() => {
          navigation.goBack()
          gRouterKeys.pop()
        }}
      />)
      if (leftButton) {
        headerLeft = (<NavBackButton
          style={{ paddingHorizontal: 10 }}
          onPress={() => {
            leftButton.onPress()
            gRouterKeys.pop()
          }}
        />)
      }

      const { rightButton } = params
      let headerRight
      if (rightButton) {
        headerRight = (
          <View style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
            <NavBarButton
              text={rightButton.text}
              onPress={rightButton.onPress}
            />
          </View>
        )
      } else if (headerTitle) {
        headerRight = (
          <View style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
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
          const wrappedInstance = this.wrappedInstance.wrappedInstance ? this.wrappedInstance.wrappedInstance : this.wrappedInstance
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

    _handleNavigationChange = (routeName) => {
      const isFocused = screenName === routeName
      if (this.isFocused !== isFocused) {
        this.isFocused = isFocused
        if (this.wrappedInstance) {
          const wrappedInstance = this.wrappedInstance.wrappedInstance ? this.wrappedInstance.wrappedInstance : this.wrappedInstance
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
      // 当点击链接进行页面跳转时，因为Linking是加载在Home上，所以params.routerKeys里面只有Home一个路由；
      // 通过fromLinking参数来判断是否是链接进行的跳转；如果是通过链接进行的跳转，记录路由的routerKeys要从全局保存的gRouterKeys中获取；
      // 获取完routerKeys之后，fromLinking就没有作用了，删除fromLinking之后 还是走之前的逻辑；
      // gRouterKeys里记录的router在后退时也要在goBack、pop、popN等后退方法中做相应的删除
      if (params.fromLinking) {
        params.routerKeys = gRouterKeys
        delete params.fromLinking
      }
      const routerKeys = [].concat(params.routerKeys || []).concat({ key, routeName })
      gRouterKeys = routerKeys
      return (
        <WrappedComponent
          ref={wrappedInstance => this.wrappedInstance = wrappedInstance}
          {...screenProps}
          {...params}
          router={{
            popToTop: () => {
              navigation.goBack(routerKeys[1].key)
              gRouterKeys.splice(1, gRouterKeys.length - 1)
            },
            popTo: (nextRouteName) => {
              for (let i = routerKeys.length - 1; i > 0; i -= 1) {
                if (routerKeys[i - 1].routeName === nextRouteName) {
                  navigation.goBack(routerKeys[i].key)
                  gRouterKeys.splice(i, gRouterKeys.length - i)
                }
              }
            },
            popN: (number = 1) => {
              navigation.goBack(routerKeys[routerKeys.length - number].key)
              gRouterKeys.splice(gRouterKeys.length - number, number)
            },
            pop: () => {
              navigation.goBack()
              gRouterKeys.pop()
            },
            toHome: () => {
              navigation.goBack(routerKeys[1].key)
              gRouterKeys.splice(1, gRouterKeys.length - 1)
              DeviceEventEmitter.emit('toHome')
            },
            navigate: (nextRouteName, options) => {
              let fromLinking = false
              if (options) {
                const { fromLinking: linking } = options
                fromLinking = linking
              }
              navigation.navigate(nextRouteName, { ...options, routerKeys, fromLinking })
            },
          }}
          navigation={navigation}
        />
      )
    }
  }
}

export function registerScreens(views) {
  const ret = StackNavigator(Object.keys(views).reduce((obj, key) => {
    const screen = views[key] && getScreen(views[key], { screenName: key })
    return Object.assign(obj, { [key]: { screen } })
  }, {}), { headerMode: 'float' })
  return ret
}

const { LoginPage } = screens
export const LoginNavigator = registerScreens({ LoginPage })

export default registerScreens(screens)
