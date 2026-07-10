import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { servicos } from '../../services/api.js'

function Servicos({ onNavigate }) {
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [confirmando, setConfirmando] = useState(null)
  const [erro, setErro] = useState('')
  const [nomeServico, setNomeServico] = useState('')
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('0')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try { setLista((await servicos.listar()) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  function abrirNovo() {
    setEditando(null)
    setNomeServico(''); setDescricao(''); setValor('0')
    setErro(''); setFormAberto(true)
  }

  function abrirEdicao(s) {
    setEditando(s)
    setNomeServico(s.nomeServico || ''); setDescricao(s.descricao || ''); setValor(String(s.valor ?? 0))
    setErro(''); setFormAberto(true)
  }

  function fechar() { setFormAberto(false); setEditando(null); setErro('') }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nomeServico.trim()) { setErro('Nome do serviço é obrigatório.'); return }
    setSalvando(true); setErro('')
    try {
      const dados = { nomeServico, descricao, valor: parseFloat(valor) }
      if (editando) await servicos.atualizar(editando.idServico, dados)
      else await servicos.criar(dados)
      await carregar(); fechar()
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function handleDeletar(s) {
    try { await servicos.deletar(s.idServico); setConfirmando(null); await carregar() }
    catch (e) { setErro(e.message); setConfirmando(null) }
  }

  const filtrados = lista.filter(s => {
    if (!busca) return true
    const b = busca.toLowerCase()
    return s.nomeServico?.toLowerCase().includes(b) || s.descricao?.toLowerCase().includes(b)
  })

  return (
    <AppLayout active="servicos" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div><h2>Serviços</h2><p>Catálogo de serviços oferecidos pela oficina.</p></div>
          <button className="btn-new" type="button" onClick={abrirNovo}>+ Novo Serviço</button>
        </div>

        {formAberto && (
          <div className="crud-form-card">
            <h3>{editando ? 'Editar Serviço' : 'Novo Serviço'}</h3>
            <form onSubmit={handleSalvar}>
              <div className="crud-form-grid">
                <label>Nome *<input value={nomeServico} onChange={e => setNomeServico(e.target.value)} placeholder="Ex: Troca de óleo" /></label>
                <label>Valor Padrão (R$)<input type="number" min="0" step="0.01" value={valor} onChange={e => setValor(e.target.value)} /></label>
                <label className="span-2">Descrição<input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descreva o serviço..." /></label>
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
          <input placeholder="Buscar por nome ou descrição..." value={busca} onChange={e => setBusca(e.target.value)} />
        </div>

        {erro && !formAberto && <p className="form-error">{erro}</p>}

        {carregando ? <p className="crud-empty">Carregando...</p> : (
          <div className="crud-table">
            <div className="crud-table-header" style={{ gridTemplateColumns: '2fr 2fr 1fr 150px' }}>
              <span>Nome</span><span>Descrição</span><span>Valor Padrão</span><span>Ações</span>
            </div>
            {filtrados.length === 0 && <p className="crud-empty">Nenhum serviço encontrado.</p>}
            {filtrados.map(s => (
              <div key={s.idServico}>
                <div className="crud-table-row" style={{ gridTemplateColumns: '2fr 2fr 1fr 150px' }}>
                  <strong>{s.nomeServico}</strong>
                  <span>{s.descricao || '—'}</span>
                  <span>R$ {Number(s.valor).toFixed(2).replace('.', ',')}</span>
                  <div className="crud-row-actions">
                    <button type="button" className="btn-edit" onClick={() => abrirEdicao(s)}>Editar</button>
                    <button type="button" className="btn-delete" onClick={() => setConfirmando(s)}>Excluir</button>
                  </div>
                </div>
                {confirmando?.idServico === s.idServico && (
                  <div className="crud-confirm-row">
                    <span>Confirmar exclusão de <strong>{s.nomeServico}</strong>?</span>
                    <button className="btn-delete" type="button" onClick={() => handleDeletar(s)}>Sim, excluir</button>
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

export default Servicos
