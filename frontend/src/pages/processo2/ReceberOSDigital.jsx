import { useState, useEffect } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

const STATUS_LABELS = {
  aberta: 'Em Aberto',
  em_execucao: 'Em Execução',
  aguardando_aprovacao: 'Aguard. Aprovação',
  aguardando_peca: 'Aguard. Peça',
  concluida: 'Concluída',
  entregue: 'Entregue',
  cancelada: 'Cancelada',
}

function ReceberOSDigital({ onNavigate, onAbrirOS }) {
  const [ordens, setOrdens] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('')
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarOrdens()
  }, [filtroStatus])

  async function carregarOrdens() {
    setCarregando(true)
    setErro('')
    try {
      const lista = await ordensServico.listar(filtroStatus || undefined)
      setOrdens(lista)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const ordensFiltradas = ordens.filter((os) => {
    if (!busca.trim()) return true
    const b = busca.toLowerCase()
    return (
      String(os.idOs).includes(b) ||
      os.placa?.toLowerCase().includes(b) ||
      os.nomeCliente?.toLowerCase().includes(b)
    )
  })

  return (
    <AppLayout active="ordens" onNavigate={onNavigate}>
      <section className="ordens-screen">
        <div className="screen-title">
          <h2>Ordens de Serviço</h2>
          <p>Selecione uma OS para visualizar detalhes e iniciar o diagnóstico.</p>
        </div>

        <div className="orders-toolbar">
          <input
            type="text"
            placeholder="Buscar por OS, placa ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="aberta">Em Aberto</option>
            <option value="em_execucao">Em Execução</option>
            <option value="aguardando_aprovacao">Aguard. Aprovação</option>
            <option value="aguardando_peca">Aguard. Peça</option>
            <option value="concluida">Concluídas</option>
            <option value="entregue">Entregues</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        {erro && <p className="form-error">{erro}</p>}

        {carregando ? (
          <p style={{ padding: '24px', color: '#6b7280' }}>Carregando ordens...</p>
        ) : (
          <div className="orders-list">
            {ordensFiltradas.length === 0 && (
              <p style={{ padding: '24px', color: '#6b7280' }}>Nenhuma ordem encontrada.</p>
            )}
            {ordensFiltradas.map((os) => (
              <div className="order-card" key={os.idOs}>
                <div className="order-info">
                  <strong>OS-{String(os.idOs).padStart(6, '0')}</strong>
                  <span>{os.nomeCliente} • {os.placa}</span>
                  <span>{os.marca} {os.modelo}</span>
                </div>
                <div className="order-actions">
                  <span className={`status-pill ${os.statusOs ?? ''}`}>
                    {STATUS_LABELS[os.statusOs] ?? os.statusOs}
                  </span>
                  <button type="button" onClick={() => onAbrirOS(os)}>Abrir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  )
}

export default ReceberOSDigital
