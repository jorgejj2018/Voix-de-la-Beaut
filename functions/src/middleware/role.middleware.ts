import { NextFunction, Request, Response } from 'express'
import { Role } from '../models/User'

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.userProfile?.role

    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción.' })
    }

    return next()
  }
}
