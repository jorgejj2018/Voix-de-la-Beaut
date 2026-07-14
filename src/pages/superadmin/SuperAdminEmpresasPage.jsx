import { useState } from 'react'
import { Building2, CheckCircle, XCircle } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Avatar from '../../components/ui/Avatar'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import Modal from '../../components/ui/Modal'
import { useUsers } from '../../hooks/useUsers'
import { setUserStatus } from '../../services/usersService'
import { formatDate } from '../../utils/formatDate'

export default function SuperAdminEmpresasPage() {
  const { users, loading } = useUsers()
  const [empresaToToggle, setEmpresaToToggle] = useState(null)
  const [toggling, setToggling] = useState(false)

  const empresas = users.filter((u) => u.role === 'empresa')

  async function handleConfirmToggle() {
    if (!empresaToToggle) return
    setToggling(true)
    const newStatus = empresaToToggle.status === 'suspended' ? 'active' : 'suspended'
    try {
      await setUserStatus(empresaToToggle.uid, newStatus)
    } finally {
      setToggling(false)
      setEmpresaToToggle(null)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-3">
        <Building2 size={24} className="text-[#D4AF37]" />
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Empresas</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : empresas.length === 0 ? (
        <EmptyState
          title="Sin empresas registradas"
          description="Aún no hay empresas registradas en la plataforma."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-neutral-50 text-left">
                <th className="px-4 py-3 font-medium text-neutral-600">Empresa</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Representante</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                <th className="px-4 py-3 font-medium text-neutral-600">Registro</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => {
                const isSuspended = empresa.status === 'suspended'
                return (
                  <tr key={empresa.uid} className="border-b border-black/5 hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37]/10">
                          <Building2 size={16} className="text-[#D4AF37]" />
                        </div>
                        <p className="font-semibold text-[#1A1A1B]">
                          {empresa.companyName ?? empresa.displayName}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={empresa.photoURL} alt={empresa.displayName} size="sm" />
                        <div>
                          <p className="text-[#1A1A1B]">{empresa.displayName}</p>
                          <p className="text-xs text-neutral-400">{empresa.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
                        isSuspended
                          ? 'bg-red-50 text-red-600'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {isSuspended ? 'Suspendida' : 'Activa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(empresa.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setEmpresaToToggle(empresa)}
                          className={`flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ${
                            isSuspended
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {isSuspended ? (
                            <><CheckCircle size={13} /> Habilitar</>
                          ) : (
                            <><XCircle size={13} /> Suspender</>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {empresaToToggle && (
        <Modal
          title={empresaToToggle.status === 'suspended' ? 'Habilitar empresa' : 'Suspender empresa'}
          description={
            empresaToToggle.status === 'suspended'
              ? `¿Habilitar "${empresaToToggle.companyName ?? empresaToToggle.displayName}"? Podrá acceder de nuevo a la plataforma.`
              : `¿Suspender "${empresaToToggle.companyName ?? empresaToToggle.displayName}"? Sus accesos quedarán bloqueados.`
          }
          confirmLabel={empresaToToggle.status === 'suspended' ? 'Habilitar' : 'Suspender'}
          confirmVariant={empresaToToggle.status === 'suspended' ? 'primary' : 'danger'}
          onConfirm={handleConfirmToggle}
          onCancel={() => setEmpresaToToggle(null)}
          loading={toggling}
        />
      )}
    </AdminLayout>
  )
}
