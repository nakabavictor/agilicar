import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

const STATUS_LABEL = {
  aberta: 'Aberta',
  em_execucao: 'Em Execução',
  aguardando_aprovacao: 'Aguard. Aprovação',
  aguardando_peca: 'Aguard. Peça',
  concluida: 'Concluída',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
}
const STATUS_COLOR = {
  aberta: '#2563eb',
  em_execucao: '#d97706',
  aguardando_aprovacao: '#1d4ed8',
  aguardando_peca: '#7c3aed',
  concluida: '#16a34a',
  entregue: '#0891b2',
  cancelada: '#dc2626',
}

function KpiCard({ label, valor, formula, meta, cor, unidade = '' }) {
  const atingido = meta !== undefined && parseFloat(valor) >= meta
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', padding: '20px 24px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderLeft: `4px solid ${cor}`,
    }}>
      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: cor, lineHeight: 1 }}>
        {valor}{unidade}
      </div>
      {meta !== undefined && (
        <div style={{ fontSize: '12px', marginTop: '6px', color: atingido ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
          {atingido ? '✓ Meta atingida' : `✗ Meta: ≥ ${meta}${unidade}`}
        </div>
      )}
      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>{formula}</div>
    </div>
  )
}

function BarraStatus({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
        <span style={{ fontWeight: 600, color: '#374151' }}>{label}</span>
        <span style={{ color: '#6b7280' }}>{valor} OS ({pct}%)</span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '10px' }}>
        <div style={{ width: `${pct}%`, background: cor, height: '100%', borderRadius: '999px', transition: 'width 0.5s' }} />
      </div>
    </div>
  )
}

function Relatorios({ onNavigate }) {
  const [ordens, setOrdens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setCarregando(true)
    try { setOrdens((await ordensServico.listar()) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  const total = ordens.length
  const contagem = ordens.reduce((acc, os) => {
    acc[os.statusOs] = (acc[os.statusOs] || 0) + 1
    return acc
  }, {})

  const concluidas = (contagem.concluida || 0) + (contagem.entregue || 0)
  const canceladas = contagem.cancelada || 0
  const emAberto = (contagem.aberta || 0) + (contagem.em_execucao || 0) + (contagem.aguardando_peca || 0)

  const receita = ordens
    .filter(os => os.statusOs === 'concluida' || os.statusOs === 'entregue')
    .reduce((acc, os) => acc + Number(os.valorTotal ?? 0), 0)

  const taxaConclusao = total > 0 ? ((concluidas / total) * 100).toFixed(1) : '0.0'
  const taxaCancelamento = total > 0 ? ((canceladas / total) * 100).toFixed(1) : '0.0'
  const ticketMedio = concluidas > 0 ? (receita / concluidas).toFixed(2) : '0.00'

  const filtradas = ordens.filter(os => {
    const matchStatus = !filtroStatus || os.statusOs === filtroStatus
    const matchBusca = !busca || String(os.idOs).includes(busca) ||
      os.nomeCliente?.toLowerCase().includes(busca.toLowerCase()) ||
      os.placa?.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  return (
    <AppLayout active="relatorios" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div><h2>Relatórios e Indicadores</h2><p>Dashboard de desempenho da oficina e KPIs operacionais.</p></div>
          <button className="btn-new" type="button" onClick={carregar}>↺ Atualizar</button>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {/* KPIs */}
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#111' }}>Indicadores de Desempenho</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          <KpiCard
            label="Taxa de Conclusão de OS"
            valor={taxaConclusao}
            unidade="%"
            meta={70}
            cor="#16a34a"
            formula="(OS concluídas + entregues) / total de OS × 100"
          />
          <KpiCard
            label="Taxa de Cancelamento"
            valor={taxaCancelamento}
            unidade="%"
            cor="#dc2626"
            formula="OS canceladas / total de OS × 100"
          />
          <KpiCard
            label="Ticket Médio por OS"
            valor={`R$ ${ticketMedio.replace('.', ',')}`}
            cor="#2563eb"
            formula="Receita total / qtd. de OS concluídas"
          />
        </div>

        {/* Resumo cards */}
        <div className="stats-grid" style={{ marginBottom: '28px' }}>
          <div className="stat-card">
            <div className="stat-label">Total de OS</div>
            <div className="stat-value">{total}</div>
            <div className="stat-sub">todas as ordens</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Em Aberto</div>
            <div className="stat-value" style={{ color: '#2563eb' }}>{emAberto}</div>
            <div className="stat-sub">abertas + em execução</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Concluídas</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>{concluidas}</div>
            <div className="stat-sub">concluídas + entregues</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Receita Realizada</div>
            <div className="stat-value" style={{ fontSize: '18px' }}>R$ {receita.toFixed(2).replace('.', ',')}</div>
            <div className="stat-sub">OS concluídas/entregues</div>
          </div>
        </div>

        {/* Gráfico de barras por status */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '28px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '15px', color: '#111' }}>Distribuição de OS por Status</h3>
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <BarraStatus key={key} label={label} valor={contagem[key] || 0} total={total} cor={STATUS_COLOR[key]} />
          ))}
        </div>

        {/* Tabela de Ordens */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: '12px', borderBottom: '2px solid #e5e7eb', marginBottom: '16px',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>
              Tabela de Ordens de Serviço
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6b7280' }}>
              {filtradas.length} ordem{filtradas.length !== 1 ? 's' : ''} exibida{filtradas.length !== 1 ? 's' : ''}
              {(filtroStatus || busca) ? ' (filtro ativo)' : ''}
            </p>
          </div>
        </div>

        <div className="crud-toolbar">
          <input
            className="crud-search-input"
            placeholder="Buscar por OS, cliente ou placa..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="">Todos os status</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        {carregando ? <p className="crud-empty">Carregando...</p> : (
          <div className="crud-table">
            <div className="crud-table-header" style={{ gridTemplateColumns: '100px 1.5fr 1fr 1fr 130px 1fr' }}>
              <span>OS</span><span>Cliente</span><span>Veículo</span><span>Data</span><span>Status</span><span>Valor Total</span>
            </div>
            {filtradas.length === 0 && <p className="crud-empty">Nenhuma OS encontrada para o filtro aplicado.</p>}
            {filtradas.map(os => (
              <div className="crud-table-row" key={os.idOs} style={{ gridTemplateColumns: '100px 1.5fr 1fr 1fr 130px 1fr' }}>
                <strong>OS-{String(os.idOs).padStart(6, '0')}</strong>
                <span>{os.nomeCliente}</span>
                <span>{os.marca} {os.modelo} • {os.placa}</span>
                <span>{os.dataAbertura ? new Date(os.dataAbertura).toLocaleDateString('pt-BR') : '—'}</span>
                <span className={`status-pill ${os.statusOs ?? ''}`} style={{ fontSize: '12px', padding: '3px 10px' }}>
                  {STATUS_LABEL[os.statusOs] ?? os.statusOs}
                </span>
                <span>{os.valorTotal ? `R$ ${Number(os.valorTotal).toFixed(2).replace('.', ',')}` : '—'}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default Relatorios
