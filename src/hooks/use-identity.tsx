import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type User = 'Ana' | 'Ali' | null

interface IdentityContextType {
  currentUser: User
  setCurrentUser: (user: User) => void
  partner: 'Ana' | 'Ali'
  isIdentitySet: boolean
  switchUser: () => void
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('kaustuandriji_identity')
    if (stored === 'Ana' || stored === 'Ali') {
      setCurrentUserState(stored)
    }
    setIsLoaded(true)
  }, [])

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user)
    if (user) {
      localStorage.setItem('kaustuandriji_identity', user)
    } else {
      localStorage.removeItem('kaustuandriji_identity')
    }
  }

  const switchUser = () => {
    const newUser = currentUser === 'Ana' ? 'Ali' : 'Ana'
    setCurrentUser(newUser)
  }

  const partner = currentUser === 'Ana' ? 'Ali' : 'Ana'
  const isIdentitySet = currentUser !== null

  if (!isLoaded) {
    return null
  }

  return (
    <IdentityContext.Provider value={{ currentUser, setCurrentUser, partner, isIdentitySet, switchUser }}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity() {
  const context = useContext(IdentityContext)
  if (context === undefined) {
    throw new Error('useIdentity must be used within an IdentityProvider')
  }
  return context
}
