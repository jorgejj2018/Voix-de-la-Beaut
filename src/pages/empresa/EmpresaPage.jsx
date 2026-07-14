import { Link } from 'react-router-dom'
import { Users, UserCheck, UserX } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'
import { useColaboradores } from '../../hooks/useColaboradores'

export default function EmpresaPage() {
  const { userProfile } = useAuth()
  const { colaboradores, loading } = useColaboradores(userProfile?.uid)

  const activos = colaboradores.filter((u) => u.status !== 'blocked').length
  const bloqueados = colaboradores.filter((u) => u.status === 'blocked').length

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">
            {userProfile?.companyName ?? 'Mi empresa'}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Panel de administración de empresa
          </p>
        </div>
        <Link to="/empresa/colaboradores">
          <Button size="sm">Gestionar colaboradores</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard label="Total colaboradores" value={colaboradores.length} icon={Users} color="black" />
          <StatsCard label="Activos" value={activos} icon={UserCheck} color="green" />
          <StatsCard label="Bloqueados" value={bloqueados} icon={UserX} color="gold" />
        </div>
      )}
    </AdminLayout>
  )
}
