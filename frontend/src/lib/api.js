import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api'
})

// ─── Blanks ───────────────────────────────────────────────────────────────────
export const getBlanks = (params) => api.get('/blanks', {
    params
})
export const createBlank = (data) => api.post('/blanks', data)
export const updateBlank = (id, d) => api.put(`/blanks/${id}`, d)
export const deleteBlank = (id) => api.delete(`/blanks/${id}`)

// ─── Hastes ───────────────────────────────────────────────────────────────────
export const getHashtes = (params) => api.get('/hastes', {
    params
})
export const createHaste = (data) => api.post('/hastes', data)
export const updateHaste = (id, d) => api.put(`/hastes/${id}`, d)
export const deleteHaste = (id) => api.delete(`/hastes/${id}`)

// ─── Esferas ──────────────────────────────────────────────────────────────────
export const getEsferas = (params) => api.get('/esferas', {
    params
})
export const createEsfera = (data) => api.post('/esferas', data)
export const updateEsfera = (id, d) => api.put(`/esferas/${id}`, d)
export const deleteEsfera = (id) => api.delete(`/esferas/${id}`)

// ─── Mão de Obra ──────────────────────────────────────────────────────────────
export const getMaoDeObra = () => api.get('/mao-de-obra')
export const createMaoDeObra = (data) => api.post('/mao-de-obra', data)
export const updateMaoDeObra = (id, d) => api.put(`/mao-de-obra/${id}`, d)
export const deleteMaoDeObra = (id) => api.delete(`/mao-de-obra/${id}`)

// ─── Produtos ─────────────────────────────────────────────────────────────────
export const getProdutos = (params) => api.get('/produtos', {
    params
})
export const getProduto = (id) => api.get(`/produtos/${id}`)
export const createProduto = (data) => api.post('/produtos', data)
export const updateProduto = (id, d) => api.put(`/produtos/${id}`, d)
export const deleteProduto = (id) => api.delete(`/produtos/${id}`)

// ─── Composições ──────────────────────────────────────────────────────────────
export const sugerirBlank = (d) => api.post('/composicoes/sugerir-blank', d)
export const calcularHaste = (d) => api.post('/composicoes/calcular-haste', d)
export const calcularCusto = (d) => api.post('/composicoes/calcular-custo', d)

// ─── Bling ────────────────────────────────────────────────────────────────────
export const getBlingStatus = () => api.get('/bling/auth/status')
export const getBlingAuthUrl = () => api.get('/bling/auth/url')
export const salvarTokenManual = (d) => api.post('/bling/auth/token-manual', d)
export const getBlingProdutos = (q) => api.get('/bling/produtos', {
    params: {
        q
    }
})
export const sincronizarBling = (id) => api.post(`/bling/sincronizar/${id}`)
export const importarDoBling = (bId) => api.post(`/bling/importar/${bId}`)
export const importarBlankDoBling = (blingId) => api.post(`/bling/blanks/importar/${blingId}`)
export const sincronizarBlankBling = (id) => api.post(`/bling/blanks/${id}/sincronizar`)
export const getBlingPedidos = (situacao) => api.get('/bling/pedidos', {
    params: situacao ? {
        situacao
    } : {}
})
export const getBlingPedido = (id) => api.get(`/bling/pedidos/${id}`)

// ─── Centros de Trabalho ──────────────────────────────────────────────────────
export const getCentros = () => api.get('/centros-trabalho')
export const createCentro = (d) => api.post('/centros-trabalho', d)
export const updateCentro = (id, d) => api.put(`/centros-trabalho/${id}`, d)
export const deleteCentro = (id) => api.delete(`/centros-trabalho/${id}`)

// ─── Ordens de Produção ───────────────────────────────────────────────────────
export const getOPs = () => api.get('/ordens-producao')
export const getOP = (id) => api.get(`/ordens-producao/${id}`)
export const createOP = (d) => api.post('/ordens-producao', d)
export const updateOP = (id, d) => api.put(`/ordens-producao/${id}`, d)
export const deleteOP = (id) => api.delete(`/ordens-producao/${id}`)
export const iniciarOP = (id) => api.post(`/ordens-producao/${id}/iniciar`)
export const concluirOP = (id) => api.post(`/ordens-producao/${id}/concluir`)

// ─── Apontamentos ─────────────────────────────────────────────────────────────
export const getApontamentos = (opId) => api.get(`/apontamentos/op/${opId}`)
export const iniciarApontamento = (d) => api.post('/apontamentos', d)
export const concluirApontamento = (id, d) => api.put(`/apontamentos/${id}/concluir`, d)
export const pausarApontamento = (id, d) => api.put(`/apontamentos/${id}/pausar`, d)

// ─── Configurações ───────────────────────────────────────────────────────────
export const getConfigs = () => api.get('/configuracoes')
export const saveConfigs = (d) => api.put('/configuracoes', d)