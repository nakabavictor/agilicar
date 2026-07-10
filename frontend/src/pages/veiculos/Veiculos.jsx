import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { veiculos, clientes } from '../../services/api.js'

const COMBUSTIVEIS = ['Gasolina', 'Etanol', 'Flex', 'Diesel', 'Elétrico', 'Híbrido']

const STATUS_LABELS = {
  aberta: 'Em Aberto',
  em_execucao: 'Em Execução',
  aguardando_aprovacao: 'Aguard. Aprovação',
  aguardando_peca: 'Aguard. Peça',
  concluida: 'Concluída',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
}

function Veiculos({ onNavigate }) {
  const [buscarPlaca, setBuscarPlaca] = useState('')
  const [buscarCliente, setBuscarCliente] = useState('')
  const [veiculoEncontrado, setVeiculoEncontrado] = useState(null)
  const [listaClientes, setListaClientes] = useState([])
  const [veiculosCliente, setVeiculosCliente] = useState([])
  const [historico, setHistorico] = useState([])
  const [mostraHistorico, setMostraHistorico] = useState(null)
  const [formAberto, setFormAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const [placa, setPlaca] = useState('')
  const [modelo, setModelo] = useState('')
  const [marca, setMarca] = useState('')
  const [ano, setAno] = useState('')
  const [cor, setCor] = useState('')
  const [combustivel, setCombustivel] = useState('Flex')
  const [idClienteSel, setIdClienteSel] = useState('')

  async function buscarPorPlaca() {
    if (!buscarPlaca.trim()) return
    setCarregando(true); setErro(''); setVeiculoEncontrado(null)
    try { setVeiculoEncontrado(await veiculos.buscarPorPlaca(buscarPlaca.trim().toUpperCase())) }
    catch { setErro('Veículo não encontrado para essa placa.') }
    finally { setCarregando(false) }
  }

  async function buscarPorCliente() {
    if (!buscarCliente.trim()) return
    setCarregando(true); setErro(''); setListaClientes([]); setVeiculosCliente([])
    try {
      const todos = (await clientes.listar()) || []
      const filtrados = todos.filter(c => c.nome.toLowerCase().includes(buscarCliente.toLowerCase()))
      setListaClientes(filtrados)
    } catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  async function verVeiculosCliente(cliente) {
    setCarregando(true); setErro('')
    try { setVeiculosCliente((await veiculos.listarPorCliente(cliente.idCliente)) || []) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  async function verHistorico(v) {
    if (mostraHistorico === v.idVeiculo) { setMostraHistorico(null); return }
    try {
      const h = (await veiculos.historico(v.idVeiculo)) || []
      setHistorico(h); setMostraHistorico(v.idVeiculo)
    } catch { setHistorico([]) }
  }

  function abrirNovoVeiculo() {
    setEditando(null)
    setPlaca(''); setModelo(''); setMarca(''); setAno(''); setCor(''); setCombustivel('Flex'); setIdClienteSel('')
    setErro(''); setFormAberto(true)
  }

  function abrirEdicao(v) {
    setEditando(v)
    setPlaca(v.placa || ''); setModelo(v.modelo || ''); setMarca(v.marca || '')
    setAno(String(v.ano || '')); setCor(v.cor || ''); setCombustivel(v.combustivel || 'Flex')
    setIdClienteSel(String(v.idCliente || ''))
    setErro(''); setFormAberto(true)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    if (!placa.trim() || !modelo.trim() || !marca.trim()) { setErro('Placa, modelo e marca são obrigatórios.'); return }
    if (!idClienteSel && !editando) { setErro('Selecione o cliente.'); return }
    setSalvando(true); setErro('')
    try {
      const dados = { placa: placa.toUpperCase(), modelo, marca, ano: Number(ano), cor, combustivel, idCliente: Number(idClienteSel || editando?.idCliente) }
      if (editando) await veiculos.atualizar(editando.idVeiculo, dados)
      else await veiculos.criar(dados)
      setFormAberto(false)
      if (veiculosCliente.length > 0) await verVeiculosCliente({ idCliente: Number(idClienteSel) })
    } catch (e) { setErro(e.message) }
    finally { setSalvando(false) }
  }

  return (
    <AppLayout active="veiculos" onNavigate={onNavigate}>
      <section className="crud-screen">
        <div className="crud-header">
          <div>
            <h2>Veículos</h2>
            <p>Consulte e cadastre veículos por placa ou cliente.</p>
          </div>
          <button className="btn-new" type="button" onClick={abrirNovoVeiculo}>+ Novo Veículo</button>
        </div>

        {formAberto && (
          <div className="crud-form-card">
            <h3>{editando ? 'Editar Veículo' : 'Novo Veículo'}</h3>
            <form onSubmit={handleSalvar}>
              <div className="crud-form-grid">
                <label>
                  Placa *
                  <input value={placa} onChange={e => setPlaca(e.target.value)} placeholder="ABC1D23" style={{ textTransform: 'uppercase' }} />
                </label>
                <label>
                  Cliente *
                  <select value={idClienteSel} onChange={e => setIdClienteSel(e.target.value)} disabled={!!editando}>
                    <option value="">Selecione...</option>
                    {listaClientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nome}</option>)}
                  </select>
                  {!listaClientes.length && !editando && (
                    <small style={{ color: '#6b7280', fontSize: '12px' }}>Busque um cliente primeiro na seção abaixo</small>
                  )}
                </label>
                <label>Marca *<input value={marca} onChange={e => setMarca(e.target.value)} placeholder="Ex: Volkswagen" /></label>
                <label>Modelo *<input value={modelo} onChange={e => setModelo(e.target.value)} placeholder="Ex: Gol 1.6" /></label>
                <label>Ano<input type="number" value={ano} onChange={e => setAno(e.target.value)} placeholder="Ex: 2020" /></label>
                <label>Cor<input value={cor} onChange={e => setCor(e.target.value)} placeholder="Ex: Prata" /></label>
                <label>
                  Combustível
                  <select value={combustivel} onChange={e => setCombustivel(e.target.value)}>
                    {COMBUSTIVEIS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                {erro && <p className="form-error span-2">{erro}</p>}
                <div className="crud-form-actions span-2">
                  <button type="button" className="btn-outline" onClick={() => setFormAberto(false)}>Cancelar</button>
                  <button type="submit" className="btn-main" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="veiculos-busca-grid">
          {/* Busca por placa */}
          <div className="veiculos-busca-card">
            <h3>Buscar por Placa</h3>
            <div className="busca-inline">
              <input
                placeholder="Ex: ABC1D23"
                value={buscarPlaca}
                onChange={e => setBuscarPlaca(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && buscarPorPlaca()}
                style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}
              />
              <button className="btn-new" type="button" onClick={buscarPorPlaca} disabled={carregando}>
                {carregando ? '...' : 'Buscar'}
              </button>
            </div>
            {erro && !formAberto && <p className="form-error">{erro}</p>}
            {veiculoEncontrado && (
              <div className="veiculo-result-card">
                <div className="veiculo-result-header">
                  <strong>{veiculoEncontrado.marca} {veiculoEncontrado.modelo}</strong>
                  <span className="placa-badge">{veiculoEncontrado.placa}</span>
                </div>
                <div className="os-info-grid" style={{ marginTop: 12 }}>
                  <div><span>Cliente</span><strong>{veiculoEncontrado.nomeCliente}</strong></div>
                  <div><span>Ano</span><strong>{veiculoEncontrado.ano || '—'}</strong></div>
                  <div><span>Cor</span><strong>{veiculoEncontrado.cor || '—'}</strong></div>
                  <div><span>Combustível</span><strong>{veiculoEncontrado.combustivel || '—'}</strong></div>
                </div>
                <div className="crud-row-actions" style={{ marginTop: 12 }}>
                  <button className="btn-edit" type="button" onClick={() => abrirEdicao(veiculoEncontrado)}>Editar</button>
                  <button className="btn-outline" type="button" onClick={() => verHistorico(veiculoEncontrado)}>
                    {mostraHistorico === veiculoEncontrado.idVeiculo ? 'Ocultar histórico' : 'Ver histórico de OS'}
                  </button>
                </div>
                {mostraHistorico === veiculoEncontrado.idVeiculo && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                      Histórico de Ordens de Serviço
                    </p>
                    {historico.length === 0 ? (
                      <p className="crud-empty">Nenhuma OS registrada para este veículo.</p>
                    ) : historico.map(h => (
                      <div key={h.idOs} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13,
                      }}>
                        <strong>OS-{String(h.idOs).padStart(6, '0')}</strong>
                        <span className={`status-pill ${h.statusOs ?? ''}`} style={{ fontSize: '11px', padding: '2px 8px' }}>
                          {STATUS_LABELS[h.statusOs] ?? h.statusOs}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          {h.dataAbertura ? new Date(h.dataAbertura).toLocaleDateString('pt-BR') : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Busca por cliente */}
          <div className="veiculos-busca-card">
            <h3>Buscar por Cliente</h3>
            <div className="busca-inline">
              <input
                placeholder="Nome do cliente..."
                value={buscarCliente}
                onChange={e => setBuscarCliente(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscarPorCliente()}
              />
              <button className="btn-new" type="button" onClick={buscarPorCliente} disabled={carregando}>
                {carregando ? '...' : 'Buscar'}
              </button>
            </div>
            {listaClientes.length === 0 && buscarCliente && !carregando && (
              <p className="crud-empty">Nenhum cliente encontrado.</p>
            )}
            {listaClientes.map(c => (
              <div key={c.idCliente} className="cliente-item-card" onClick={() => verVeiculosCliente(c)}>
                <strong>{c.nome}</strong>
                <span>{c.telefone || c.email || ''}</span>
              </div>
            ))}
            {veiculosCliente.length > 0 && (
              <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {veiculosCliente.map(v => (
                  <div key={v.idVeiculo} className="veiculo-result-card">
                    <div className="veiculo-result-header">
                      <strong>{v.marca} {v.modelo}</strong>
                      <span className="placa-badge">{v.placa}</span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: '13px', color: '#6b7280' }}>
                      {v.ano && <span>{v.ano} • </span>}
                      {v.cor && <span>{v.cor} • </span>}
                      <span>{v.combustivel}</span>
                    </div>
                    <div className="crud-row-actions" style={{ marginTop: 10 }}>
                      <button className="btn-edit" type="button" onClick={() => abrirEdicao(v)}>Editar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default Veiculos
