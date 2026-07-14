import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadCoverImage(articleId, file) {
  const ext = file.name.split('.').pop()
  const storageRef = ref(storage, `articles/${articleId}/cover.${ext}`)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export async function uploadAvatar(uid, file) {
  const ext = file.name.split('.').pop()
  const storageRef = ref(storage, `users/${uid}/avatar.${ext}`)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export async function deleteFile(path) {
  return deleteObject(ref(storage, path))
}
