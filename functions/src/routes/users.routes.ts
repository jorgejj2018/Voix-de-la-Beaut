import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware'
import { requireRole } from '../middleware/role.middleware'
import { Role } from '../models/User'
import { UsersApiError, deleteUser, listUsers, setUserStatus, updateUserRole } from '../services/users.service'

const router = Router()

router.use(requireAuth)

router.get('/', requireRole(Role.ADMIN, Role.SUPERADMIN), async (_req, res) => {
  try {
    const users = await listUsers()
    return res.status(200).json({ users })
  } catch (error) {
    console.error('list users error', error)
    return res.status(500).json({ error: 'Error interno al listar usuarios.' })
  }
})

router.patch('/:id/role', requireRole(Role.SUPERADMIN), async (req, res) => {
  try {
    await updateUserRole(req.params.id, req.body.role)
    return res.status(200).json({ ok: true })
  } catch (error) {
    if (error instanceof UsersApiError) return res.status(error.status).json({ error: error.message })
    console.error('update role error', error)
    return res.status(500).json({ error: 'Error interno al actualizar el rol.' })
  }
})

router.patch('/:id/status', requireRole(Role.ADMIN, Role.SUPERADMIN, Role.EMPRESA), async (req, res) => {
  try {
    await setUserStatus(req.params.id, req.body.status, req.userProfile!)
    return res.status(200).json({ ok: true })
  } catch (error) {
    if (error instanceof UsersApiError) return res.status(error.status).json({ error: error.message })
    console.error('update status error', error)
    return res.status(500).json({ error: 'Error interno al actualizar el estado.' })
  }
})

router.delete('/:id', requireRole(Role.ADMIN, Role.SUPERADMIN), async (req, res) => {
  try {
    await deleteUser(req.params.id)
    return res.status(200).json({ ok: true })
  } catch (error) {
    if (error instanceof UsersApiError) return res.status(error.status).json({ error: error.message })
    console.error('delete user error', error)
    return res.status(500).json({ error: 'Error interno al eliminar el usuario.' })
  }
})

export default router
