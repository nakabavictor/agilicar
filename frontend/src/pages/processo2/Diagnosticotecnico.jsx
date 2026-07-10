import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

function DiagnosticoTecnico({ onNavigate, onVoltar, onSalvarDiagnostico, osAtual }) {
  const [descricaoFalhas, setDescricaoFalhas] = useState('')
  const [severidade, setSeveridade] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSalvar() {
    if (!descricaoFalhas.trim() || !severidade) {
      setErro('Preencha a descrição das falhas e selecione a severidade.')
      return
    }

    setCarregando(true)
    setErro('')
    try {
      await ordensServico.salvarDiagnostico(osAtual.idOs, {
        descricaoFalhas,
        severidade,
        observacoesTecnicas: observacoes,
      })
      onSalvarDiagnostico()
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="diagnostico-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill">{osAtual?.statusOs ?? 'aberta'}</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="diagnostico-card">
          <div className="screen-title">
            <h2>Diagnóstico Técnico</h2>
            <p>Registre as falhas identificadas durante a avaliação do veículo.</p>
          </div>

          <div className="diagnostico-form">
            <label>
              Descrição das falhas identificadas
              <textarea
                placeholder="Digite aqui as falhas encontradas no veículo..."
                value={descricaoFalhas}
                onChange={(e) => { setDescricaoFalhas(e.target.value); setErro('') }}
              />
            </label>

            <label>
              Severidade
              <select value={severidade} onChange={(e) => { setSeveridade(e.target.value); setErro('') }}>
                <option value="" disabled>Selecione</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </label>

            <label>
              Observações Técnicas
              <textarea
                placeholder="Digite observações técnicas adicionais..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </label>

            {erro && <p className="form-error">{erro}</p>}
          </div>

          <div className="diagnostico-actions">
            <button className="btn-main salvar-diagnostico-btn" type="button" onClick={handleSalvar} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Diagnóstico'}
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default DiagnosticoTecnico
