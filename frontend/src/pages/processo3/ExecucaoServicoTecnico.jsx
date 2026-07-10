import { useState, useEffect, useRef } from 'react'
import { ordensServico } from '../../services/api.js'

function ExecucaoServicoTecnico({ onVoltar, onServicoConcluido, onNavigate, osAtual }) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024

  const [status, setStatus] = useState('Em Execução')
  const [anotacoes, setAnotacoes] = useState('')
  const [fotos, setFotos] = useState([])
  const [erro, setErro] = useState('')
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [confirmandoConclusao, setConfirmandoConclusao] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [tempoDecorrido, setTempoDecorrido] = useState('00:00:00')
  const [atrasado, setAtrasado] = useState(false)

  const inicioRef = useRef(Date.now())

  const etapas = [
    'Diagnóstico inicial concluído',
    'Substituição das peças',
    'Teste de rodagem',
    'Check-list de qualidade',
  ]

  useEffect(() => {
    const id = setInterval(() => {
      const diff = Math.floor((Date.now() - inicioRef.current) / 1000)
      const h = String(Math.floor(diff / 3600)).padStart(2, '0')
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0')
      const s = String(diff % 60).padStart(2, '0')
      setTempoDecorrido(`${h}:${m}:${s}`)

      if (osAtual?.prazoEstimado) {
        setAtrasado(new Date() > new Date(osAtual.prazoEstimado))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [osAtual?.prazoEstimado])

  function handleFotosChange(event) {
    const arquivos = Array.from(event.target.files)
    if (!arquivos.length) return
    const grande = arquivos.find(a => a.size > MAX_FILE_SIZE)
    if (grande) { setErro('Cada foto deve ter no máximo 5MB.'); event.target.value = ''; return }
    const naoImagem = arquivos.find(a => !a.type.startsWith('image/'))
    if (naoImagem) { setErro('Selecione apenas arquivos de imagem.'); event.target.value = ''; return }
    const novas = arquivos.map(a => ({ nome: a.name, url: URL.createObjectURL(a), file: a }))
    setFotos(prev => [...prev, ...novas])
    setErro('')
    event.target.value = ''
  }

  function removerFoto(index) {
    setFotos(prev => prev.filter((_, i) => i !== index))
  }

  function marcarEtapaConcluida() {
    if (etapaAtual < etapas.length) setEtapaAtual(etapaAtual + 1)
  }

  function concluirServico() {
    if (!anotacoes.trim()) { setErro('Preencha as anotações técnicas antes de concluir.'); return }
    if (fotos.length < 2) { setErro('Adicione pelo menos 2 fotos do serviço antes de concluir.'); return }
    setErro('')
    setConfirmandoConclusao(true)
  }

  async function confirmarConclusaoServico() {
    setProcessando(true)
    setErro('')
    try {
      for (const foto of fotos) {
        await ordensServico.uploadFoto(osAtual.idOs, foto.file, 'durante', anotacoes)
      }
      setConfirmandoConclusao(false)
      onServicoConcluido()
    } catch (err) {
      setErro(err.message)
      setConfirmandoConclusao(false)
    } finally {
      setProcessando(false)
    }
  }

  const progresso = Math.round((etapaAtual / etapas.length) * 100)

  return (
    <main className="tecnico-page">
      <section className="tecnico-app">
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

        <div className="tecnico-content">
          <aside className="tecnico-os-panel">
            <button className="back-icon tecnico-back" type="button" onClick={onVoltar}>‹</button>
            <div className="tecnico-os-title">
              <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
              <span className="blue-pill">Em Execução</span>
            </div>

            <section className="tecnico-info-block">
              <h3>Tempo em execução</h3>
              <strong style={{ fontSize: '22px', fontVariantNumeric: 'tabular-nums', color: atrasado ? '#dc2626' : '#111' }}>
                {tempoDecorrido}
              </strong>
              {osAtual?.prazoEstimado && (
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  Prazo: {new Date(osAtual.prazoEstimado).toLocaleString('pt-BR')}
                </span>
              )}
            </section>

            <section className="tecnico-info-block">
              <h3>Veículo</h3>
              <strong>{osAtual?.marca} {osAtual?.modelo} • {osAtual?.placa}</strong>
              <span>Cliente: {osAtual?.nomeCliente}</span>
              {osAtual?.kilometragem && <span>KM entrada: {osAtual.kilometragem.toLocaleString()} km</span>}
            </section>

            <section className="tecnico-info-block">
              <h3>Problema relatado</h3>
              <p>{osAtual?.descricaoProblema ?? '—'}</p>
            </section>

            <section className="tecnico-info-block">
              <h3>Etapas do serviço</h3>
              <div className="etapas-list">
                {etapas.map((etapa, index) => (
                  <div key={etapa} className={`etapa-item ${
                    index + 1 < etapaAtual ? 'done' : index + 1 === etapaAtual ? 'current' : ''
                  }`}>
                    <span>{index + 1}</span>
                    <p>{etapa}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="tecnico-main-panel">
            {atrasado && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px',
                padding: '12px 16px', marginBottom: '20px', color: '#dc2626',
                display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600,
              }}>
                <span style={{ fontSize: '18px' }}>⚠</span>
                Atenção: o prazo estimado foi ultrapassado. Notifique o cliente sobre o atraso.
              </div>
            )}

            <div className="screen-title">
              <h2>Atualização de Status e Registro</h2>
              <p>Atualize o andamento do serviço e registre evidências da execução.</p>
            </div>

            <div className="tecnico-form-grid">
              <label>
                Status atual
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  <option>Em Execução</option>
                  <option>Aguardando Peça</option>
                  <option>Em Teste</option>
                  <option>Serviço Concluído</option>
                </select>
              </label>

              <label className="full">
                Anotações técnicas
                <textarea
                  placeholder="Descreva os procedimentos realizados, peças substituídas e observações do serviço..."
                  value={anotacoes}
                  onChange={e => { setAnotacoes(e.target.value); setErro('') }}
                />
              </label>
            </div>

            <div className="registro-fotos-section">
              <h3>Registro Fotográfico</h3>
              <div className="tecnico-fotos-grid">
                {fotos.map((foto, index) => (
                  <div className="tecnico-foto-preview" key={foto.url}>
                    <button type="button" onClick={() => removerFoto(index)}>×</button>
                    <img src={foto.url} alt={foto.nome} />
                  </div>
                ))}
                <label htmlFor="fotos-servico" className="add-foto-card">
                  <span>+</span>
                  <p>Adicionar foto</p>
                  <small>Máx. 5MB</small>
                </label>
                <input id="fotos-servico" className="input-file-hidden" type="file"
                  accept="image/*" multiple onChange={handleFotosChange} />
              </div>
            </div>

            <div className="progresso-section">
              <div className="progresso-header">
                <strong>Progresso</strong>
                <span>Etapa {etapaAtual} de {etapas.length} • {progresso}%</span>
              </div>
              <div className="progress-bar">
                <div style={{ width: `${progresso}%` }} />
              </div>
            </div>

            {erro && <p className="form-error">{erro}</p>}

            <div className="tecnico-actions">
              <button className="btn-outline" type="button">Salvar Rascunho</button>
              <button className="btn-main" type="button" onClick={marcarEtapaConcluida}>
                Marcar Etapa Concluída
              </button>
              <button className="btn-danger" type="button" onClick={concluirServico}>
                Serviço Concluído
              </button>
            </div>

            <div className="tecnico-alertas">
              <span>Upload mínimo de 2 fotos para concluir o serviço</span>
            </div>
          </section>
        </div>
      </section>

      {confirmandoConclusao && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <div className="confirm-icon">✓</div>
            <h2>Confirmar conclusão do serviço?</h2>
            <p>Ao confirmar, você avançará para o check-list de qualidade antes da liberação do veículo.</p>
            <div className="confirm-actions">
              <button className="btn-outline" type="button"
                onClick={() => setConfirmandoConclusao(false)} disabled={processando}>
                Cancelar
              </button>
              <button className="btn-main" type="button" onClick={confirmarConclusaoServico} disabled={processando}>
                {processando ? 'Processando...' : 'Confirmar Conclusão'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default ExecucaoServicoTecnico
