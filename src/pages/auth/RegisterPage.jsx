import AuthCard from '../../components/auth/AuthCard'
import RegisterForm from '../../components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <AuthCard title="Crear cuenta" subtitle="Únete a la comunidad editorial">
      <RegisterForm />
    </AuthCard>
  )
}
