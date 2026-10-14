import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import UserTable from '../../components/admin/UserTable'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Toast from '../../components/ui/Toast'
import { useUsers } from '../../hooks/useUsers'
import { useAuth } from '../../context/AuthContext'
import { updateUserRole, deleteUser, setUserStatus } from '../../services/usersService'

export default function SuperAdminUsersPage() {
  const { currentUser } = useAuth()
  const { users, loading } = useUsers()
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  async function handleRoleChange(uid, role) {
    try {
      await updateUserRole(uid, role)
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo cambiar el rol.' })
    }
  }

  async function handleStatusChange(uid, status) {
    try {
      await setUserStatus(uid, status)
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo actualizar el estado.' })
    }
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return
    setDeleting(true)
    try {
      await deleteUser(userToDelete.uid)
    } catch (err) {
      setToast({ type: 'error', message: err.message ?? 'No se pudo eliminar el usuario.' })
    } finally {
      setDeleting(false)
      setUserToDelete(null)
    }
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">
        Gestión de usuarios
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <EmptyState title="No hay usuarios registrados" />
      ) : (
        <UserTable
          users={users}
          currentUid={currentUser?.uid}
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
          onDelete={setUserToDelete}
        />
      )}

      {userToDelete && (
        <Modal
          title="Eliminar usuario"
          description={`¿Estás seguro de que quieres eliminar a "${userToDelete.displayName}"? Sus artículos serán archivados automáticamente.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setUserToDelete(null)}
          loading={deleting}
        />
      )}
    </AdminLayout>
  )
}
