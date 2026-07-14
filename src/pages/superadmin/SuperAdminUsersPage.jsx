import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import UserTable from '../../components/admin/UserTable'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useUsers } from '../../hooks/useUsers'
import { useAuth } from '../../context/AuthContext'
import { updateUserRole, deleteUser } from '../../services/usersService'

export default function SuperAdminUsersPage() {
  const { currentUser } = useAuth()
  const { users, loading } = useUsers()
  const [userToDelete, setUserToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleRoleChange(uid, role) {
    await updateUserRole(uid, role)
  }

  async function handleConfirmDelete() {
    if (!userToDelete) return
    setDeleting(true)
    try {
      await deleteUser(userToDelete.uid)
    } finally {
      setDeleting(false)
      setUserToDelete(null)
    }
  }

  return (
    <AdminLayout>
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
