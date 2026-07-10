import { createContext, useContext, useState, useEffect } from 'react'
import { auth as authApi } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('agilicar_token')
    const dados = localStorage.getItem('agilicar_usuario')
    if (token && dados) {
      setUsuario(JSON.parse(dados))
    }
    setCarregando(false)
  }, [])

  async function login(email, senha) {
    const res = await authApi.login(email, senha)
    localStorage.setItem('agilicar_token', res.token)
    localStorage.setItem('agilicar_usuario', JSON.stringify(res))
    setUsuario(res)
    return res
  }

  function logout() {
    localStorage.removeItem('agilicar_token')
    localStorage.removeItem('agilicar_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
