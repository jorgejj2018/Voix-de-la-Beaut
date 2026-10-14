import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'
import { Role } from '../models/User'
import {
  ArticlesApiError,
  createArticle,
  deleteArticle,
  getArticleById,
  listArticles,
  updateArticle,
  updateArticleStatus,
} from '../services/articles.service'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const status = req.query.status as any
    const articles = await listArticles(status)
    return res.status(200).json({ articles })
  } catch (error) {
    console.error('list articles error', error)
    return res.status(500).json({ error: 'Error interno al listar artículos.' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const article = await getArticleById(req.params.id)
    if (!article) return res.status(404).json({ error: 'Artículo no encontrado.' })
    return res.status(200).json({ article })
  } catch (error) {
    console.error('get article error', error)
    return res.status(500).json({ error: 'Error interno al obtener el artículo.' })
  }
})

router.post('/', requireAuth, requireRole(Role.CREADOR, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN), async (req, res) => {
  try {
    const article = await createArticle(req.body, req.userProfile!)
    return res.status(201).json({ article })
  } catch (error) {
    if (error instanceof ArticlesApiError) return res.status(error.status).json({ error: error.message })
    console.error('create article error', error)
    return res.status(500).json({ error: 'Error interno al crear el artículo.' })
  }
})

router.put('/:id', requireAuth, requireRole(Role.CREADOR, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN), async (req, res) => {
  try {
    await updateArticle(req.params.id, req.body, req.userProfile!)
    return res.status(200).json({ ok: true })
  } catch (error) {
    if (error instanceof ArticlesApiError) return res.status(error.status).json({ error: error.message })
    console.error('update article error', error)
    return res.status(500).json({ error: 'Error interno al actualizar el artículo.' })
  }
})

router.patch(
  '/:id/status',
  requireAuth,
  requireRole(Role.CREADOR, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN),
  async (req, res) => {
    try {
      await updateArticleStatus(req.params.id, req.body.status, req.userProfile!)
      return res.status(200).json({ ok: true })
    } catch (error) {
      if (error instanceof ArticlesApiError) return res.status(error.status).json({ error: error.message })
      console.error('update article status error', error)
      return res.status(500).json({ error: 'Error interno al actualizar el estado del artículo.' })
    }
  }
)

router.delete('/:id', requireAuth, requireRole(Role.CREADOR, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN), async (req, res) => {
  try {
    await deleteArticle(req.params.id, req.userProfile!)
    return res.status(200).json({ ok: true })
  } catch (error) {
    if (error instanceof ArticlesApiError) return res.status(error.status).json({ error: error.message })
    console.error('delete article error', error)
    return res.status(500).json({ error: 'Error interno al eliminar el artículo.' })
  }
})

export default router
