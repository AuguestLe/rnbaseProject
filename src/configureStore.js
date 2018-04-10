import storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage'
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { compose, createStore, applyMiddleware } from 'redux'
import immutableJsMerger from 'redux-storage-merger-immutablejs'
import { composeWithDevTools } from 'redux-devtools-extension'
import appReducers from './reducers/index'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

export default function configureStore(key, initialState) {
  const engine = createEngine(key)
  const storageMiddleware = storage.createMiddleware(engine, ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'CHECK_WECHAT_AUTH_CODE', 'RECEIVE_PLAYERINFO', 'RELOAD', 'UPDATE_CHAT_UNREAD_COUNT', 'UPDATE_ARTICLEEVENTS', 'UPDATE_UNREAD_MESSAGE_COUNT', 'UPDATE_COUNTERS'])
  const load = storage.createLoader(engine)
  let composers

  if (__DEV__) {
    composers = [composeWithDevTools(applyMiddleware(sagaMiddleware, thunkMiddleware, storageMiddleware))]
  } else {
    composers = [applyMiddleware(sagaMiddleware, thunkMiddleware, storageMiddleware)]
  }
  const finalCreateStore = compose(...composers)(createStore)

  const reducer = storage.reducer(appReducers, immutableJsMerger)
  const store = finalCreateStore(reducer, initialState)// , devTools({hostname: '192.168.10.159', port: 8000, name: DeviceInfo.getDeviceName()}))
  // Reactotron.addReduxStore(store)
  sagaMiddleware.run(rootSaga)

  load(store)
    .then((newState) => {
      console.log('newState', newState)
    })
    .catch(() => console.log('Failed to load previous state'))

  return store
}
