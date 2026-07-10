import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { usuarios, ordensServico } from '../../services/api.js'

function AtribuicaoTecnico({ onNavigate, onVoltar, onConfirmarTecnico, osAtual }) {
  const [tecnicos, setTecnicos] = useState([])
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(null)
  const [prazoEstimado, setPrazoEstimado] = useState('')
  const [pecasOS, setPecasOS] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [confirmando, setConfirmando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const [listaTecnicos, listaPecas] = await Promise.all([
          usuarios.listar(3, true),
          osAtual?.idOs ? ordensServico.listarPecas(osAtual.idOs) : Promise.resolve([]),
        ])
        setTecnicos(listaTecnicos || [])
        setPecasOS(listaPecas || [])
      } catch {
        // silencioso
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [osAtual?.idOs])

  async function confirmarAtribuicao() {
    if (!tecnicoSelecionado) {
      setErro('Selecione um técnico para atribuir à OS.')
      return
    }
    setConfirmando(true)
    setErro('')
    try {
      let osAtualizada = osAtual
      if (prazoEstimado) {
        osAtualizada = await ordensServico.atualizarPrazo(osAtual.idOs, {
          prazoEstimado: new Date(prazoEstimado).toISOString(),
        })
      }
      const osEmExecucao = await ordensServico.atualizarStatus(osAtual.idOs, 'em_execucao')
      onConfirmarTecnico(osEmExecucao ?? osAtualizada)
    } catch (err) {
      setErro(err.message)
    } finally {
      setConfirmando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="atribuicao-screen">
        <div className="os-detail-header">
          <div className="screen-title">
            <h2>Atribuição de Técnico</h2>
            <p>Selecione um técnico responsável e defina o prazo estimado de conclusão.</p>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="atribuicao-card">
          <div className="atribuicao-os-info" style={{ marginBottom: '20px' }}>
            <h3>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h3>
            <p>{osAtual?.nomeCliente} • {osAtual?.marca} {osAtual?.modelo} • {osAtual?.placa}</p>
            {osAtual?.descricaoProblema && (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{osAtual.descricaoProblema}</p>
            )}
          </div>

          {pecasOS.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '10px', border: '1px solid #bae6fd' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#0369a1' }}>
                Verificação de Estoque — Peças da OS
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {pecasOS.map(p => (
                  <div key={p.idPeca} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span>{p.nomePeca}</span>
                    <span style={{ fontWeight: 600, color: '#0369a1' }}>{p.quantidade} un. — separadas</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
              Prazo Estimado de Conclusão
            </label>
            <input
              type="datetime-local"
              value={prazoEstimado}
              min={new Date().toISOString().slice(0, 16)}
              onChange={e => setPrazoEstimado(e.target.value)}
              style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', width: '100%', maxWidth: '320px' }}
            />
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Opcional — define o prazo para alerta de atraso na execução
            </p>
          </div>

          <h4 style={{ marginBottom: '12px' }}>Selecionar Técnico Disponível</h4>

          {carregando ? (
            <p style={{ color: '#6b7280' }}>Carregando técnicos...</p>
          ) : tecnicos.length === 0 ? (
            <p style={{ color: '#6b7280' }}>Nenhum técnico cadastrado.</p>
          ) : (
            <div className="tecnicos-grid">
              {tecnicos.map(tec => (
                <button
                  key={tec.idUsuario}
                  type="button"
                  className={`tecnico-card ${tecnicoSelecionado?.idUsuario === tec.idUsuario ? 'selected' : ''}`}
                  onClick={() => { setTecnicoSelecionado(tec); setErro('') }}
                >
                  <div className="tecnico-avatar">{tec.nome?.charAt(0) ?? 'T'}</div>
                  <div>
                    <strong>{tec.nome}</strong>
                    <span>{tec.email}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {erro && <p className="form-error">{erro}</p>}

          <div className="modal-actions" style={{ marginTop: '24px' }}>
            <button className="btn-outline" type="button" onClick={onVoltar} disabled={confirmando}>Cancelar</button>
            <button className="btn-main" type="button" onClick={confirmarAtribuicao} disabled={confirmando || carregando}>
              {confirmando ? 'Confirmando...' : 'Confirmar Atribuição'}
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default AtribuicaoTecnico
