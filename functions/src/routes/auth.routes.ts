import { Router } from 'express'
import { AuthApiError, loginUser, registerUser } from '../services/auth.service'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const profile = await registerUser(req.body)
    return res.status(201).json({ profile })
  } catch (error) {
    if (error instanceof AuthApiError) {
      return res.status(error.status).json({ error: error.message })
    }
    console.error('register error', error)
    return res.status(500).json({ error: 'Error interno al registrar el usuario.' })
  }
})

router.post('/login', async (req, res) => {
  const webApiKey = process.env.WEB_API_KEY
  if (!webApiKey) {
    return res.status(500).json({ error: 'WEB_API_KEY no está configurada en la Function.' })
  }

  try {
    const result = await loginUser(req.body, webApiKey)
    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof AuthApiError) {
      return res.status(error.status).json({ error: error.message })
    }
    console.error('login error', error)
    return res.status(500).json({ error: 'Error interno al iniciar sesión.' })
  }
})

export default router
