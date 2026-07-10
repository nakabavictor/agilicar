import { useState } from 'react'
import { ordensServico } from '../../services/api.js'

const ITENS_QUALIDADE = [
  'Serviço executado conforme solicitado',
  'Peças instaladas corretamente',
  'Teste de rodagem e funcionamento realizado',
  'Ausência de vazamentos ou ruídos anômalos',
  'Limpeza interna e externa do veículo realizada',
  'Documentação e fotos do serviço registradas',
]

function ChecklistQualidade({ onVoltar, onAprovar, onNavigate, osAtual }) {
  const [marcados, setMarcados] = useState({})
  const [aprovando, setAprovando] = useState(false)
  const [erro, setErro] = useState('')

  const todosMarcados = ITENS_QUALIDADE.every((_, i) => marcados[i])

  function toggleItem(index) {
    setMarcados(prev => ({ ...prev, [index]: !prev[index] }))
    setErro('')
  }

  async function handleAprovar() {
    if (!todosMarcados) {
      setErro('Todos os itens devem ser verificados antes de liberar o veículo.')
      return
    }
    setAprovando(true)
    setErro('')
    try {
      await ordensServico.atualizarStatus(osAtual.idOs, 'concluida')
      onAprovar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setAprovando(false)
    }
  }

  const totalMarcados = ITENS_QUALIDADE.filter((_, i) => marcados[i]).length

  return (
    <main className="tecnico-page">
      <section className="tecnico-app" style={{ display: 'flex', flexDirection: 'column' }}>
        <header className="tecnico-header">
          <div className="tecnico-logo">AgiliCar</div>
          <nav className="tecnico-nav">
            <button type="button" onClick={() => onNavigate?.('inicio')}>Dashboard</button>
            <button className="active" type="button">Minhas OS</button>
            <button type="button" onClick={() => onNavigate?.('ordens')}>Histórico</button>
          </nav>
          <div className="tecnico-header-right">
            <div className="tecnico-user">{osAtual?.nomeCliente?.charAt(0) ?? 'T'}</div>
          </div>
        </header>

        <div style={{ flex: 1, padding: '32px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <button className="back-icon tecnico-back" type="button" onClick={onVoltar}
            style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
            ‹ Voltar
          </button>

          <div className="screen-title" style={{ marginBottom: '24px' }}>
            <h2>Check-list de Qualidade</h2>
            <p>
              OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')} —{' '}
              {osAtual?.marca} {osAtual?.modelo} • {osAtual?.placa}
            </p>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Verificação final do serviço</h3>
              <span style={{
                fontSize: '13px', fontWeight: 600,
                color: todosMarcados ? '#16a34a' : '#6b7280',
              }}>
                {totalMarcados}/{ITENS_QUALIDADE.length} itens verificados
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {ITENS_QUALIDADE.map((item, index) => (
                <label key={index} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '8px', cursor: 'pointer',
                  background: marcados[index] ? '#f0fdf4' : '#f9fafb',
                  border: `1px solid ${marcados[index] ? '#86efac' : '#e5e7eb'}`,
                  transition: 'all 0.15s',
                }}>
                  <input
                    type="checkbox"
                    checked={!!marcados[index]}
                    onChange={() => toggleItem(index)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#16a34a' }}
                  />
                  <span style={{ fontSize: '15px', color: marcados[index] ? '#15803d' : '#374151', fontWeight: marcados[index] ? 600 : 400 }}>
                    {item}
                  </span>
                  {marcados[index] && (
                    <span style={{ marginLeft: 'auto', color: '#16a34a', fontSize: '18px' }}>✓</span>
                  )}
                </label>
              ))}
            </div>

            <div style={{ background: '#f3f4f6', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Progresso</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{Math.round((totalMarcados / ITENS_QUALIDADE.length) * 100)}%</span>
              </div>
              <div style={{ background: '#e5e7eb', borderRadius: '999px', height: '8px', marginTop: '8px' }}>
                <div style={{
                  width: `${Math.round((totalMarcados / ITENS_QUALIDADE.length) * 100)}%`,
                  background: todosMarcados ? '#16a34a' : '#3b82f6',
                  height: '100%', borderRadius: '999px', transition: 'width 0.3s',
                }} />
              </div>
            </div>

            {!todosMarcados && (
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
                Verifique todos os itens antes de liberar o veículo para o cliente.
              </p>
            )}

            {erro && <p className="form-error">{erro}</p>}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-outline" type="button" onClick={onVoltar} disabled={aprovando}>
                Voltar
              </button>
              <button
                className="btn-main"
                type="button"
                onClick={handleAprovar}
                disabled={!todosMarcados || aprovando}
                style={{ opacity: todosMarcados ? 1 : 0.5 }}
              >
                {aprovando ? 'Aprovando...' : 'Aprovar e Liberar Veículo'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ChecklistQualidade
