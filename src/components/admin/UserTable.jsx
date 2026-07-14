import { Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import { formatDate } from '../../utils/formatDate'
import { ROLES } from '../../constants/roles'

const ROLE_OPTIONS = [
  { value: 'lector', label: 'Lector' },
  { value: 'creador', label: 'Creador' },
  { value: 'empresa', label: 'Empresa' },
]

export default function UserTable({ users, currentUid, onRoleChange, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left">
            <th className="px-4 py-3 font-medium text-neutral-600">Usuario</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Rol</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Registro</th>
            <th className="px-4 py-3 text-right font-medium text-neutral-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.uid === currentUid
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
                  {user.role === ROLES.SUPERADMIN ? (
                    <Badge value={user.role} type="role" />
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => onRoleChange?.(user.uid, e.target.value)}
                      disabled={isSelf}
                      className="rounded border border-neutral-200 px-2 py-1 text-xs focus:outline-none disabled:opacity-50"
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-400">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    {!isSelf && user.role !== ROLES.SUPERADMIN && (
                      <button
                        onClick={() => onDelete?.(user)}
                        title="Eliminar usuario"
                        className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} />
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
  )
}
