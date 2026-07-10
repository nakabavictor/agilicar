import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

function AguardandoAprovacao({ onNavigate, onVoltar, onAtualizarStatus, osAtual }) {
  const [notificacoesOS, setNotificacoesOS] = useState([])

  useEffect(() => {
    if (osAtual?.idOs) {
      ordensServico.listarNotificacoes(osAtual.idOs)
        .then(lista => setNotificacoesOS(lista || []))
        .catch(() => {})
    }
  }, [osAtual?.idOs])

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="aprovacao-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill blue-pill">Aguardando Aprovação</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="aprovacao-card">
          <div className="success-message">
            <div className="info-icon">i</div>
            <div>
              <strong>Orçamento enviado com sucesso!</strong>
              <span>Aguardando retorno do cliente.</span>
            </div>
          </div>

          <div className="historico-section">
            <h3>Histórico de Comunicação</h3>
            <div className="historico-list">
              {notificacoesOS.length > 0 ? notificacoesOS.map(n => (
                <div className="historico-item" key={n.idNotificacao}>
                  <div className="historico-icon whatsapp-icon">☘</div>
                  <div className="historico-info">
                    <strong>{n.mensagem}</strong>
                    <span>{n.tipo} • {new Date(n.dataEnvio).toLocaleString('pt-BR')}</span>
                  </div>
                  <span className="historico-status enviado">Enviado</span>
                </div>
              )) : (
                <>
                  <div className="historico-item">
                    <div className="historico-icon whatsapp-icon">☘</div>
                    <div className="historico-info">
                      <strong>Orçamento enviado ao cliente</strong>
                      <span>Cliente notificado sobre o orçamento.</span>
                    </div>
                    <span className="historico-status enviado">Enviado</span>
                  </div>
                  <div className="historico-item">
                    <div className="historico-icon email-icon">✉</div>
                    <div className="historico-info">
                      <strong>Aguardando aprovação do cliente</strong>
                      <span>Retorno pendente para continuidade do serviço.</span>
                    </div>
                    <span className="historico-status aguardando">Aguardando</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="aprovacao-actions">
            <button className="btn-outline atualizar-status-btn" type="button" onClick={onAtualizarStatus}>
              Atualizar Status
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default AguardandoAprovacao
