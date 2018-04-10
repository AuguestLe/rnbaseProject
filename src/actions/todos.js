export const SET_INFO = 'SET_INFO'
export const USER_LOGON = 'USER_LOGON'
export const USER_LOGOUT = 'USER_LOGOUT'

export function setInfo(state) {
  return {
    type: SET_INFO,
    info: state,
  }
}

export function logon() {
  return {
    type: USER_LOGON,
  }
}

export function logout() {
  return {
    type: USER_LOGOUT,
  }
}
