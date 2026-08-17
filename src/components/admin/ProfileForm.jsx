import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useStorage } from '../../hooks/useStorage'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Avatar from '../ui/Avatar'
import Toast from '../ui/Toast'

export default function ProfileForm() {
  const { userProfile, updateUserProfile, currentUser } = useAuth()
  const { uploadImage, uploading } = useStorage()

  const [form, setForm] = useState({
    displayName: userProfile?.displayName ?? '',
    bio: userProfile?.bio ?? '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(userProfile?.photoURL ?? null)
  const [toast, setToast] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.displayName.trim()) return

    setSaving(true)
    setToast(null)
    setSuccess(false)

    try {
      let photoURL = userProfile?.photoURL ?? null
      if (avatarFile) {
        photoURL = await uploadImage('avatar', currentUser.uid, avatarFile)
      }

      await updateUserProfile(currentUser.uid, {
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
        photoURL,
      })

      setSuccess(true)
    } catch {
      setToast({ type: 'error', message: 'Error al actualizar el perfil. Intenta de nuevo.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {success && (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Perfil actualizado correctamente.
        </div>
      )}

      <div className="flex items-center gap-4">
        <Avatar src={avatarPreview} alt={form.displayName} size="lg" />
        <div>
          <p className="mb-1 text-sm font-medium text-[#1A1A1B]">Foto de perfil</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="text-sm text-neutral-500 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-[#1A1A1B] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
          />
        </div>
      </div>

      <Input
        id="displayName"
        name="displayName"
        label="Nombre"
        value={form.displayName}
        onChange={handleChange}
        required
      />

      <Textarea
        id="bio"
        name="bio"
        label="Biografía"
        placeholder="Cuéntanos un poco de ti..."
        rows={4}
        value={form.bio}
        onChange={handleChange}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={saving || uploading}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
