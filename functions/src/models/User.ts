export enum Role {
  LECTOR = 'lector',
  CREADOR = 'creador',
  ADMIN = 'admin',
  EMPRESA = 'empresa',
  SUPERADMIN = 'superadmin',
  AUTHOR = 'author', // compatibilidad con registros anteriores
}

export interface User {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  role: Role
  companyName: string | null
  companyId: string | null
  status: 'active' | 'suspended'
  bio: string | null
  favoriteIds?: string[]
  createdAt?: unknown
  updatedAt?: unknown
  deleted?: boolean
}

export interface RegisterInput {
  displayName: string
  email: string
  password: string
  accountType?: 'independiente' | 'empresa'
  companyName?: string | null
}

export interface LoginInput {
  email: string
  password: string
}
