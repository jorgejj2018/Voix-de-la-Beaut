import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toast from '../ui/Toast'
import GoogleIcon from '../ui/GoogleIcon'

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'Este correo ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y un símbolo.',
  'auth/invalid-email': 'El formato del correo no es válido.',
  'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este correo usando otro método.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite ventanas emergentes e intenta de nuevo.',
}

const ACCOUNT_TYPES = [
  { value: 'independiente', icon: User, label: 'Independiente', desc: 'Lector o Creador' },
  { value: 'empresa', icon: Building2, label: 'Empresa', desc: 'Gestionar equipo' },
]

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export default function RegisterForm() {
  const { register, loginWithGoogle } = useAuth()
  const [accountType, setAccountType] = useState('independiente')
  const [form, setForm] = useState({
    displayName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (name === 'email') {
      if (value && !EMAIL_REGEX.test(value)) {
        setErrors((prev) => ({ ...prev, email: 'Formato de correo inválido.' }))
      } else {
        setErrors((prev) => ({ ...prev, email: '' }))
      }
    }

    if (name === 'password') {
      if (value && !PASSWORD_RULE.test(value)) {
        setErrors((prev) => ({
          ...prev,
          password: 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un símbolo.',
        }))
      } else {
        setErrors((prev) => ({ ...prev, password: '' }))
      }
    }

    if (name === 'confirmPassword' && form.password && value !== form.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden.' }))
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const next = {}
    if (!form.displayName.trim()) next.displayName = 'El nombre es requerido.'
    if (accountType === 'empresa' && !form.companyName.trim())
      next.companyName = 'El nombre de la empresa es requerido.'
    if (!form.email) next.email = 'El correo es requerido.'
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Formato de correo inválido.'
    if (!form.password) {
      next.password = 'La contraseña es requerida.'
    } else if (!PASSWORD_RULE.test(form.password)) {
      next.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un símbolo.'
    }
    if (!form.confirmPassword) {
      next.confirmPassword = 'Debes confirmar la contraseña.'
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = 'Las contraseñas no coinciden.'
    }
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) { setErrors(fieldErrors); return }
    setLoading(true)
    try {
      await register(
        form.displayName.trim(),
        form.email,
        form.password,
        accountType,
        form.companyName.trim()
      )
    } catch (err) {
      setToast({ type: 'error', message: FIREBASE_ERRORS[err.code] ?? 'Ocurrió un error. Intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setToast({ type: 'error', message: FIREBASE_ERRORS[err.code] ?? 'Error al continuar con Google.' })
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const isLoading = loading || googleLoading

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Tipo de cuenta */}
      <div>
        <p className="mb-2 text-sm font-medium text-[#1A1A1B]">Tipo de cuenta</p>
        <div className="grid grid-cols-2 gap-3">
          {ACCOUNT_TYPES.map(({ value, icon: Icon, label, desc }) => {
            const isActive = accountType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setAccountType(value)}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-3 text-center transition-colors ${
                  isActive
                    ? 'border-[#1A1A1B] bg-[#1A1A1B] text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{label}</span>
                <span className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral-400'}`}>
                  {desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {accountType === 'independiente' && (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {googleLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-transparent" />
            ) : (
              <GoogleIcon />
            )}
            Continuar con Google
          </button>
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-neutral-400">o crea una cuenta</span>
            </div>
          </div>
        </>
      )}

      <Input
        id="displayName"
        name="displayName"
        type="text"
        label={accountType === 'empresa' ? 'Nombre del representante' : 'Nombre completo'}
        placeholder="Tu nombre"
        value={form.displayName}
        onChange={handleChange}
        error={errors.displayName}
        autoComplete="name"
      />

      {accountType === 'empresa' && (
        <Input
          id="companyName"
          name="companyName"
          type="text"
          label="Nombre de la empresa"
          placeholder="Ej: Beauty Corp S.A.S."
          value={form.companyName}
          onChange={handleChange}
          error={errors.companyName}
        />
      )}

      <Input
        id="email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@correo.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Mínimo 8 caracteres"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="Repite tu contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" loading={loading} disabled={isLoading} className="mt-2 w-full">
        {accountType === 'empresa' ? 'Registrar empresa' : 'Crear cuenta'}
      </Button>

      <p className="text-center text-sm text-neutral-500">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-[#1A1A1B] underline underline-offset-2 hover:text-[#D4AF37]"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}