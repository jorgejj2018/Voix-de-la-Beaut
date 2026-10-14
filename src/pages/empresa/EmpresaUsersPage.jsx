import { useState, useEffect } from 'react'
import { UserCheck, UserX } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import Toast from '../../components/ui/Toast'
import { useUsers } from '../../hooks/useUsers'
import { setUserStatus } from '../../services/usersService'
import { formatDate } from '../../utils/formatDate'

export default function EmpresaUsersPage() {
  const { users, loading } = useUsers()
  const [userToBlock, setUserToBlock] = useState(null)
  const [blocking, setBlocking] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const miembros = users.filter((u) => u.role === 'lector' || u.role === 'creador')

  async function handleConfirmBlock() {
    if (!userToBlock) return
    setBlocking(true)
    try {
      await setUserStatus(userToBlock.uid, 'blocked')
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo bloquear al usuario.' })
    } finally {
      setBlocking(false)
      setUserToBlock(null)
    }
  }

  async function handleUnblock(uid) {
    try {
      await setUserStatus(uid, 'active')
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo activar al usuario.' })
    }
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">
        Usuarios de la empresa
      </h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : miembros.length === 0 ? (
        <EmptyState title="Sin usuarios registrados" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-neutral-50 text-left">
                <th className="px-4 py-3 font-medium text-neutral-600">Usuario</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Rol</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Registro</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((user) => {
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
                    <td className="px-4 py-3">
                      <Badge value={user.role} type="role" />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                          isBlocked
                            ? 'bg-red-50 text-red-600'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
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
                            <UserCheck size={13} />
                            Activar
                          </button>
                        ) : (
                          <button
                            onClick={() => setUserToBlock(user)}
                            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <UserX size={13} />
                            Bloquear
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
          title="Bloquear usuario"
          description={`¿Estás seguro de que quieres bloquear a "${userToBlock.displayName}"? No podrá acceder a la plataforma.`}
          confirmLabel="Bloquear"
          onConfirm={handleConfirmBlock}
          onCancel={() => setUserToBlock(null)}
          loading={blocking}
        />
      )}
    </AdminLayout>
  )
}
