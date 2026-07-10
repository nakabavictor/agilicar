import { useState, useEffect } from 'react'
import { ordensServico, entregas } from '../../services/api.js'

function AcompanhamentoCliente({ onVoltarInicio, osAtual }) {
  const [os, setOs] = useState(osAtual)
  const [kmSaida, setKmSaida] = useState('')
  const [confirmandoRetirada, setConfirmandoRetirada] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [retiradaConfirmada, setRetiradaConfirmada] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (osAtual?.idOs) {
      ordensServico.obter(osAtual.idOs)
        .then(data => setOs(data))
        .catch(() => {})
    }
  }, [osAtual?.idOs])

  async function confirmarRetirada() {
    if (!kmSaida) {
      setErro('Informe o KM de saída do veículo.')
      return
    }
    setProcessando(true)
    setErro('')
    try {
      await entregas.registrar({
        idOs: os.idOs,
        kilometragemSaida: Number(kmSaida),
        observacao: '',
        assinadoCliente: true,
      })
      await ordensServico.atualizarStatus(os.idOs, 'entregue')
      setRetiradaConfirmada(true)
      setConfirmandoRetirada(false)
    } catch (err) {
      setErro(err.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <main className="cliente-page">
      <section className="cliente-app">
        <header className="cliente-header">
          <div className="cliente-logo">AgiliCar</div>
          <nav className="cliente-nav">
            <button className="active" type="button">Meu Veículo</button>
            <button type="button">Histórico</button>
            <button type="button">Agendamentos</button>
          </nav>
          <div className="cliente-user">{os?.nomeCliente?.charAt(0) ?? 'C'}</div>
        </header>

        {retiradaConfirmada ? (
          <div className="cliente-banner" style={{ background: '#dcfce7', color: '#166534' }}>
            <strong>Retirada confirmada!</strong>
            <span>Obrigado pela preferência. Até a próxima!</span>
          </div>
        ) : (
          <div className="cliente-banner">
            <strong>Seu veículo está pronto para retirada!</strong>
            <span>{os?.marca} {os?.modelo} • {os?.placa} • OS-{String(os?.idOs ?? 0).padStart(6, '0')}</span>
          </div>
        )}

        <section className="cliente-content">
          <div className="cliente-left">
            <div className="cliente-card">
              <div className="cliente-card-header">
                <div>
                  <h2>Acompanhamento da OS</h2>
                  <p>Informações atualizadas sobre o serviço realizado.</p>
                </div>
                <span className="cliente-status">
                  {retiradaConfirmada ? 'Entregue' : 'Concluído'}
                </span>
              </div>
              <div className="cliente-veiculo-box">
                <span>Veículo</span>
                <strong>{os?.marca} {os?.modelo} • {os?.placa}</strong>
                <p>Cliente: {os?.nomeCliente}</p>
              </div>
            </div>

            <div className="cliente-card">
              <h3>Histórico de Status</h3>
              <div className="status-timeline">
                <div className="timeline-item done">
                  <span>1</span>
                  <div><strong>Veículo recebido</strong><p>Check-in realizado</p></div>
                </div>
                <div className="timeline-item done">
                  <span>2</span>
                  <div><strong>Diagnóstico concluído</strong><p>Orçamento aprovado</p></div>
                </div>
                <div className="timeline-item done">
                  <span>3</span>
                  <div><strong>Serviço em execução</strong><p>Técnico realizou o reparo</p></div>
                </div>
                <div className={`timeline-item ${retiradaConfirmada ? 'done' : 'current'}`}>
                  <span>4</span>
                  <div><strong>Pronto para retirada</strong><p>Aguardando retirada do cliente</p></div>
                </div>
              </div>

              {!retiradaConfirmada && (
                confirmandoRetirada ? (
                  <div style={{ marginTop: '16px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                      KM de saída
                      <input type="number" placeholder="Ex: 125000" value={kmSaida}
                        onChange={e => { setKmSaida(e.target.value); setErro('') }}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                    </label>
                    {erro && <p className="form-error">{erro}</p>}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-outline" type="button"
                        onClick={() => setConfirmandoRetirada(false)} disabled={processando}>
                        Cancelar
                      </button>
                      <button className="btn-retirada" type="button" onClick={confirmarRetirada} disabled={processando}>
                        {processando ? 'Processando...' : 'Confirmar Retirada'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-retirada" type="button" onClick={() => setConfirmandoRetirada(true)}>
                    Confirmar Retirada do Veículo
                  </button>
                )
              )}
            </div>
          </div>

          <div className="cliente-right">
            <div className="cliente-card">
              <h2>Resumo do Serviço Realizado</h2>
              <div className="servico-resumo">
                <span>Problema relatado</span>
                <strong>{os?.descricaoProblema ?? '—'}</strong>
                {os?.observacoes && <p>{os.observacoes}</p>}
              </div>
              <div className="recomendacao-box">
                Próxima revisão recomendada: 10.000 km ou 6 meses.
              </div>
            </div>

            <button className="btn-main voltar-inicio-cliente" onClick={onVoltarInicio}>
              Voltar ao Início
            </button>
          </div>
        </section>
      </section>
    </main>
  )
}

export default AcompanhamentoCliente
