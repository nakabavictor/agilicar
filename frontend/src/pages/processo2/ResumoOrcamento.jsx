import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico, orcamentos } from '../../services/api.js'

function ResumoOrcamento({ onNavigate, onVoltar, onGerarOrcamento, osAtual }) {
  const [prazo, setPrazo] = useState('')
  const [validade, setValidade] = useState('')
  const [custosAdicionais, setCustosAdicionais] = useState('')
  const [erro, setErro] = useState('')
  const [gerando, setGerando] = useState(false)
  const [totalServicos, setTotalServicos] = useState(0)
  const [totalPecas, setTotalPecas] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    carregarResumo()
  }, [])

  async function carregarResumo() {
    setCarregando(true)
    try {
      const [listaServicos, listaPecas] = await Promise.all([
        ordensServico.listarServicos(osAtual?.idOs),
        ordensServico.listarPecas(osAtual?.idOs),
      ])
      const somaServicos = (listaServicos || []).reduce(
        (acc, s) => acc + Number(s.valorCobrado ?? 0) * (s.quantidade ?? 1), 0
      )
      const somaPecas = (listaPecas || []).reduce(
        (acc, p) => acc + Number(p.valorUnitario ?? 0) * (p.quantidade ?? 1), 0
      )
      setTotalServicos(somaServicos)
      setTotalPecas(somaPecas)
    } catch {
      // keep zeros
    } finally {
      setCarregando(false)
    }
  }

  const extras = parseFloat(String(custosAdicionais).replace(',', '.') || '0') || 0
  const totalGeral = totalServicos + totalPecas + extras

  function fmt(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`
  }

  async function handleGerarOrcamento() {
    if (!prazo.trim() || !validade) {
      setErro('Informe o prazo estimado e a validade do orçamento.')
      return
    }
    setGerando(true)
    setErro('')
    try {
      const orc = await orcamentos.criar({
        idOs: osAtual.idOs,
        valorTotal: totalGeral,
        observacoes: `Prazo: ${prazo} | Validade: ${validade}`,
      })
      onGerarOrcamento(orc)
    } catch (err) {
      setErro(err.message)
    } finally {
      setGerando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="orcamento-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill">{osAtual?.statusOs ?? 'aberta'}</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="orcamento-card">
          <div className="orcamento-tabs">
            <button type="button" onClick={onVoltar}>Peças e Serviços</button>
            <button className="active" type="button">Resumo do Orçamento</button>
          </div>

          <div className="screen-title">
            <h2>Resumo do Orçamento</h2>
            <p>Confira os valores calculados antes de gerar o orçamento.</p>
          </div>

          <div className="resumo-valores">
            <h3>Resumo de Valores</h3>
            {carregando ? (
              <p style={{ color: '#6b7280' }}>Calculando...</p>
            ) : (
              <>
                <div className="resumo-linha">
                  <span>Total de Peças</span>
                  <strong>{fmt(totalPecas)}</strong>
                </div>
                <div className="resumo-linha">
                  <span>Mão de Obra</span>
                  <strong>{fmt(totalServicos)}</strong>
                </div>
                <div className="resumo-linha">
                  <span>Custos Adicionais</span>
                  <strong>{fmt(extras)}</strong>
                </div>
                <div className="resumo-linha total">
                  <span>Total Geral</span>
                  <strong>{fmt(totalGeral)}</strong>
                </div>
              </>
            )}
          </div>

          <div className="orcamento-form-grid">
            <label>
              Prazo Estimado
              <input type="text" placeholder="Ex: 2 dias úteis" value={prazo}
                onChange={e => { setPrazo(e.target.value); setErro('') }} />
            </label>
            <label>
              Validade do Orçamento
              <select value={validade} onChange={e => { setValidade(e.target.value); setErro('') }}>
                <option value="" disabled>Selecione</option>
                <option value="24h">24 horas</option>
                <option value="48h">48 horas</option>
                <option value="7dias">7 dias</option>
              </select>
            </label>
            <label>
              Custos Adicionais (R$)
              <input type="text" placeholder="0,00" value={custosAdicionais}
                onChange={e => { setCustosAdicionais(e.target.value); setErro('') }} />
            </label>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <div className="orcamento-actions">
            <button className="btn-main gerar-orcamento-btn" type="button" onClick={handleGerarOrcamento}
              disabled={gerando || carregando}>
              {gerando ? 'Gerando...' : 'Gerar Orçamento'}
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default ResumoOrcamento
