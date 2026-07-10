import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico, servicos, pecas } from '../../services/api.js'

function PecasServicos({ onNavigate, onVoltar, onAvancar, osAtual }) {
  const [tipo, setTipo] = useState('peca')
  const [idItemSelecionado, setIdItemSelecionado] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [valorUnitario, setValorUnitario] = useState('')
  const [catalogoServicos, setCatalogoServicos] = useState([])
  const [catalogoPecas, setCatalogoPecas] = useState([])
  const [itensAdicionados, setItensAdicionados] = useState([])
  const [pecaInfo, setPecaInfo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [adicionando, setAdicionando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setCarregando(true)
    try {
      const [listaServicos, listaPecas, servicosOS, pecasOS] = await Promise.all([
        servicos.listar(),
        pecas.listar(),
        ordensServico.listarServicos(osAtual?.idOs),
        ordensServico.listarPecas(osAtual?.idOs),
      ])
      setCatalogoServicos(listaServicos || [])
      setCatalogoPecas(listaPecas || [])
      const existentes = [
        ...(servicosOS || []).map(s => ({
          id: `s-${s.idServico}`,
          tipo: 'Serviço',
          nome: s.nomeServico,
          quantidade: s.quantidade ?? 1,
          valor: `R$ ${Number(s.valorCobrado ?? 0).toFixed(2).replace('.', ',')}`,
        })),
        ...(pecasOS || []).map(p => ({
          id: `p-${p.idPeca}`,
          tipo: 'Peça',
          nome: p.nomePeca,
          quantidade: p.quantidade,
          valor: `R$ ${Number(p.valorUnitario ?? 0).toFixed(2).replace('.', ',')}`,
        })),
      ]
      setItensAdicionados(existentes)
    } catch {
      // catalogs fail gracefully
    } finally {
      setCarregando(false)
    }
  }

  const catalogoAtual = tipo === 'peca' ? catalogoPecas : catalogoServicos

  async function adicionarItem() {
    if (!idItemSelecionado || !quantidade) {
      setErro('Selecione o item e informe a quantidade.')
      return
    }
    if (tipo === 'peca' && !valorUnitario) {
      setErro('Informe o valor unitário da peça.')
      return
    }

    setAdicionando(true)
    setErro('')
    try {
      if (tipo === 'peca') {
        const pecaSelecionada = catalogoPecas.find(p => String(p.idPeca) === idItemSelecionado)
        await ordensServico.adicionarPeca(osAtual.idOs, {
          idPeca: Number(idItemSelecionado),
          quantidade: Number(quantidade),
          valorUnitario: parseFloat(valorUnitario.replace(',', '.')),
        })
        setItensAdicionados(prev => [...prev.filter(i => i.id !== `p-${idItemSelecionado}`), {
          id: `p-${idItemSelecionado}`,
          tipo: 'Peça',
          nome: pecaSelecionada?.nomePeca ?? 'Peça',
          quantidade: Number(quantidade),
          valor: `R$ ${parseFloat(valorUnitario.replace(',', '.')).toFixed(2).replace('.', ',')}`,
        }])
      } else {
        const servicoSelecionado = catalogoServicos.find(s => String(s.idServico) === idItemSelecionado)
        const valorServico = valorUnitario || String(servicoSelecionado?.valor ?? 0)
        await ordensServico.adicionarServico(osAtual.idOs, {
          idServico: Number(idItemSelecionado),
          quantidade: Number(quantidade),
          valorCobrado: parseFloat(valorServico.replace(',', '.')),
        })
        setItensAdicionados(prev => [...prev.filter(i => i.id !== `s-${idItemSelecionado}`), {
          id: `s-${idItemSelecionado}`,
          tipo: 'Serviço',
          nome: servicoSelecionado?.nomeServico ?? 'Serviço',
          quantidade: Number(quantidade),
          valor: `R$ ${parseFloat(valorServico.replace(',', '.')).toFixed(2).replace('.', ',')}`,
        }])
      }
      setIdItemSelecionado('')
      setQuantidade('1')
      setValorUnitario('')
    } catch (err) {
      setErro(err.message)
    } finally {
      setAdicionando(false)
    }
  }

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="pecas-screen">
        <div className="os-detail-header">
          <div className="os-title-area">
            <button className="back-icon" type="button" onClick={onVoltar}>‹</button>
            <h2>OS-{String(osAtual?.idOs ?? 0).padStart(6, '0')}</h2>
            <span className="status-pill">{osAtual?.statusOs ?? 'aberta'}</span>
          </div>
          <button className="btn-voltar-small" type="button" onClick={onVoltar}>Voltar</button>
        </div>

        <div className="pecas-card">
          <div className="orcamento-tabs">
            <button className="active" type="button">Peças e Serviços</button>
            <button type="button" onClick={onAvancar}>Resumo do Orçamento</button>
          </div>

          <div className="screen-title">
            <h2>Adicionar Peças e Serviços</h2>
            <p>Informe os itens necessários para compor o orçamento da OS.</p>
          </div>

          <div className="tipo-item-row">
            <label>
              <input type="radio" name="tipoItem" value="peca" checked={tipo === 'peca'}
                onChange={() => { setTipo('peca'); setIdItemSelecionado(''); setValorUnitario('') }} />
              Peça
            </label>
            <label>
              <input type="radio" name="tipoItem" value="servico" checked={tipo === 'servico'}
                onChange={() => { setTipo('servico'); setIdItemSelecionado(''); setValorUnitario('') }} />
              Serviço
            </label>
          </div>

          <div className="pecas-form-grid">
            <label>
              {tipo === 'peca' ? 'Peça' : 'Serviço'}
              <select value={idItemSelecionado} onChange={e => {
                const id = e.target.value
                setIdItemSelecionado(id)
                setErro('')
                if (tipo === 'peca' && id) {
                  const p = catalogoPecas.find(p => String(p.idPeca) === id)
                  setPecaInfo(p ?? null)
                  if (p?.valorUnitario) setValorUnitario(String(p.valorUnitario))
                } else if (tipo === 'servico' && id) {
                  const s = catalogoServicos.find(s => String(s.idServico) === id)
                  if (s?.valor) setValorUnitario(String(s.valor))
                  setPecaInfo(null)
                } else {
                  setPecaInfo(null)
                }
              }} disabled={carregando}>
                <option value="">Selecione...</option>
                {catalogoAtual.map(item => (
                  <option key={item.idPeca ?? item.idServico} value={String(item.idPeca ?? item.idServico)}>
                    {item.nomePeca ?? item.nomeServico}
                    {(item.valor || item.valorUnitario) ? ` — R$ ${Number(item.valor ?? item.valorUnitario).toFixed(2).replace('.', ',')}` : ''}
                  </option>
                ))}
              </select>
              {tipo === 'peca' && pecaInfo && (
                <span style={{
                  fontSize: '12px',
                  marginTop: '4px',
                  display: 'block',
                  color: pecaInfo.quantidadeDisponivel > 0 ? '#16a34a' : '#dc2626',
                  fontWeight: 600,
                }}>
                  Disponível em estoque: {pecaInfo.quantidadeDisponivel} unidades
                  {Number(quantidade) > pecaInfo.quantidadeDisponivel && pecaInfo.quantidadeDisponivel > 0
                    ? ' — quantidade solicitada excede o estoque'
                    : ''}
                  {pecaInfo.quantidadeDisponivel === 0 ? ' — sem estoque' : ''}
                </span>
              )}
            </label>

            <label>
              Quantidade
              <input type="number" min="1" placeholder="Qtd." value={quantidade}
                onChange={e => { setQuantidade(e.target.value); setErro('') }} />
            </label>

            <label>
              Valor unitário
              <input type="text" placeholder="R$ 0,00" value={valorUnitario}
                onChange={e => { setValorUnitario(e.target.value); setErro('') }} />
            </label>
          </div>

          {erro && <p className="form-error">{erro}</p>}

          <button className="btn-add-item" type="button" onClick={adicionarItem} disabled={adicionando || carregando}>
            {adicionando ? 'Adicionando...' : '+ Adicionar Item'}
          </button>

          <div className="itens-table">
            <div className="itens-table-header">
              <span>Tipo</span>
              <span>Item</span>
              <span>Qtd.</span>
              <span>Valor Unit.</span>
            </div>

            {itensAdicionados.length === 0 && (
              <p style={{ padding: '12px', color: '#6b7280' }}>Nenhum item adicionado ainda.</p>
            )}

            {itensAdicionados.map(item => (
              <div className="itens-table-row" key={item.id}>
                <span>{item.tipo}</span>
                <strong>{item.nome}</strong>
                <span>{item.quantidade}</span>
                <span>{item.valor}</span>
              </div>
            ))}
          </div>

          <div className="pecas-actions">
            <button className="btn-main avancar-orcamento-btn" type="button" onClick={onAvancar}>
              Avançar para Orçamento
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default PecasServicos
