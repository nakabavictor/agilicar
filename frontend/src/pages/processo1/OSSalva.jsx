import AppLayout from '../../components/AppLayout.jsx'

function OSSalva({ onVoltarInicio, onNavigate, osAtual, veiculoAtual, clienteAtual }) {
  function imprimir() {
    window.print()
  }

  return (
    <AppLayout active="inicio" onNavigate={onNavigate}>
      <style>{`
        @media print {
          .sidebar, .app-header, .voltar-inicio-btn, .btn-imprimir { display: none !important; }
          .os-salva-box { box-shadow: none; border: 1px solid #ccc; }
        }
      `}</style>

      <section className="os-salva-screen">
        <div className="os-salva-box">
          <div className="check-icon">✓</div>

          <h2>OS salva com sucesso!</h2>

          <p>
            A Ordem de Serviço foi criada e o veículo foi encaminhado para
            diagnóstico técnico.
          </p>

          <div className="os-dados">
            <div className="os-dado-item">
              <span>Número da OS</span>
              <strong>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</strong>
            </div>

            <div className="os-dado-item">
              <span>Placa</span>
              <strong>{veiculoAtual?.placa ?? '—'}</strong>
            </div>

            <div className="os-dado-item">
              <span>Cliente</span>
              <strong>{clienteAtual?.nome ?? osAtual?.nomeCliente ?? '—'}</strong>
            </div>

            <div className="os-dado-item">
              <span>Status</span>
              <strong>Aguardando Diagnóstico</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-outline btn-imprimir" type="button" onClick={imprimir}>
              Imprimir Protocolo
            </button>
            <button className="btn-main voltar-inicio-btn" onClick={onVoltarInicio}>
              Voltar ao Início
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default OSSalva
