import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { pecas, estoque as estoqueApi } from '../../services/api.js'

function Estoque({ onNavigate }) {
  const [aba, setAba] = useState('inventario')

  // Inventário
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [filtroCritico, setFiltroCritico] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [ajustando, setAjustando] = useState(null)
  const [novaQtd, setNovaQtd] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  // Movimentações
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregandoMov, setCarregandoMov] = useState(false)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    setErro('')
    try { setLista((await pecas.listar()) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  async function carregarMovimentacoes() {
    setCarregandoMov(true)
    try { setMovimentacoes((await estoqueApi.movimentacoes()) || []) }
    catch { setMovimentacoes([]) }
    finally { setCarregandoMov(false) }
  }

  function handleAbaChange(novaAba) {
    setAba(novaAba)
    if (novaAba === 'movimentacoes' && movimentacoes.length === 0) {
      carregarMovimentacoes()
    }
  }

  async function handleAjustar(p) {
    if (novaQtd === '' || isNaN(Number(novaQtd))) { setErro('Informe uma quantidade válida.'); return }
    setSalvando(true); setErro('')
    try {
      await pecas.atualizar(p.idPeca, {
        nomePeca: p.nomePeca, descricao: p.descricao, codigo: p.codigo,
        fornecedor: p.fornecedor, quantidade: Number(novaQtd),
        valorUnitario: p.valorUnitario, estoqueMinimo: p.estoqueMinimo, localizacao: p.localizacao,
      })
      await carregar(); setAjustando(null); setNovaQtd('')
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  const filtrados = lista
    .filter(p => !filtroCritico || p.estoqueCritico)
    .filter(p => {
      if (!busca) return true
      const b = busca.toLowerCase()
      return p.nomePeca?.toLowerCase().includes(b) || p.codigo?.toLowerCase().includes(b)
    })

  const totalItens = lista.length
  const totalCritico = lista.filter(p => p.estoqueCritico).length
  const valorTotal = lista.reduce((acc, p) => acc + (p.valorUnitario * (p.quantidadeDisponivel ?? p.quantidade)), 0)

  return (
    <AppLayout active="estoque" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div><h2>Estoque</h2><p>Controle de quantidade e movimentações das peças.</p></div>
          <button className="btn-new" type="button" onClick={aba === 'inventario' ? carregar : carregarMovimentacoes}>
            ↺ Atualizar
          </button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="stat-card">
            <div className="stat-label">Total de Itens</div>
            <div className="stat-value">{totalItens}</div>
            <div className="stat-sub">peças cadastradas</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Estoque Crítico</div>
            <div className="stat-value" style={{ color: totalCritico > 0 ? '#dc2626' : '#16a34a' }}>{totalCritico}</div>
            <div className="stat-sub">abaixo do mínimo</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Valor em Estoque</div>
            <div className="stat-value" style={{ fontSize: '20px' }}>R$ {valorTotal.toFixed(2).replace('.', ',')}</div>
            <div className="stat-sub">valor total estimado</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { key: 'inventario', label: 'Inventário' },
            { key: 'movimentacoes', label: 'Movimentações' },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleAbaChange(tab.key)}
              style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                fontWeight: aba === tab.key ? 700 : 400,
                color: aba === tab.key ? '#1d4ed8' : '#6b7280',
                borderBottom: aba === tab.key ? '2px solid #1d4ed8' : '2px solid transparent',
                marginBottom: '-2px', fontSize: '14px', transition: 'color 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {aba === 'inventario' && (
          <>
            <div className="crud-toolbar">
              <input className="crud-search-input" placeholder="Buscar por nome ou código..." value={busca}
                onChange={e => setBusca(e.target.value)} />
              <label className="crud-check">
                <input type="checkbox" checked={filtroCritico} onChange={e => setFiltroCritico(e.target.checked)} />
                Apenas estoque crítico
              </label>
            </div>

            {carregando ? <p className="crud-empty">Carregando...</p> : (
              <div className="crud-table">
                <div className="crud-table-header" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px 140px' }}>
                  <span>Peça</span><span>Disponível</span><span>Mínimo</span>
                  <span>Valor Unit.</span><span>Local</span><span>Status</span><span>Ações</span>
                </div>
                {filtrados.length === 0 && <p className="crud-empty">Nenhuma peça encontrada.</p>}
                {filtrados.map(p => (
                  <div key={p.idPeca}>
                    <div className="crud-table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 80px 140px' }}>
                      <div>
                        <strong>{p.nomePeca}</strong>
                        {p.codigo && <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>{p.codigo}</span>}
                      </div>
                      <span style={{ fontWeight: 600, color: p.estoqueCritico ? '#dc2626' : '#111' }}>
                        {p.quantidadeDisponivel ?? p.quantidade}
                      </span>
                      <span>{p.estoqueMinimo}</span>
                      <span>R$ {Number(p.valorUnitario).toFixed(2).replace('.', ',')}</span>
                      <span>{p.localizacao || '—'}</span>
                      <span className={p.estoqueCritico ? 'badge-critical' : 'badge-ok'}>
                        {p.estoqueCritico ? 'Crítico' : 'OK'}
                      </span>
                      <div className="crud-row-actions">
                        <button type="button" className="btn-edit"
                          onClick={() => { setAjustando(p); setNovaQtd(String(p.quantidadeDisponivel ?? p.quantidade)); setErro('') }}>
                          Ajustar
                        </button>
                      </div>
                    </div>
                    {ajustando?.idPeca === p.idPeca && (
                      <div className="crud-confirm-row">
                        <span>Nova quantidade para <strong>{p.nomePeca}</strong>:</span>
                        <input type="number" min="0" value={novaQtd} onChange={e => setNovaQtd(e.target.value)}
                          style={{ width: '80px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                        <button className="btn-main" type="button" onClick={() => handleAjustar(p)} disabled={salvando}>
                          {salvando ? '...' : 'Salvar'}
                        </button>
                        <button className="btn-outline" type="button" onClick={() => setAjustando(null)}>Cancelar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {aba === 'movimentacoes' && (
          <>
            {carregandoMov ? (
              <p className="crud-empty">Carregando movimentações...</p>
            ) : movimentacoes.length === 0 ? (
              <p className="crud-empty">Nenhuma movimentação registrada.</p>
            ) : (
              <div className="crud-table">
                <div className="crud-table-header" style={{ gridTemplateColumns: '80px 2fr 1fr 1fr 1fr' }}>
                  <span>OS</span><span>Peça</span><span>Qtd.</span><span>Tipo</span><span>Data</span>
                </div>
                {movimentacoes.map((m, i) => (
                  <div key={i} className="crud-table-row" style={{ gridTemplateColumns: '80px 2fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight: 600 }}>OS-{String(m.idOs).padStart(6, '0')}</span>
                    <div>
                      <strong>{m.nomePeca}</strong>
                      {m.nomeCliente && (
                        <span style={{ fontSize: '12px', color: '#6b7280', display: 'block' }}>{m.nomeCliente}</span>
                      )}
                    </div>
                    <span style={{ color: '#dc2626', fontWeight: 600 }}>-{m.quantidade}</span>
                    <span style={{ fontSize: '12px', color: '#4b5563' }}>Consumo OS</span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {m.dataAbertura ? new Date(m.dataAbertura).toLocaleDateString('pt-BR') : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </AppLayout>
  )
}

export default Estoque
