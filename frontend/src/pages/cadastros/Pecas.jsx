import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { pecas } from '../../services/api.js'

function Pecas({ onNavigate }) {
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [apenasExCritico, setApenasExCritico] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [confirmando, setConfirmando] = useState(null)
  const [erro, setErro] = useState('')
  const [nomePeca, setNomePeca] = useState('')
  const [descricao, setDescricao] = useState('')
  const [codigo, setCodigo] = useState('')
  const [fornecedor, setFornecedor] = useState('')
  const [quantidade, setQuantidade] = useState('0')
  const [valorUnitario, setValorUnitario] = useState('0')
  const [estoqueMinimo, setEstoqueMinimo] = useState('1')
  const [localizacao, setLocalizacao] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try { setLista((await pecas.listar()) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  function abrirNovo() {
    setEditando(null)
    setNomePeca(''); setDescricao(''); setCodigo(''); setFornecedor('')
    setQuantidade('0'); setValorUnitario('0'); setEstoqueMinimo('1'); setLocalizacao('')
    setErro(''); setFormAberto(true)
  }

  function abrirEdicao(p) {
    setEditando(p)
    setNomePeca(p.nomePeca || ''); setDescricao(p.descricao || ''); setCodigo(p.codigo || '')
    setFornecedor(p.fornecedor || ''); setQuantidade(String(p.quantidade ?? 0))
    setValorUnitario(String(p.valorUnitario ?? 0)); setEstoqueMinimo(String(p.estoqueMinimo ?? 1))
    setLocalizacao(p.localizacao || '')
    setErro(''); setFormAberto(true)
  }

  function fechar() { setFormAberto(false); setEditando(null); setErro('') }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!nomePeca.trim()) { setErro('Nome da peça é obrigatório.'); return }
    setSalvando(true); setErro('')
    try {
      const dados = {
        nomePeca, descricao, codigo, fornecedor,
        quantidade: Number(quantidade), valorUnitario: parseFloat(valorUnitario),
        estoqueMinimo: Number(estoqueMinimo), localizacao,
      }
      if (editando) await pecas.atualizar(editando.idPeca, dados)
      else await pecas.criar(dados)
      await carregar(); fechar()
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  async function handleDeletar(p) {
    try { await pecas.deletar(p.idPeca); setConfirmando(null); await carregar() }
    catch (e) { setErro(e.message); setConfirmando(null) }
  }

  const filtrados = lista
    .filter(p => !apenasExCritico || p.estoqueCritico)
    .filter(p => {
      if (!busca) return true
      const b = busca.toLowerCase()
      return p.nomePeca?.toLowerCase().includes(b) || p.codigo?.toLowerCase().includes(b) || p.fornecedor?.toLowerCase().includes(b)
    })

  return (
    <AppLayout active="pecas" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div><h2>Peças</h2><p>Catálogo de peças disponíveis para os serviços.</p></div>
          <button className="btn-new" type="button" onClick={abrirNovo}>+ Nova Peça</button>
        </div>

        {formAberto && (
          <div className="crud-form-card">
            <h3>{editando ? 'Editar Peça' : 'Nova Peça'}</h3>
            <form onSubmit={handleSalvar}>
              <div className="crud-form-grid">
                <label>Nome *<input value={nomePeca} onChange={e => setNomePeca(e.target.value)} placeholder="Ex: Amortecedor dianteiro" /></label>
                <label>Código<input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: AMT-001" /></label>
                <label>Fornecedor<input value={fornecedor} onChange={e => setFornecedor(e.target.value)} placeholder="Nome do fornecedor" /></label>
                <label>Localização<input value={localizacao} onChange={e => setLocalizacao(e.target.value)} placeholder="Ex: Prateleira A-3" /></label>
                <label>Qtd. em Estoque<input type="number" min="0" value={quantidade} onChange={e => setQuantidade(e.target.value)} /></label>
                <label>Estoque Mínimo<input type="number" min="0" value={estoqueMinimo} onChange={e => setEstoqueMinimo(e.target.value)} /></label>
                <label>Valor Unitário (R$)<input type="number" min="0" step="0.01" value={valorUnitario} onChange={e => setValorUnitario(e.target.value)} /></label>
                <label>Descrição<input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição opcional" /></label>
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
          <input className="crud-search-input" placeholder="Buscar por nome, código ou fornecedor..." value={busca} onChange={e => setBusca(e.target.value)} />
          <label className="crud-check">
            <input type="checkbox" checked={apenasExCritico} onChange={e => setApenasExCritico(e.target.checked)} />
            Apenas estoque crítico
          </label>
        </div>

        {erro && !formAberto && <p className="form-error">{erro}</p>}

        {carregando ? <p className="crud-empty">Carregando...</p> : (
          <div className="crud-table">
            <div className="crud-table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px 150px' }}>
              <span>Nome</span><span>Código</span><span>Estoque</span><span>Valor Unit.</span><span>Mínimo</span><span>Status</span><span>Ações</span>
            </div>
            {filtrados.length === 0 && <p className="crud-empty">Nenhuma peça encontrada.</p>}
            {filtrados.map(p => (
              <div key={p.idPeca}>
                <div className="crud-table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px 150px' }}>
                  <strong>{p.nomePeca}</strong>
                  <span>{p.codigo || '—'}</span>
                  <span>{p.quantidadeDisponivel ?? p.quantidade}</span>
                  <span>R$ {Number(p.valorUnitario).toFixed(2).replace('.', ',')}</span>
                  <span>{p.estoqueMinimo}</span>
                  <span className={p.estoqueCritico ? 'badge-critical' : 'badge-ok'}>{p.estoqueCritico ? 'Crítico' : 'OK'}</span>
                  <div className="crud-row-actions">
                    <button type="button" className="btn-edit" onClick={() => abrirEdicao(p)}>Editar</button>
                    <button type="button" className="btn-delete" onClick={() => setConfirmando(p)}>Excluir</button>
                  </div>
                </div>
                {confirmando?.idPeca === p.idPeca && (
                  <div className="crud-confirm-row">
                    <span>Confirmar exclusão de <strong>{p.nomePeca}</strong>?</span>
                    <button className="btn-delete" type="button" onClick={() => handleDeletar(p)}>Sim, excluir</button>
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

export default Pecas
