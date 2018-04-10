import Immutable from 'immutable'
import {
  SET_INFO,
  USER_LOGON,
  USER_LOGOUT,
  ADD_TAG,
  RECEIVE_PLAYERINFO,
  REQUEST_PLAYERINFO,
  SAVED_PLAYERINFO,
  RELOAD,
  SET_COMPANY,
  SET_PROFILE,
} from '../actions'
import api from '../libs/api'

const initialState = {
  todos: [],
  customers: [],
  plans: [],
  products: [],
  tags: ['未婚女性', '未婚男性', '年轻妈妈', '中年妈妈', '中年男人', '高收入者', '家庭主妇', '增员对象'],
}

const playerInfo = {
  nickname: '',
  realname: '',
  mobile: '',
  gender: '',
  company: '',
  location: '',
  headimg: 'logo',
  uuid: 'anonymous',
}

function profile(state = playerInfo, action) {
  switch (action.type) {
  case SET_INFO:
    return { ...state, ...action.info.profile }
  default:
    return state
  }
}

export function player(state = { profile: playerInfo, logon: false, anonymous: true }, action) {
  switch (action.type) {
  case SET_INFO:
    return { ...state, ...action.info, profile: profile(state.profile, action) }
  case USER_LOGON:
    return Object.assign({}, state, { logon: true })
  case USER_LOGOUT:
    api.setAccessToken()
    return Object.assign({}, state, { logon: false, anonymous: true })
  case RECEIVE_PLAYERINFO:
    return { ...state, profile: action.player }
  case REQUEST_PLAYERINFO:
    return state
  case SAVED_PLAYERINFO:
    return { ...state, sync: true, syncAt: Date.now() }
  case RELOAD:
    if (action.payload.profile !== undefined) {
      const [_profile] = action.payload.profile
      if (_profile && _profile.uuid !== 'anonymous') {
        return Object.assign({}, state, { profile: _profile })
      }
    }
    return state
  case SET_PROFILE:
    return { ...state, profile: action.profile }
  case SET_COMPANY:
    return Object.assign({}, state, { company: action.company })

  default:
    return state
  }
}

export function tags(state = Immutable.fromJS(initialState.tags), action) {
  switch (action.type) {
  case ADD_TAG:
    return state.push(action.tag)
  default:
    return state
  }
}

