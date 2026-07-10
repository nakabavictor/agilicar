import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { orcamentos } from '../../services/api.js'

function DecisaoCliente({ onNavigate, onVoltar, onAprovar, onNaoAprovar, osAtual, orcamentoAtual }) {
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleAprovar() {
    if (!orcamentoAtual?.idOrcamento) {
      onAprovar()
      return
    }
    setProcessando(true)
    setErro('')
    try {
      await orcamentos.atualizarStatus(orcamentoAtual.idOrcamento, 'aprovado', '')
      onAprovar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  async function handleNaoAprovar() {
    if (!orcamentoAtual?.idOrcamento) {
      onNaoAprovar()
      return
    }
    setProcessando(true)
    setErro('')
    try {
      await orcamentos.atualizarStatus(orcamentoAtual.idOrcamento, 'reprovado', '')
      onNaoAprovar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="decisao-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill blue-pill">Aguardando Aprovação</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="decisao-card">
          <div className="screen-title">
            <h2>Resposta do Cliente</h2>
            <p>Registre a decisão do cliente sobre o orçamento enviado.</p>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="decisao-options">
            <div className="decisao-option approve">
              <div className="decisao-icon approve-icon">✓</div>
              <h3>Aprovar Orçamento</h3>
              <p>Cliente aprovou o orçamento e autorizou a execução do serviço.</p>
              <button type="button" onClick={handleAprovar} disabled={processando}>Aprovar</button>
            </div>
            <div className="decisao-option reject">
              <div className="decisao-icon reject-icon">×</div>
              <h3>Não Aprovar</h3>
              <p>Cliente não aprovou o orçamento ou deseja fazer alterações.</p>
              <button type="button" onClick={handleNaoAprovar} disabled={processando}>Não Aprovar</button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default DecisaoCliente
