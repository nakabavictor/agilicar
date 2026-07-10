import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { veiculos } from '../../services/api.js'

function IdentificacaoDigital({ onNovoRegistro, onNavigate, onVeiculoEncontrado }) {
  const [placa, setPlaca] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleBuscar() {
    const placaLimpa = placa.trim().toUpperCase()
    if (!placaLimpa) {
      setErro('Digite uma placa para buscar.')
      return
    }

    setCarregando(true)
    setErro('')
    try {
      const veiculo = await veiculos.buscarPorPlaca(placaLimpa)
      onVeiculoEncontrado(veiculo)
    } catch (err) {
      if (err.message.includes('404') || err.message.toLowerCase().includes('não encontrado')) {
        setErro('Veículo não encontrado. Faça um novo cadastro.')
      } else {
        setErro(err.message)
      }
    } finally {
      setCarregando(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleBuscar()
  }

  return (
    <AppLayout active="inicio" onNavigate={onNavigate}>
      <section className="process-screen" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #1f73d1 0%, #0f4fa1 100%)',
          borderRadius: '16px',
          padding: '40px 48px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}>
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '26px', fontWeight: 800 }}>
              Identificação Digital
            </h2>
            <p style={{ margin: 0, opacity: 0.85, fontSize: '15px', lineHeight: 1.5, maxWidth: '420px' }}>
              Digite a placa do veículo para localizar o cliente cadastrado ou inicie um novo registro de atendimento.
            </p>
          </div>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', flexShrink: 0,
          }}>
            🔍
          </div>
        </div>

        {/* Busca por placa */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '36px 40px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 700, color: '#111827' }}>
            Buscar Veículo pela Placa
          </h3>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#6b7280' }}>
            Informe a placa para identificar o cliente e continuar o atendimento.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '540px' }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Ex: ABC1D23"
                value={placa}
                onChange={(e) => { setPlaca(e.target.value.toUpperCase()); setErro('') }}
                onKeyDown={handleKeyDown}
                maxLength={8}
                style={{
                  width: '100%',
                  height: '48px',
                  border: erro ? '1.5px solid #dc2626' : '1.5px solid #d1d5db',
                  borderRadius: '10px',
                  padding: '0 18px',
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '4px',
                  outline: 'none',
                  textTransform: 'uppercase',
                  color: '#111827',
                  transition: 'border-color 0.15s',
                }}
              />
              {erro && (
                <p style={{ margin: '8px 0 0', color: '#dc2626', fontSize: '13px', fontWeight: 600 }}>
                  {erro}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleBuscar}
              disabled={carregando}
              style={{
                height: '48px',
                padding: '0 28px',
                border: 'none',
                borderRadius: '10px',
                background: '#1f73d1',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                cursor: carregando ? 'not-allowed' : 'pointer',
                opacity: carregando ? 0.6 : 1,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              {carregando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 600, whiteSpace: 'nowrap' }}>
            ou cliente novo
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Novo cadastro */}
        <div style={{
          background: '#f9fafb',
          border: '1.5px dashed #d1d5db',
          borderRadius: '16px',
          padding: '32px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}>
          <div>
            <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#374151' }}>
              Primeiro atendimento
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              Cliente e veículo ainda não estão cadastrados no sistema.
            </p>
          </div>
          <button
            type="button"
            onClick={onNovoRegistro}
            style={{
              height: '44px',
              padding: '0 28px',
              border: '1.5px solid #1f73d1',
              borderRadius: '10px',
              background: '#ffffff',
              color: '#1f73d1',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            + Novo Cadastro
          </button>
        </div>

      </section>
    </AppLayout>
  )
}

export default IdentificacaoDigital
