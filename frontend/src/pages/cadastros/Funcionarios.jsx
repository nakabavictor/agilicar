import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { usuarios } from '../../services/api.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

const PERFIS = [
  { id: 1, label: 'Gestor' },
  { id: 2, label: 'Atendente' },
  { id: 3, label: 'Técnico' },
]

const PERFIL_BADGE = { Gestor: '#7c3aed', Atendente: '#1d4ed8', Técnico: '#0891b2' }

function Funcionarios({ onNavigate }) {
  const { usuario: usuarioLogado } = useAuth()
  const isGestor = usuarioLogado?.perfil === 'gestor'

  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [idPerfil, setIdPerfil] = useState('2')

  useEffect(() => { carregar() }, [filtroPerfil])

  async function carregar() {
    setCarregando(true)
    try {
      const perfil = filtroPerfil ? Number(filtroPerfil) : undefined
      setLista((await usuarios.listar(perfil)) || [])
    } catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  function abrirNovo() {
    setEditando(null)
    setNome(''); setEmail(''); setSenha(''); setIdPerfil('2')
    setErro(''); setFormAberto(true)
  }

  function abrirEdicao(u) {
    setEditando(u)
    setNome(u.nome || ''); setEmail(u.email || ''); setSenha(''); setIdPerfil(String(u.idPerfil || 2))
    setErro(''); setFormAberto(true)
  }

  function fechar() { setFormAberto(false); setEditando(null); setErro('') }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) { setErro('Nome e e-mail são obrigatórios.'); return }
    if (!editando && !senha.trim()) { setErro('Senha é obrigatória para novo funcionário.'); return }
    setSalvando(true); setErro('')
    try {
      const dados = { nome, email, idPerfil: Number(idPerfil), ...(senha ? { senha } : {}) }
      if (editando) await usuarios.atualizar(editando.idUsuario, { ...dados, senha: senha || undefined })
      else await usuarios.criar(dados)
      await carregar(); fechar()
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function handleDesativar(u) {
    if (!confirm(`Desativar "${u.nome}"?`)) return
    try { await usuarios.deletar(u.idUsuario); await carregar() }
    catch (e) { setErro(e.message) }
  }

  const filtrados = lista.filter(u => {
    if (!busca) return true
    const b = busca.toLowerCase()
    return u.nome?.toLowerCase().includes(b) || u.email?.toLowerCase().includes(b)
  })

  return (
    <AppLayout active="funcionarios" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div>
            <h2>Funcionários</h2>
            <p>Gerencie os usuários do sistema. Total: {lista.length}</p>
          </div>
          {isGestor && (
            <button className="btn-new" type="button" onClick={abrirNovo}>
              + Novo Funcionário
            </button>
          )}
        </div>

        {!isGestor && (
          <div className="info-banner">Somente gestores podem cadastrar ou editar funcionários.</div>
        )}

        {formAberto && isGestor && (
          <div className="crud-form-card">
            <h3>{editando ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
            <form onSubmit={handleSalvar}>
              <div className="crud-form-grid">
                <label>Nome *<input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" /></label>
                <label>E-mail *<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@agilicar.com" /></label>
                <label>
                  Senha {editando ? '(deixe em branco para manter)' : '*'}
                  <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
                </label>
                <label>
                  Perfil
                  <select value={idPerfil} onChange={e => setIdPerfil(e.target.value)}>
                    {PERFIS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </label>
                {erro && <p className="form-error span-2">{erro}</p>}
                <div className="crud-form-actions span-2">
                  <button type="button" className="btn-outline" onClick={fechar}>Cancelar</button>
                  <button type="submit" className="btn-main" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="crud-toolbar">
          <input
            className="crud-search-input"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <select value={filtroPerfil} onChange={e => setFiltroPerfil(e.target.value)}>
            <option value="">Todos os perfis</option>
            {PERFIS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </div>

        {carregando ? <p className="crud-empty">Carregando...</p> : (
          <div className="crud-table">
            <div className="crud-table-header" style={{ gridTemplateColumns: '2fr 2fr 1fr 100px 160px' }}>
              <span>Nome</span><span>E-mail</span><span>Perfil</span><span>Status</span><span>Ações</span>
            </div>
            {filtrados.length === 0 && <p className="crud-empty">Nenhum funcionário encontrado.</p>}
            {filtrados.map(u => (
              <div className="crud-table-row" key={u.idUsuario} style={{ gridTemplateColumns: '2fr 2fr 1fr 100px 160px' }}>
                <strong>{u.nome}</strong>
                <span>{u.email}</span>
                <span style={{
                  color: PERFIL_BADGE[u.nomePerfil] ?? '#374151',
                  fontWeight: 600,
                }}>
                  {u.nomePerfil}
                </span>
                <span className={u.ativo ? 'badge-ok' : 'badge-inactive'}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                {isGestor ? (
                  <div className="crud-row-actions">
                    <button type="button" className="btn-edit" onClick={() => abrirEdicao(u)}>Editar</button>
                    {u.ativo && (
                      <button type="button" className="btn-delete" onClick={() => handleDesativar(u)}>Desativar</button>
                    )}
                  </div>
                ) : <span />}
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default Funcionarios
