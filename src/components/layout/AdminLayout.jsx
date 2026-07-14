import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'

export default function AdminLayout({ children }) {
  const { userProfile } = useAuth()

  return (
    <div className="flex min-h-screen bg-[#F5E6E0]">
      <Sidebar role={userProfile?.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">{children}</div>
      </main>
    </div>
  )
}
