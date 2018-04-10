/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
import React from 'react'
import { Platform, View, StatusBar, Keyboard, Animated } from 'react-native'
import { bindActionCreators } from 'redux'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import Navigator, { LoginNavigator, updateFocus } from '../components/Navigation'
import * as actionCreators from '../actions'
import api from '../libs/api'
import { deviceHeight } from '../constants'

const store = configureStore('BaseReactNativeApp')
const actions = bindActionCreators(actionCreators, store.dispatch)

class App extends React.Component {
  state = {
    showLoginPanel: false,
    loginTop: new Animated.Value(0),
    appHeight: null, // 在4.4以下，deviceHeight高度包括statusbar，所以在app启动后，由root component通过onLayout重新计算
  }

  componentWillMount() {
    /**
     * 主动根据appState来决定是否显示登陆页
     * 估计RN在App退出后，会暂时保存App的内存数据来加速App再次打开（再次打开不会去reload redux state，不会触发onChange）
     * 彻底清除App后，走正常启动流程
     */
    this.onChange()
    if (Platform.OS === 'android') { // 解决StatusBar hidden={flase} adjustResize 无效
      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
    }
  }

  async componentDidMount() {
    this.routerUnlisten = store.subscribe(this.onChange)

    api.init()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.appHeight !== nextState.appHeight ||
      this.state.showLoginPanel !== nextState.showLoginPanel
    )
  }


  componentWillUnmount() {
    this.routerUnlisten()
  }

  onChange = () => {
    const { loginTop } = this.state
    const appState = store.getState()

    const showLoginPanel = !appState.player.logon
    this.setState({ showLoginPanel }, () => {
      Animated.spring(loginTop, { toValue: showLoginPanel ? 0 : deviceHeight }).start()
    })
  }

  _keyboardDidShow = () => {
    StatusBar.setHidden(true)
  }

  _keyboardDidHide = () => {
    StatusBar.setHidden(false)
  }


  handleAppLayout = (event) => {
    // deviceHeight高度包括statusbar，所以在app启动后，由root component通过onLayout重新计算
    this.setState({
      appHeight: event.nativeEvent.layout.height,
    })
  }

  render() {
    const { appHeight, loginTop, showLoginPanel } = this.state
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }} onLayout={this.handleAppLayout}>
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" hidden={false} />
          <View style={{ flex: 1 }}>
            <Navigator
              screenProps={{ actions, store }}
              onNavigationStateChange={(prevState, currentState) => {
                updateFocus(currentState)
              }}
            />
          </View>
          {showLoginPanel &&
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFF' }}>
            <Animated.View style={{ top: loginTop, left: 0, right: 0, height: appHeight }}>
              <LoginNavigator screenProps={{ actions, store }} />
            </Animated.View>
          </View>}
        </View>
      </Provider>
    )
  }
}

export default App
