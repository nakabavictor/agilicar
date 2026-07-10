import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { clientes } from '../../services/api.js'

function Clientes({ onNavigate }) {
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmando, setConfirmando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [endereco, setEndereco] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try { setLista((await clientes.listar()) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  function abrirNovo() {
    setEditando(null)
    setNome(''); setCpf(''); setTelefone(''); setEmail(''); setEndereco('')
    setErro(''); setFormAberto(true)
  }

  function abrirEdicao(c) {
    setEditando(c)
    setNome(c.nome || ''); setCpf(c.cpf || ''); setTelefone(c.telefone || '')
    setEmail(c.email || ''); setEndereco(c.endereco || '')
    setErro(''); setFormAberto(true)
  }

  function fechar() { setFormAberto(false); setEditando(null); setErro('') }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nome.trim()) { setErro('Nome é obrigatório.'); return }
    setSalvando(true); setErro('')
    try {
      const dados = { nome, cpf, telefone, email, endereco }
      if (editando) await clientes.atualizar(editando.idCliente, dados)
      else await clientes.criar(dados)
      await carregar(); fechar()
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function handleDeletar(c) {
    setExcluindo(true)
    try {
      await clientes.deletar(c.idCliente)
      setConfirmando(null)
      await carregar()
    } catch (e) {
      setErro(e.message)
      setConfirmando(null)
    } finally {
      setExcluindo(false)
    }
  }

  const filtrados = lista.filter(c => {
    if (!busca) return true
    const b = busca.toLowerCase()
    return c.nome?.toLowerCase().includes(b) || c.cpf?.includes(b) || c.telefone?.includes(b)
  })

  return (
    <AppLayout active="clientes" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div>
            <h2>Clientes</h2>
            <p>Gerencie os clientes cadastrados. Total: {lista.length}</p>
          </div>
          <button className="btn-new" type="button" onClick={abrirNovo}>
            + Novo Cliente
          </button>
        </div>

        {formAberto && (
          <div className="crud-form-card">
            <h3>{editando ? 'Editar Cliente' : 'Novo Cliente'}</h3>
            <form onSubmit={handleSalvar}>
              <div className="crud-form-grid">
                <label>Nome *<input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" /></label>
                <label>CPF<input value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" /></label>
                <label>Telefone<input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" /></label>
                <label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" /></label>
                <label className="span-2">Endereço<input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua, número, bairro..." /></label>
                {erro && <p className="form-error span-2">{erro}</p>}
                <div className="crud-form-actions span-2">
                  <button type="button" className="btn-outline" onClick={fechar}>Cancelar</button>
                  <button type="submit" className="btn-main" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="crud-search">
          <input placeholder="Buscar por nome, CPF ou telefone..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>

        {erro && !formAberto && <p className="form-error">{erro}</p>}

        {carregando ? <p className="crud-empty">Carregando...</p> : (
          <div className="crud-table">
            <div className="crud-table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.5fr 150px' }}>
              <span>Nome</span><span>CPF</span><span>Telefone</span><span>E-mail</span><span>Ações</span>
            </div>
            {filtrados.length === 0 && <p className="crud-empty">Nenhum cliente encontrado.</p>}
            {filtrados.map(c => (
              <div key={c.idCliente}>
                <div className="crud-table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1.5fr 150px' }}>
                  <strong>{c.nome}</strong>
                  <span>{c.cpf || '—'}</span>
                  <span>{c.telefone || '—'}</span>
                  <span>{c.email || '—'}</span>
                  <div className="crud-row-actions">
                    <button type="button" className="btn-edit" onClick={() => abrirEdicao(c)}>Editar</button>
                    <button type="button" className="btn-delete" onClick={() => { setConfirmando(c); setErro('') }}>Excluir</button>
                  </div>
                </div>
                {confirmando?.idCliente === c.idCliente && (
                  <div className="crud-confirm-row">
                    <span>Excluir <strong>{c.nome}</strong>? Esta ação não pode ser desfeita.</span>
                    <button className="btn-delete" type="button" onClick={() => handleDeletar(c)} disabled={excluindo}>
                      {excluindo ? '...' : 'Confirmar'}
                    </button>
                    <button className="btn-outline" type="button" onClick={() => setConfirmando(null)}>Cancelar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default Clientes
