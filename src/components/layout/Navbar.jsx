import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'

const PANEL_LINKS = {
  author: { to: '/panel', label: 'Mi panel' },
  admin: { to: '/admin', label: 'Admin' },
  superadmin: { to: '/superadmin', label: 'Super Admin' },
}

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const panelLink = userProfile ? PANEL_LINKS[userProfile.role] : null

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#F5E6E0]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-[#1A1A1B]"
        >
          Voix de la Beauté
        </Link>

        <nav className="flex items-center gap-5">
          {currentUser && userProfile ? (
            <>
              {panelLink && (
                <Link
                  to={panelLink.to}
                  className="text-sm font-medium text-[#1A1A1B] transition-colors hover:text-[#D4AF37]"
                >
                  {panelLink.label}
                </Link>
              )}
              <Avatar src={userProfile.photoURL} alt={userProfile.displayName} size="sm" />
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-neutral-500 transition-colors hover:text-[#1A1A1B]"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-[#1A1A1B] transition-colors hover:text-[#D4AF37]"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="rounded bg-[#1A1A1B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2d2e]"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
