import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

function ResultadoFinal({
  onNavigate,
  onVoltar,
  resultado,
  onIniciarExecucao,
  onRevisarOrcamento,
  onEncerrarOS,
  osAtual,
}) {
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const [processando, setProcessando] = useState(false)

  async function handleEncerrarOS() {
    if (!motivo.trim()) {
      setErro('Informe o motivo da não aprovação antes de encerrar a OS.')
      return
    }
    setProcessando(true)
    setErro('')
    try {
      await ordensServico.atualizarStatus(osAtual.idOs, 'cancelada')
      onEncerrarOS()
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  async function handleIniciarExecucao() {
    if (!osAtual?.idOs) {
      onIniciarExecucao()
      return
    }
    setProcessando(true)
    setErro('')
    try {
      await ordensServico.atualizarStatus(osAtual.idOs, 'em_execucao')
      onIniciarExecucao()
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="resultado-final-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            {resultado === 'aprovado' ? (
              <span className="status-pill approved-pill">Aprovado</span>
            ) : (
              <span className="status-pill rejected-pill">Não Aprovado</span>
            )}
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="resultado-final-card">
          {resultado === 'aprovado' && (
            <>
              <div className="resultado-message approved-message">
                <div className="resultado-icon approved-icon">✓</div>
                <div>
                  <strong>Orçamento aprovado!</strong>
                  <span>Veículo encaminhado para execução do serviço.</span>
                </div>
              </div>
              {erro && <p className="form-error">{erro}</p>}
              <div className="resultado-actions">
                <button className="btn-main iniciar-execucao-btn" type="button"
                  onClick={handleIniciarExecucao} disabled={processando}>
                  {processando ? 'Aguarde...' : 'Iniciar Execução'}
                </button>
              </div>
            </>
          )}

          {resultado === 'naoAprovado' && (
            <>
              <div className="resultado-message rejected-message">
                <div className="resultado-icon rejected-icon">×</div>
                <div>
                  <strong>Orçamento não aprovado.</strong>
                  <span>Informe o motivo ou revise o orçamento da OS.</span>
                </div>
              </div>
              <div className="motivo-reprovacao">
                <label>
                  Motivo da Não Aprovação
                  <textarea
                    placeholder="Digite o motivo informado pelo cliente..."
                    value={motivo}
                    onChange={e => { setMotivo(e.target.value); setErro('') }}
                  />
                </label>
                {erro && <p className="form-error">{erro}</p>}
              </div>
              <div className="resultado-actions between">
                <button className="btn-outline revisar-orcamento-btn" type="button" onClick={onRevisarOrcamento}>
                  Revisar Orçamento
                </button>
                <button className="btn-danger encerrar-os-btn" type="button"
                  onClick={handleEncerrarOS} disabled={processando}>
                  {processando ? 'Encerrando...' : 'Encerrar OS'}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </AppLayout>
  )
}

export default ResultadoFinal
