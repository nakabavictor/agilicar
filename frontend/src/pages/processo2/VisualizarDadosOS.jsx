import AppLayout from '../../components/AppLayout.jsx'

function VisualizarDadosOS({ onNavigate, onVoltar, onIniciarDiagnostico, osAtual }) {
  const os = osAtual

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="os-detail-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(os?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill">{os?.statusOs ?? 'aberta'}</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="os-tabs">
          <button className="active" type="button">Dados da OS</button>
        </div>

        <div className="os-detail-content">
          <section className="os-section">
            <h3>Dados do Cliente</h3>
            <div className="os-info-grid">
              <div><span>Nome</span><strong>{os?.nomeCliente ?? '—'}</strong></div>
              <div><span>Telefone</span><strong>{os?.telefoneCliente ?? '—'}</strong></div>
            </div>
          </section>

          <section className="os-section">
            <h3>Dados do Veículo</h3>
            <div className="os-info-grid">
              <div><span>Veículo</span><strong>{os?.marca} {os?.modelo}</strong></div>
              <div><span>Placa</span><strong>{os?.placa ?? '—'}</strong></div>
              <div><span>KM Atual</span><strong>{os?.kilometragem ? `${os.kilometragem.toLocaleString()} km` : '—'}</strong></div>
              <div><span>Ano</span><strong>{os?.anoVeiculo ?? '—'}</strong></div>
            </div>
          </section>

          <section className="os-section sintomas-informados">
            <h3>Sintomas Informados</h3>
            <p>{os?.descricaoProblema ?? 'Nenhuma descrição informada.'}</p>
            {os?.observacoes && <span className="urgency-tag">{os.observacoes}</span>}
          </section>
        </div>

        <div className="os-detail-actions">
          <button className="btn-main iniciar-diagnostico-btn" type="button" onClick={onIniciarDiagnostico}>
            Iniciar Diagnóstico
          </button>
        </div>
      </section>
    </AppLayout>
  )
}

export default VisualizarDadosOS
