import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AccountSuspendedPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5E6E0] px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-red-500">
          Cuenta suspendida
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1A1A1B]">
          Tu acceso está bloqueado
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          Esta cuenta ha sido suspendida temporalmente. Contacta con el administrador para revisar el acceso.
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full rounded bg-[#1A1A1B] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2e]"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
