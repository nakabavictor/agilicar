import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { notificacoes } from '../../services/api.js'

function EnviarOrcamento({ onNavigate, onVoltar, onEnviar, osAtual, orcamentoAtual }) {
  const [canalEnvio, setCanalEnvio] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function fmt(valor) {
    return `R$ ${Number(valor ?? 0).toFixed(2).replace('.', ',')}`
  }

  async function handleEnviar() {
    if (!canalEnvio) {
      setErro('Selecione um canal para envio do orçamento.')
      return
    }
    setEnviando(true)
    setErro('')
    try {
      await notificacoes.criar({
        idOs: osAtual?.idOs,
        mensagem: `Orçamento OS-${String(osAtual?.idOs ?? 0).padStart(6, '0')} disponível. Total: ${fmt(orcamentoAtual?.valorTotal)}. Aguardando aprovação.`,
        tipo: 'orcamento',
      })
      onEnviar()
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="enviar-orcamento-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill">{osAtual?.statusOs ?? 'aberta'}</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="enviar-orcamento-card">
          <div className="screen-title">
            <h2>Enviar Orçamento</h2>
            <p>Confira o resumo do orçamento e selecione o canal de envio para o cliente.</p>
          </div>

          <div className="orcamento-preview">
            <div className="orcamento-file-icon">📄</div>
            <div className="orcamento-preview-info">
              <strong>Orçamento gerado</strong>
              <span>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')} • Total: {fmt(orcamentoAtual?.valorTotal)}</span>
              {orcamentoAtual?.observacoes && <span>{orcamentoAtual.observacoes}</span>}
            </div>
          </div>

          <div className="envio-section">
            <h3>Enviar para</h3>
            <div className="envio-options">
              <label>
                <input type="radio" name="canalEnvio" value="whatsapp" checked={canalEnvio === 'whatsapp'}
                  onChange={() => { setCanalEnvio('whatsapp'); setErro('') }} />
                WhatsApp
              </label>
              <label>
                <input type="radio" name="canalEnvio" value="email" checked={canalEnvio === 'email'}
                  onChange={() => { setCanalEnvio('email'); setErro('') }} />
                E-mail
              </label>
            </div>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="enviar-orcamento-actions">
            <button className="btn-main enviar-orcamento-btn" type="button" onClick={handleEnviar} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default EnviarOrcamento
