import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, User, LogOut, BookOpen, Building2, MonitorPlay, BarChart2, Compass } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const NAV_BY_ROLE = {
  lector: [
    { to: '/explorar', icon: Compass, label: 'Explorar' },
    { to: '/lector', icon: BookOpen, label: 'Mi feed' },
    { to: '/escritorio', icon: MonitorPlay, label: 'Escritorio' },
  ],
  creador: [
    { to: '/explorar', icon: Compass, label: 'Explorar' },
    { to: '/lector', icon: BookOpen, label: 'Mi feed' },
    { to: '/escritorio', icon: MonitorPlay, label: 'Escritorio' },
    { to: '/panel', icon: FileText, label: 'Mis artículos' },
    { to: '/analiticas', icon: BarChart2, label: 'Analíticas' },
  ],
  author: [
    { to: '/explorar', icon: Compass, label: 'Explorar' },
    { to: '/lector', icon: BookOpen, label: 'Mi feed' },
    { to: '/escritorio', icon: MonitorPlay, label: 'Escritorio' },
    { to: '/panel', icon: FileText, label: 'Mis artículos' },
    { to: '/analiticas', icon: BarChart2, label: 'Analíticas' },
  ],
  empresa: [
    { to: '/empresa', icon: Building2, label: 'Dashboard' },
    { to: '/empresa/colaboradores', icon: Users, label: 'Colaboradores' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/articulos', icon: FileText, label: 'Artículos' },
    { to: '/admin/perfil', icon: User, label: 'Mi perfil' },
  ],
  superadmin: [
    { to: '/superadmin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/superadmin/empresas', icon: Building2, label: 'Empresas' },
    { to: '/superadmin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/superadmin/articulos', icon: FileText, label: 'Artículos' },
  ],
}

const ROLE_HOME = {
  lector: '/lector',
  creador: '/lector',
  author: '/lector',
  empresa: '/empresa',
  admin: '/admin',
  superadmin: '/superadmin',
}

export default function Sidebar({ role }) {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const navItems = NAV_BY_ROLE[role] ?? []
  const homeLink = ROLE_HOME[role] ?? '/'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <aside className="hidden w-56 shrink-0 flex-col bg-[#1A1A1B] px-4 py-6 md:flex">
      <Link to={homeLink} className="mb-8 font-display text-lg font-bold leading-tight text-white">
        Voix de la Beauté
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded px-3 py-2 text-sm font-medium text-white/30 transition-colors hover:bg-white/5 hover:text-white"
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>
    </aside>
  )
}
