import { fork, all } from 'redux-saga/effects'

import profile from './profile'

export default function* root() {
  yield all([
    fork(profile),
  ])
}
