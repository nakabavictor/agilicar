import { useState } from 'react'
import AppLayout from '../../components/AppLayout.jsx'
import { ordensServico } from '../../services/api.js'

const ITENS_CHECKLIST = ['Pneus', 'Faróis', 'Vidros', 'Lanternas', 'Lataria', 'Retrovisores', 'Interior']

function ChecklistVisual({ onVoltar, onProximo, onNavigate, idOs }) {
  const MAX_FILE_SIZE = 5 * 1024 * 1024
  const [fotos, setFotos] = useState([])
  const [fotosArquivos, setFotosArquivos] = useState([])
  const [observacoes, setObservacoes] = useState('')
  const [erroFoto, setErroFoto] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleFotosChange(e) {
    const arquivos = Array.from(e.target.files)
    if (!arquivos.length) return

    if (arquivos.find((a) => a.size > MAX_FILE_SIZE)) {
      setErroFoto('Cada imagem deve ter no máximo 5MB.')
      e.target.value = ''
      return
    }
    if (arquivos.find((a) => !a.type.startsWith('image/'))) {
      setErroFoto('Selecione apenas arquivos de imagem.')
      e.target.value = ''
      return
    }

    const novas = arquivos.map((a) => ({ nome: a.name, url: URL.createObjectURL(a) }))
    setFotos((prev) => [...prev, ...novas])
    setFotosArquivos((prev) => [...prev, ...arquivos])
    setErroFoto('')
    e.target.value = ''
  }

  function removerFoto(index) {
    setFotos((prev) => prev.filter((_, i) => i !== index))
    setFotosArquivos((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleProximo() {
    if (idOs && fotosArquivos.length > 0) {
      setCarregando(true)
      try {
        for (const arquivo of fotosArquivos) {
          await ordensServico.uploadFoto(idOs, arquivo, 'antes', observacoes || null)
        }
      } catch {
        // fotos são opcionais nesta etapa, continua mesmo com erro
      } finally {
        setCarregando(false)
      }
    }
    onProximo()
  }

  return (
    <AppLayout active="inicio" onNavigate={onNavigate}>
      <section className="checklist-screen">
        <div className="screen-title center-title">
          <h2>Check-list Visual</h2>
        </div>

        <div className="checklist-content">
          <div className="checklist-left">
            <div className="checklist-options">
              {ITENS_CHECKLIST.map((item) => (
                <label key={item}>
                  <input type="checkbox" />
                  {item}
                </label>
              ))}
            </div>

            <div className="checklist-divider" />

            <div className="observations-area">
              <h3>Observações de Avarias</h3>
              <textarea
                placeholder="Digite aqui suas observações..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          <div className="photos-area">
            <h3>Fotos do Veículo</h3>

            <label htmlFor="fotos-veiculo" className="btn-photo">
              Capturar Foto
            </label>

            <input
              id="fotos-veiculo"
              className="input-file-hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotosChange}
            />

            {erroFoto && <p className="form-error">{erroFoto}</p>}

            <div className="photo-grid">
              {fotos.length === 0 && (
                <>
                  <div className="photo-placeholder"><span>Imagem</span></div>
                  <div className="photo-placeholder"><span>Imagem</span></div>
                  <div className="photo-placeholder"><span>Imagem</span></div>
                  <div className="photo-placeholder"><span>Imagem</span></div>
                </>
              )}
              {fotos.map((foto, index) => (
                <div className="photo-preview" key={index}>
                  <button type="button" onClick={() => removerFoto(index)}>×</button>
                  <img src={foto.url} alt={foto.nome} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-actions">
          <button className="btn-outline small-action" type="button" onClick={onVoltar}>Voltar</button>
          <button className="btn-main small-action-main" type="button" onClick={handleProximo} disabled={carregando}>
            {carregando ? 'Enviando fotos...' : 'Salvar e Continuar'}
          </button>
        </div>
      </section>
    </AppLayout>
  )
}

export default ChecklistVisual
