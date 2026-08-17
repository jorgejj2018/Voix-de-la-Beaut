import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toast from '../ui/Toast'
import GoogleIcon from '../ui/GoogleIcon'

const FIREBASE_ERRORS = {
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.',
  'auth/account-exists-with-different-credential':
    'Ya existe una cuenta con este correo usando otro método.',
  'auth/popup-blocked':
    'El navegador bloqueó la ventana emergente. Permite ventanas emergentes e intenta de nuevo.',
}

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
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
  const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

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

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validate() {
    const next = {}
    if (!form.email) next.email = 'El correo es requerido.'
    else if (!EMAIL_REGEX.test(form.email)) next.email = 'Formato de correo inválido.'

    if (!form.password) {
      next.password = 'La contraseña es requerida.'
    } else if (!PASSWORD_RULE.test(form.password)) {
      next.password = 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y un símbolo.'
    }

    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors)
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
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
        setToast({ type: 'error', message: FIREBASE_ERRORS[err.code] ?? 'Error al iniciar sesión con Google.' })
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const isLoading = loading || googleLoading

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

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
          <span className="bg-white px-3 text-xs text-neutral-400">o</span>
        </div>
      </div>

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
        placeholder="••••••••"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="current-password"
      />

      <Button type="submit" loading={loading} disabled={isLoading} className="mt-2 w-full">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-neutral-500">
        ¿No tienes cuenta?{' '}
        <Link
          to="/registro"
          className="font-medium text-[#1A1A1B] underline underline-offset-2 hover:text-[#D4AF37]"
        >
          Regístrate
        </Link>
      </p>
    </form>
  )
}
