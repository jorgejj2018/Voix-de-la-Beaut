import { useState, useEffect } from 'react'
import { UserPlus, UserCheck, UserX } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Toast from '../../components/ui/Toast'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { useColaboradores } from '../../hooks/useColaboradores'
import { createColaborador } from '../../services/empresaService'
import { setUserStatus } from '../../services/usersService'
import { formatDate } from '../../utils/formatDate'

const ROLE_OPTIONS = [
  { value: 'lector', label: 'Lector' },
  { value: 'creador', label: 'Creador' },
]

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'El formato del correo no es válido.',
}

export default function EmpresaColaboradoresPage() {
  const { userProfile } = useAuth()
  const companyId = userProfile?.uid
  const { colaboradores, loading } = useColaboradores(companyId)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ displayName: '', email: '', password: '', role: 'lector' })
  const [formErrors, setFormErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [creating, setCreating] = useState(false)
  const [userToBlock, setUserToBlock] = useState(null)
  const [blocking, setBlocking] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'email') {
      if (value && !EMAIL_REGEX.test(value)) {
        setFormErrors((prev) => ({ ...prev, email: 'Formato de correo inválido.' }))
      } else {
        setFormErrors((prev) => ({ ...prev, email: '' }))
      }
    } else if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const next = {}
    if (!form.email) next.email = 'El correo es requerido.'
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Formato de correo inválido.'
    if (!form.password) next.password = 'La contraseña es requerida.'
    else if (form.password.length < 8) next.password = 'Mínimo 8 caracteres.'
    return next
  }

  async function handleCreate(e) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) { setFormErrors(fieldErrors); return }

    setCreating(true)
    try {
      await createColaborador({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
        companyId,
        role: form.role,
      })
      setForm({ displayName: '', email: '', password: '', role: 'lector' })
      setShowForm(false)
    } catch (err) {
      setToast({ type: 'error', message: FIREBASE_ERRORS[err.code] ?? 'Error al crear el colaborador. Intenta de nuevo.' })
    } finally {
      setCreating(false)
    }
  }

  async function handleConfirmBlock() {
    if (!userToBlock) return
    setBlocking(true)
    try {
      await setUserStatus(userToBlock.uid, 'blocked')
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo bloquear al colaborador.' })
    } finally {
      setBlocking(false)
      setUserToBlock(null)
    }
  }

  async function handleUnblock(uid) {
    try {
      await setUserStatus(uid, 'active')
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo activar al colaborador.' })
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Colaboradores</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Gestiona los miembros de {userProfile?.companyName ?? 'tu empresa'}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)}>
          <UserPlus size={16} />
          {showForm ? 'Cancelar' : 'Agregar colaborador'}
        </Button>
      </div>

      {/* Formulario para agregar colaborador */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-black/10 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-[#1A1A1B]">
            Nuevo colaborador
          </h2>
          <form onSubmit={handleCreate} noValidate className="flex flex-col gap-4">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                id="colDisplayName"
                name="displayName"
                label="Nombre completo"
                placeholder="Nombre del colaborador"
                value={form.displayName}
                onChange={handleChange}
              />
              <Select
                id="colRole"
                name="role"
                label="Rol"
                options={ROLE_OPTIONS}
                value={form.role}
                onChange={handleChange}
              />
              <Input
                id="colEmail"
                name="email"
                type="email"
                label="Correo electrónico *"
                placeholder="colaborador@empresa.com"
                value={form.email}
                onChange={handleChange}
                error={formErrors.email}
              />
              <Input
                id="colPassword"
                name="password"
                type="password"
                label="Contraseña temporal *"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={handleChange}
                error={formErrors.password}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-black/10 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" loading={creating}>
                Crear colaborador
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de colaboradores */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : colaboradores.length === 0 ? (
        <EmptyState
          title="Sin colaboradores"
          description="Agrega el primer miembro de tu empresa usando el formulario."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-neutral-50 text-left">
                <th className="px-4 py-3 font-medium text-neutral-600">Colaborador</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Rol</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Registro</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {colaboradores.map((user) => {
                const isBlocked = user.status === 'blocked'
                return (
                  <tr key={user.uid} className="border-b border-black/5 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.photoURL} alt={user.displayName} size="sm" />
                        <div>
                          <p className="font-medium text-[#1A1A1B]">{user.displayName}</p>
                          <p className="text-xs text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge value={user.role} type="role" /></td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isBlocked ? 'Bloqueado' : 'Activo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        {isBlocked ? (
                          <button
                            onClick={() => handleUnblock(user.uid)}
                            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                          >
                            <UserCheck size={13} /> Activar
                          </button>
                        ) : (
                          <button
                            onClick={() => setUserToBlock(user)}
                            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <UserX size={13} /> Bloquear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {userToBlock && (
        <Modal
          title="Bloquear colaborador"
          description={`¿Estás seguro de que quieres bloquear a "${userToBlock.displayName}"?`}
          confirmLabel="Bloquear"
          onConfirm={handleConfirmBlock}
          onCancel={() => setUserToBlock(null)}
          loading={blocking}
        />
      )}
    </AdminLayout>
  )
}
