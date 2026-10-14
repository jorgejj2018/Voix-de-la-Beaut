import { NextFunction, Request, Response } from 'express'
import { auth, db } from '../config/firebaseAdmin'
import { User } from '../models/User'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      uid?: string
      userProfile?: User
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Falta el token de autorización (Bearer <idToken>).' })
  }

  try {
    const decoded = await auth.verifyIdToken(token)
    req.uid = decoded.uid

    const snap = await db.collection('users').doc(decoded.uid).get()
    if (!snap.exists) {
      return res.status(401).json({ error: 'Perfil de usuario no encontrado.' })
    }

    req.userProfile = snap.data() as User
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado.' })
  }
}
