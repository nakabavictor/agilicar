const BASE_URL = 'http://localhost:5050/api'

function getToken() {
  return localStorage.getItem('agilicar_token')
}

async function request(method, path, body = null, isFormData = false) {
  const headers = {}
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body && !isFormData) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : null,
  })

  if (res.status === 204) return null

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const msg = data?.mensagem || `Erro ${res.status}`
    throw new Error(msg)
  }

  return data
}

export const auth = {
  login: (email, senha) => request('POST', '/auth/login', { email, senha }),
}

export const clientes = {
  listar: () => request('GET', '/clientes'),
  obter: (id) => request('GET', `/clientes/${id}`),
  buscarPorCpf: (cpf) => request('GET', `/clientes/cpf/${cpf}`),
  criar: (dados) => request('POST', '/clientes', dados),
  atualizar: (id, dados) => request('PUT', `/clientes/${id}`, dados),
  deletar: (id) => request('DELETE', `/clientes/${id}`),
}

export const veiculos = {
  buscarPorPlaca: (placa) => request('GET', `/veiculos/buscar?placa=${encodeURIComponent(placa)}`),
  listarPorCliente: (idCliente) => request('GET', `/veiculos?idCliente=${idCliente}`),
  obter: (id) => request('GET', `/veiculos/${id}`),
  historico: (idVeiculo) => request('GET', `/veiculos/${idVeiculo}/historico`),
  criar: (dados) => request('POST', '/veiculos', dados),
  atualizar: (id, dados) => request('PUT', `/veiculos/${id}`, dados),
}

export const ordensServico = {
  listar: (status) => request('GET', `/ordens-servico${status ? `?status=${status}` : ''}`),
  obter: (id) => request('GET', `/ordens-servico/${id}`),
  criar: (dados) => request('POST', '/ordens-servico', dados),
  atualizarStatus: (id, statusOs) => request('PATCH', `/ordens-servico/${id}/status`, { statusOs }),
  salvarDiagnostico: (id, dados) => request('PATCH', `/ordens-servico/${id}/diagnostico`, dados),
  adicionarServico: (id, dados) => request('POST', `/ordens-servico/${id}/servicos`, dados),
  adicionarPeca: (id, dados) => request('POST', `/ordens-servico/${id}/pecas`, dados),
  listarServicos: (id) => request('GET', `/ordens-servico/${id}/servicos`),
  listarPecas: (id) => request('GET', `/ordens-servico/${id}/pecas`),
  atualizarPrazo: (id, dados) => request('PATCH', `/ordens-servico/${id}/prazo`, dados),
  listarNotificacoes: (id) => request('GET', `/ordens-servico/${id}/notificacoes`),
  listarFotos: (id, momento) => request('GET', `/ordens-servico/${id}/fotos${momento ? `?momento=${momento}` : ''}`),
  uploadFoto: (id, arquivo, momento, descricao) => {
    const form = new FormData()
    form.append('arquivo', arquivo)
    form.append('momento', momento)
    if (descricao) form.append('descricao', descricao)
    return request('POST', `/ordens-servico/${id}/fotos`, form, true)
  },
}

export const orcamentos = {
  obterPorOs: (idOs) => request('GET', `/orcamentos/por-os/${idOs}`),
  criar: (dados) => request('POST', '/orcamentos', dados),
  atualizarStatus: (id, statusOrcamento, observacaoCliente) =>
    request('PATCH', `/orcamentos/${id}/status`, { statusOrcamento, observacaoCliente }),
}

export const pecas = {
  listar: (critico) => request('GET', `/pecas${critico !== undefined ? `?critico=${critico}` : ''}`),
  obter: (id) => request('GET', `/pecas/${id}`),
  criar: (dados) => request('POST', '/pecas', dados),
  atualizar: (id, dados) => request('PUT', `/pecas/${id}`, dados),
  deletar: (id) => request('DELETE', `/pecas/${id}`),
}

export const servicos = {
  listar: () => request('GET', '/servicos'),
  obter: (id) => request('GET', `/servicos/${id}`),
  criar: (dados) => request('POST', '/servicos', dados),
  atualizar: (id, dados) => request('PUT', `/servicos/${id}`, dados),
  deletar: (id) => request('DELETE', `/servicos/${id}`),
}

export const usuarios = {
  listar: (idPerfil, ativo) => {
    const params = new URLSearchParams()
    if (idPerfil !== undefined) params.append('idPerfil', idPerfil)
    if (ativo !== undefined) params.append('ativo', ativo)
    const q = params.toString()
    return request('GET', `/usuarios${q ? `?${q}` : ''}`)
  },
  obter: (id) => request('GET', `/usuarios/${id}`),
  criar: (dados) => request('POST', '/usuarios', dados),
  atualizar: (id, dados) => request('PUT', `/usuarios/${id}`, dados),
  deletar: (id) => request('DELETE', `/usuarios/${id}`),
}

export const notificacoes = {
  criar: (dados) => request('POST', '/notificacoes', dados),
}

export const entregas = {
  registrar: (dados) => request('POST', '/entregas', dados),
  obterPorOs: (idOs) => request('GET', `/entregas/por-os/${idOs}`),
}

export const estoque = {
  movimentacoes: () => request('GET', '/estoque/movimentacoes'),
}
