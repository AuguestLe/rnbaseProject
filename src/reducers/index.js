import { combineReducers } from 'redux'
import * as todos from './todos'

export default combineReducers({
  ...todos,
})
