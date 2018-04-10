
export const UPDATE_PROFILE_HEADIMG = 'UPDATE_PROFILE_HEADIMG'
export const UPDATE_CHAT_IMG = 'UPDATE_CHAT_IMG'

export function updateProfileHeadimg(imgPath) {
  return {
    type: UPDATE_PROFILE_HEADIMG,
    imgPath,
  }
}

export function updateChatimg(imgPath) {
  return {
    type: UPDATE_CHAT_IMG,
    imgPath,
  }
}
