import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import usersRoutes from './routes/users.routes'
import articlesRoutes from './routes/articles.routes'

const EXTRA_ALLOWED_ORIGINS: string[] = [
  process.env.ALLOWED_ORIGIN, // dominio de Netlify, definido como secret/env en despliegue
].filter((origin): origin is string => Boolean(origin))

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || LOCALHOST_ORIGIN.test(origin) || EXTRA_ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Origen no permitido por CORS.'))
    },
  })
)
app.use(express.json())

app.get('/health', (_req, res) => res.status(200).json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/users', usersRoutes)
app.use('/articles', articlesRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' })
})

export default app
