import AdminLayout from '../../components/layout/AdminLayout'
import ProfileForm from '../../components/admin/ProfileForm'

export default function AdminProfilePage() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">Mi perfil</h1>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ProfileForm />
        </div>
      </div>
    </AdminLayout>
  )
}
