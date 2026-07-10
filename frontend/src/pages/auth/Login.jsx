import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext.jsx'
import AgiliLogo from '../../components/AgiliLogo.jsx'

function Login({ onLogin }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !senha.trim()) {
      setErro('Informe e-mail e senha.')
      return
    }

    setCarregando(true)
    setErro('')
    try {
      await login(email, senha)
      onLogin()
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <AgiliLogo />
        </div>

        <h2>Acesso ao Sistema</h2>
        <p className="login-sub">Faça login para continuar</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            E-mail
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro('') }}
              autoFocus
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro('') }}
            />
          </label>

          {erro && <p className="form-error">{erro}</p>}

          <button className="btn-main" type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-hint">
          <p><strong>Gestor:</strong> gestor@agilicar.com / admin123</p>
          <p><strong>Atendente:</strong> atendente@agilicar.com / atend123</p>
          <p><strong>Técnico:</strong> tecnico@agilicar.com / tec123</p>
        </div>
      </div>
    </main>
  )
}

export default Login
