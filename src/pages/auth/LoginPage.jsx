import AuthCard from '../../components/auth/AuthCard'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthCard title="Iniciar sesión" subtitle="Bienvenida de vuelta">
      <LoginForm />
    </AuthCard>
  )
}
