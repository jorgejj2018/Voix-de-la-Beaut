import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'
import Spinner from '../components/ui/Spinner'
import { ROLES } from '../constants/roles'

const HomePage = lazy(() => import('../pages/public/HomePage'))
const ArticleDetailPage = lazy(() => import('../pages/public/ArticleDetailPage'))
const LoginPage = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'))
const AccountSuspendedPage = lazy(() => import('../pages/auth/AccountSuspendedPage'))

const LectorPage = lazy(() => import('../pages/lector/LectorPage'))
const ExplorarPage = lazy(() => import('../pages/lector/ExplorarPage'))
const LectorFavoritosPage = lazy(() => import('../pages/lector/LectorFavoritosPage'))
const EscritorioPage = lazy(() => import('../pages/lector/EscritorioPage'))

const PanelPage = lazy(() => import('../pages/panel/PanelPage'))
const NewArticlePage = lazy(() => import('../pages/panel/NewArticlePage'))
const EditArticlePage = lazy(() => import('../pages/panel/EditArticlePage'))
const AnaliticasPage = lazy(() => import('../pages/panel/AnaliticasPage'))

const EmpresaPage = lazy(() => import('../pages/empresa/EmpresaPage'))
const EmpresaColaboradoresPage = lazy(() => import('../pages/empresa/EmpresaColaboradoresPage'))

const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'))
const AdminArticlesPage = lazy(() => import('../pages/admin/AdminArticlesPage'))
const AdminProfilePage = lazy(() => import('../pages/admin/AdminProfilePage'))

const SuperAdminDashboardPage = lazy(() => import('../pages/superadmin/SuperAdminDashboardPage'))
const SuperAdminUsersPage = lazy(() => import('../pages/superadmin/SuperAdminUsersPage'))
const SuperAdminArticlesPage = lazy(() => import('../pages/superadmin/SuperAdminArticlesPage'))
const SuperAdminEmpresasPage = lazy(() => import('../pages/superadmin/SuperAdminEmpresasPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

const LECTOR_ROLES  = [ROLES.LECTOR, ROLES.CREADOR, ROLES.AUTHOR, ROLES.SUPERADMIN]
const CREADOR_ROLES = [ROLES.CREADOR, ROLES.AUTHOR, ROLES.SUPERADMIN]
const EMPRESA_ROLES = [ROLES.EMPRESA]
const ADMIN_ROLES   = [ROLES.ADMIN, ROLES.SUPERADMIN]
const SUPERADMIN_ROLES = [ROLES.SUPERADMIN]

const ROLE_HOME = {
  [ROLES.LECTOR]:     '/lector',
  [ROLES.CREADOR]:    '/lector',
  [ROLES.AUTHOR]:     '/lector',
  [ROLES.EMPRESA]:    '/empresa',
  [ROLES.ADMIN]:      '/admin',
  [ROLES.SUPERADMIN]: '/superadmin',
}

function GuestRoute({ children }) {
  const { currentUser, userProfile, authLoading } = useAuth()

  if (authLoading || (currentUser && !userProfile)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5E6E0]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (currentUser && userProfile?.status === 'suspended') {
    return <Navigate to="/cuenta-suspendida" replace />
  }

  if (currentUser && userProfile) {
    return <Navigate to={ROLE_HOME[userProfile.role] ?? '/'} replace />
  }

  return children
}

function HomeRoute({ children }) {
  const { currentUser, userProfile, authLoading } = useAuth()

  if (authLoading || (currentUser && !userProfile)) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5E6E0]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (currentUser && userProfile?.status === 'suspended') {
    return <Navigate to="/cuenta-suspendida" replace />
  }

  if (currentUser && userProfile) {
    return <Navigate to={ROLE_HOME[userProfile.role] ?? '/'} replace />
  }

  return children
}

const PageFallback = () => (
  <div className="flex h-screen items-center justify-center bg-[#F5E6E0]">
    <Spinner size="lg" />
  </div>
)

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomeRoute><HomePage /></HomeRoute>} />
          <Route path="/articulo/:id" element={<ArticleDetailPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/registro" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/cuenta-suspendida" element={<AccountSuspendedPage />} />

          {/* Lector y Creador */}
          <Route path="/explorar" element={<ProtectedRoute allowedRoles={LECTOR_ROLES}><ExplorarPage /></ProtectedRoute>} />
          <Route path="/lector" element={<ProtectedRoute allowedRoles={LECTOR_ROLES}><LectorPage /></ProtectedRoute>} />
          <Route path="/lector/favoritos" element={<ProtectedRoute allowedRoles={LECTOR_ROLES}><LectorFavoritosPage /></ProtectedRoute>} />
          <Route path="/escritorio" element={<ProtectedRoute allowedRoles={LECTOR_ROLES}><EscritorioPage /></ProtectedRoute>} />

          {/* Creador */}
          <Route path="/panel" element={<ProtectedRoute allowedRoles={CREADOR_ROLES}><PanelPage /></ProtectedRoute>} />
          <Route path="/panel/nuevo" element={<ProtectedRoute allowedRoles={CREADOR_ROLES}><NewArticlePage /></ProtectedRoute>} />
          <Route path="/panel/editar/:id" element={<ProtectedRoute allowedRoles={CREADOR_ROLES}><EditArticlePage /></ProtectedRoute>} />
          <Route path="/analiticas" element={<ProtectedRoute allowedRoles={CREADOR_ROLES}><AnaliticasPage /></ProtectedRoute>} />

          {/* Empresa */}
          <Route path="/empresa" element={<ProtectedRoute allowedRoles={EMPRESA_ROLES}><EmpresaPage /></ProtectedRoute>} />
          <Route path="/empresa/colaboradores" element={<ProtectedRoute allowedRoles={EMPRESA_ROLES}><EmpresaColaboradoresPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/articulos" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><AdminArticlesPage /></ProtectedRoute>} />
          <Route path="/admin/perfil" element={<ProtectedRoute allowedRoles={ADMIN_ROLES}><AdminProfilePage /></ProtectedRoute>} />

          {/* Super Admin */}
          <Route path="/superadmin" element={<ProtectedRoute allowedRoles={SUPERADMIN_ROLES}><SuperAdminDashboardPage /></ProtectedRoute>} />
          <Route path="/superadmin/empresas" element={<ProtectedRoute allowedRoles={SUPERADMIN_ROLES}><SuperAdminEmpresasPage /></ProtectedRoute>} />
          <Route path="/superadmin/usuarios" element={<ProtectedRoute allowedRoles={SUPERADMIN_ROLES}><SuperAdminUsersPage /></ProtectedRoute>} />
          <Route path="/superadmin/articulos" element={<ProtectedRoute allowedRoles={SUPERADMIN_ROLES}><SuperAdminArticlesPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

