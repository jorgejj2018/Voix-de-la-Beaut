import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

const ROLE_HOME = {
  lector:     '/lector',
  creador:    '/lector',
  author:     '/panel',
  empresa:    '/empresa',
  admin:      '/admin',
  superadmin: '/superadmin',
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userProfile, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5E6E0]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={ROLE_HOME[userProfile.role] ?? '/'} replace />
  }

  return children
}
