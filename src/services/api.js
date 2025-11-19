import axios from 'axios';

// Cria a instância do Axios apontando para a sua API
const api = axios.create({
  // Ajuste a porta conforme seu backend
  baseURL: 'http://localhost:3000/api/v1',
});

// Adiciona o Token automaticamente em rotas privadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 🏢 RESTAURANTE - Cadastro e Gestão
// ==========================================

export const restauranteService = {
  /**
   * Cadastrar novo restaurante (público)
   * @param {Object} dados - { nome, slug, cnpj, telefone, email, endereco, admin, configuracao }
   */
  cadastrar: async (dados) => {
    const response = await api.post('/restaurantes/cadastro', dados);
    return response.data;
  },

  /**
   * Buscar dados do meu restaurante (operador logado)
   */
  buscarMeuRestaurante: async () => {
    const response = await api.get('/restaurantes/meu-restaurante');
    return response.data;
  },

  /**
   * Atualizar meu restaurante (apenas ADMIN)
   * @param {Object} dados - { nome, telefone, precoFastLane, precoVip }
   */
  atualizar: async (dados) => {
    const response = await api.patch('/restaurantes/meu-restaurante', dados);
    return response.data;
  },
};

// ==========================================
// 👤 CLIENTE - Cadastro, Login e Perfil
// ==========================================

export const clienteService = {
  /**
   * Cadastrar novo cliente
   * @param {Object} dados - { restauranteSlug, nomeCompleto, telefone, email, senha, cidade, estado }
   */
  cadastrar: async (dados) => {
    const response = await api.post('/auth/cliente/cadastro', dados);
    return response.data;
  },

  /**
   * Login do cliente
   * @param {Object} credenciais - { restauranteSlug, email, senha }
   */
  login: async (credenciais) => {
    const response = await api.post('/auth/cliente/login', credenciais);
    return response.data;
  },

  /**
   * Buscar meu perfil
   */
  buscarPerfil: async () => {
    const response = await api.get('/cliente/perfil');
    return response.data;
  },

  /**
   * Atualizar meu perfil
   * @param {Object} dados - { nomeCompleto, telefone, cidade, estado }
   */
  atualizarPerfil: async (dados) => {
    const response = await api.patch('/cliente/perfil', dados);
    return response.data;
  },

  /**
   * Buscar restaurantes próximos
   * @param {Object} [params] - { cidade, latitude, longitude, raioKm, nome }
   */
  buscarRestaurantes: async (params = {}) => {
    const response = await api.get('/cliente/restaurantes/proximos', { params });
    return response.data;
  },

  /**
   * Entrar na fila de um restaurante
   * @param {string} slug - Slug do restaurante
   * @param {Object} dados - { tipoFila, observacoes }
   */
  entrarNaFila: async (slug, dados) => {
    const response = await api.post(`/cliente/restaurantes/${slug}/fila/entrar`, dados);
    return response.data;
  },

  /**
   * Calcular taxa de Fast-Lane
   * @param {string} slug - Slug do restaurante
   * @param {Object} dados - { posicoesPular }
   */
  calcularTaxaFastLane: async (slug, dados) => {
    const response = await api.post(`/cliente/restaurantes/${slug}/fila/calcular-taxa`, dados);
    return response.data;
  },

  /**
   * Buscar meu ticket ativo
   */
  buscarMeuTicket: async () => {
    const response = await api.get('/cliente/meu-ticket');
    return response.data;
  },

  /**
   * Cancelar meu ticket
   * @param {string} ticketId
   * @param {string} [motivo]
   */
  cancelarTicket: async (ticketId, motivo) => {
    const response = await api.post(`/cliente/ticket/${ticketId}/cancelar`, { motivo });
    return response.data;
  },
};

// ==========================================
// 👨‍💼 AUTH - Operador/Admin
// ==========================================

export const authService = {
  /**
   * Login do operador/admin
   * @param {Object} credenciais - { email, senha }
   */
  login: async (credenciais) => {
    const response = await api.post('/auth/login', credenciais);
    return response.data;
  },

  /**
   * Quem sou eu (validar token)
   */
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ==========================================
// 🌎 PÚBLICO (Cliente) - Consulta sem autenticação
// ==========================================

export const publicoService = {
  /**
   * Busca dados públicos de um ticket
   * @param {string} ticketId
   */
  buscarTicketPublico: async (ticketId) => {
    const response = await api.get(`/tickets/publico/${ticketId}`);
    return response.data;
  },

  /**
   * Consulta a posição atual na fila (polling)
   * @param {string} ticketId
   */
  consultarPosicao: async (ticketId) => {
    const response = await api.get(`/tickets/publico/${ticketId}/posicao`);
    return response.data;
  },
};

// ==========================================
// 🔒 PRIVADO (Operador/Admin - Fila)
// ==========================================

export const ticketService = {
  /**
   * Cria um ticket presencialmente (cliente no local)
   * @param {string} filaId
   * @param {Object} dados - { nomeCliente, telefone, quantidadePessoas, observacoes }
   */
  criarTicketLocal: async (filaId, dados) => {
    const response = await api.post(`/tickets/filas/${filaId}/tickets`, dados);
    return response.data;
  },

  /**
   * Lista a fila ativa (aguardando e chamados)
   * @param {string} filaId
   */
  listarFilaAtiva: async (filaId) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/ativa`);
    return response.data;
  },

  /**
   * Lista histórico com filtros opcionais
   * @param {string} filaId
   * @param {Object} [params] - { busca, status, dataInicio, dataFim, pagina, limite }
   */
  listarHistorico: async (filaId, params = {}) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/historico`, { params });
    return response.data;
  },

  /**
   * Busca detalhes completos do ticket (visão operador)
   * @param {string} ticketId
   */
  buscarTicketPrivado: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // ==========================================
  // ⚡ AÇÕES DO OPERADOR (Mudança de Status)
  // ==========================================

  chamarCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/chamar`);
    return response.data;
  },

  rechamarCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/rechamar`);
    return response.data;
  },

  pularCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/pular`);
    return response.data;
  },

  marcarNoShow: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/no-show`);
    return response.data;
  },

  fazerCheckIn: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/check-in`);
    return response.data;
  },

  finalizarAtendimento: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/finalizar`);
    return response.data;
  },

  /**
   * Cancela o ticket
   * @param {string} ticketId
   * @param {string} [motivo] - Opcional
   */
  cancelarTicket: async (ticketId, motivo) => {
    const response = await api.post(`/tickets/${ticketId}/cancelar`, { motivo });
    return response.data;
  },
};

export default api;