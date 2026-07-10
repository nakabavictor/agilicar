import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'
import { useAuth } from '../../contexts/AuthContext.jsx'

function RegistroSintomas({ onVoltar, onSalvar, onNavigate, clienteAtual, veiculoAtual }) {
  const { usuario } = useAuth()
  const [descricao, setDescricao] = useState('')
  const [urgencia, setUrgencia] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSalvar() {
    if (!descricao.trim() || !urgencia) {
      setErro('Preencha a descrição do problema e selecione o nível de urgência.')
      return
    }

    setCarregando(true)
    setErro('')
    try {
      const os = await ordensServico.criar({
        idCliente: clienteAtual.idCliente,
        idVeiculo: veiculoAtual.idVeiculo,
        idUsuario: usuario.idUsuario,
        kilometragem: clienteAtual.km || veiculoAtual.km || null,
        descricaoProblema: descricao,
        observacoes: `Urgência: ${urgencia}`,
      })
      onSalvar(os)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  const podeSalvar = descricao.trim() !== '' && urgencia !== ''

  return (
    <AppLayout active="inicio" onNavigate={onNavigate}>
      <section className="sintomas-screen">
        <div className="screen-title">
          <h2>Registro de Sintomas</h2>
        </div>

        <div className="sintomas-divider" />

        <div className="sintomas-form">
          <label>
            Descrição do Problema
            <textarea
              placeholder="Digite a reclamação do cliente aqui..."
              value={descricao}
              onChange={(e) => { setDescricao(e.target.value); setErro('') }}
            />
          </label>

          <div className="urgencia-row">
            <label htmlFor="urgencia">Urgência</label>
            <select
              id="urgencia"
              value={urgencia}
              onChange={(e) => { setUrgencia(e.target.value); setErro('') }}
            >
              <option value="" disabled>Selecione</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {erro && <p className="form-error">{erro}</p>}
        </div>

        <div className="bottom-actions sintomas-actions">
          <button className="btn-outline small-action" type="button" onClick={onVoltar}>Voltar</button>
          <button
            className={`btn-main small-action-main ${!podeSalvar ? 'btn-disabled' : ''}`}
            type="button"
            onClick={handleSalvar}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar OS'}
          </button>
        </div>
      </section>
    </AppLayout>
  )
}

export default RegistroSintomas
