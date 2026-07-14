import { useState } from 'react'
import { uploadCoverImage, uploadAvatar } from '../services/storageService'

export function useStorage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  async function uploadImage(type, id, file) {
    setUploading(true)
    setError(null)
    try {
      return type === 'avatar'
        ? await uploadAvatar(id, file)
        : await uploadCoverImage(id, file)
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadImage, uploading, error }
}
