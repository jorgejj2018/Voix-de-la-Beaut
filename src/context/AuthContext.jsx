import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import {
  login,
  register,
  logout,
  loginWithGoogle,
  updateUserProfile,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const unsubscribeProfileRef = useRef(null)

  useEffect(() => {
    const safetyTimeout = setTimeout(() => setAuthLoading(false), 5000)

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      clearTimeout(safetyTimeout)

      if (unsubscribeProfileRef.current) {
        unsubscribeProfileRef.current()
        unsubscribeProfileRef.current = null
      }

      setCurrentUser(user)

      if (!user) {
        setUserProfile(null)
        setAuthLoading(false)
        return
      }

      unsubscribeProfileRef.current = onSnapshot(
        doc(db, 'users', user.uid),
        (snapshot) => {
          setUserProfile(snapshot.exists() ? snapshot.data() : null)
          setAuthLoading(false)
        }
      )
    })

    return () => {
      clearTimeout(safetyTimeout)
      unsubscribeAuth()
      if (unsubscribeProfileRef.current) unsubscribeProfileRef.current()
    }
  }, [])

  const value = {
    currentUser,
    userProfile,
    authLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
