import { take, fork, all } from 'redux-saga/effects'
import * as actions from '../actions'
import Toast from '../components/Toast'

// function getLocalPath(filePath) {
//   return (Platform.OS === 'ios') ? filePath : `file://${filePath}`
// }

function saveHeadimgToServer(imgPath) {
  // const buildFormData = (qiniuToken) => {
  //   const { ext } = path.parse(imgPath)
  //   const file = {
  //     uri: getLocalPath(imgPath),
  //     type: mime.lookup(imgPath),
  //     name: `headimg${ext}`,
  //   }
  //   const fd = new FormData()
  //   fd.append('key', `headimg/${uuid()}`)
  //   fd.append('token', qiniuToken.token)
  //   fd.append('file', file)
  //   return fd
  // }

  // return Api.getQiniuToken('image', true).then((qiniuToken) => {
  //   const formData = buildFormData(qiniuToken)
  //   console.log('formData', formData)
  //   return uploadTo7Niu(formData).then((result) => {
  //     console.log('qiniu upload result', result)
  //     return `http://${qiniuToken.domain}/${result.key}`
  //   })
  // })
  return `http://图片上传服务器${imgPath}`
}

function saveChatimgToServer(imgPath) {
  return `http://图片上传服务器${imgPath}`
}

function* updateProfileHeadimg() {
  while (true) {
    const nextAction = yield take(actions.UPDATE_PROFILE_HEADIMG)
    try {
      const headimg = yield saveHeadimgToServer(nextAction.imgPath)
      console.log('saveHeadimgToServer ', headimg)
      // const { player: { profile: aProfile } } = yield select()
      // const newProfile = Object.assign(
      //   {},
      //   aProfile,
      //   { headimg },
      // )
      // yield put(actions.setProfile(newProfile))
      Toast.show('头像更新成功', 'SHORT')
    } catch (error) {
      console.warn('updateProfileHeadimg error', error)
      Toast.show('头像更新失败', 'SHORT')
    }
  }
}

function* updateChatimg() {
  while (true) {
    const nextAction = yield take(actions.UPDATE_CHAT_IMG)
    try {
      yield saveChatimgToServer(nextAction.imgPath)
    } catch (error) {
      //
    }
  }
}


export default function* profile() {
  yield all([
    fork(updateProfileHeadimg),
    fork(updateChatimg),
  ])
}
