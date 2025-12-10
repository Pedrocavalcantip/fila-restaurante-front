import axios from 'axios';

// ==========================================
// 📡 CONFIGURAÇÃO DA API
// ==========================================
// VITE_API_URL: URL completa da API em produção (ex: https://seu-backend.up.railway.app/api/v1)
// Em desenvolvimento: deixe vazio para usar o proxy do Vite (/api -> localhost:3000)

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

// Adiciona o Token automaticamente em rotas privadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Apenas loga erros críticos em produção
    if (import.meta.env.MODE === 'development') {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);


// AUTENTICAÇÃO - /api/v1/auth

export const authService = {
  /**
   * Login do operador/admin
   * POST /api/v1/auth/login
   * @param {Object} credenciais - { email, senha, restauranteSlug }
   */
  login: async (credenciais) => {
    const response = await api.post('/auth/login', credenciais);
    return response.data;
  },

  /**
   * Quem sou eu (validar token)
   * GET /api/v1/auth/me
   */
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// CLIENTE - /api/v1/auth/cliente & /api/v1/cliente

export const clienteService = {
  // --- AUTENTICAÇÃO ---
  
  /**
   * Cadastrar novo cliente
   * POST /api/v1/auth/cliente/cadastro
   * @param {Object} dados - { nomeCompleto, email, telefone, senha, cpf, cidade, estado }
   */
  cadastrar: async (dados) => {
    const response = await api.post('/auth/cliente/cadastro', dados);
    return response.data;
  },

  /**
   * Login do cliente
   * POST /api/v1/auth/cliente/login
   * @param {Object} credenciais - { email, senha }
   */
  login: async (credenciais) => {
    const response = await api.post('/auth/cliente/login', credenciais);
    return response.data;
  },

  // --- PERFIL ---

  /**
   * Buscar meu perfil
   * GET /api/v1/cliente/perfil
   */
  buscarPerfil: async () => {
    const response = await api.get('/cliente/perfil');
    return response.data;
  },

  /**
   * Atualizar meu perfil
   * PATCH /api/v1/cliente/perfil
   * @param {Object} dados - { nomeCompleto, telefone, cidade, estado }
   */
  atualizarPerfil: async (dados) => {
    const response = await api.patch('/cliente/perfil', dados);
    return response.data;
  },

  // --- BUSCA DE RESTAURANTES ---

  /**
   * Buscar restaurantes próximos
   * GET /api/v1/cliente/restaurantes/proximos
   * @param {Object} [params] - { cidade, latitude, longitude, raioKm, nome }
   */
  buscarRestaurantes: async (params = {}) => {
    const response = await api.get('/cliente/restaurantes/proximos', { params });
    return response.data;
  },

  // --- FILA E TICKETS ---

  /**
   * Entrar na fila de um restaurante
   * POST /api/v1/cliente/restaurantes/:slug/fila/entrar
   * @param {string} slug - Slug do restaurante
   * @param {Object} dados - { quantidadePessoas, prioridade, observacoes }
   */
  entrarNaFila: async (slug, dados) => {
    const response = await api.post(`/cliente/restaurantes/${slug}/fila/entrar`, dados);
    return response.data;
  },

  /**
   * Buscar meu ticket ativo
   * GET /api/v1/cliente/meu-ticket
   */
  buscarMeuTicket: async () => {
    const response = await api.get('/cliente/meu-ticket');
    return response.data;
  },

  /**
   * Buscar histórico de tickets do cliente (alias para buscarMeuTicket)
   * GET /api/v1/cliente/meu-ticket
   */
  buscarHistoricoTickets: async () => {
    const response = await api.get('/cliente/meu-ticket');
    return response.data;
  },

  /**
   * Cancelar meu ticket
   * POST /api/v1/cliente/ticket/:ticketId/cancelar
   * @param {string} ticketId
   * @param {string} [motivo]
   */
  cancelarTicket: async (ticketId, motivo) => {
    const response = await api.post(`/cliente/ticket/${ticketId}/cancelar`, { motivo });
    return response.data;
  },
};

// RESTAURANTES - /api/v1/restaurantes

export const restauranteService = {
  /**
   * Cadastrar novo restaurante (público)
   * POST /api/v1/restaurantes/cadastro
   * @param {Object|FormData} dados - Dados do restaurante (aceita JSON ou FormData com imagem)
   */
  cadastrar: async (dados) => {
    // Se for FormData, deixar o axios configurar o Content-Type automaticamente
    const config = dados instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    
    const response = await api.post('/restaurantes/cadastro', dados, config);
    return response.data;
  },

  /**
   * Buscar dados do meu restaurante (Admin)
   * GET /api/v1/restaurantes/meu-restaurante
   */
  buscarMeuRestaurante: async () => {
    const response = await api.get('/restaurantes/meu-restaurante');
    return response.data;
  },

  /**
   * Atualizar configurações do restaurante (Admin)
   * PATCH /api/v1/restaurantes/meu-restaurante
   * @param {Object|FormData} dados - Configurações a atualizar (aceita JSON ou FormData com imagem)
   */
  atualizarRestaurante: async (dados) => {
    const config = dados instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    
    const response = await api.patch('/restaurantes/meu-restaurante', dados, config);
    return response.data;
  },

  /**
   * Alias: atualizar (compatibilidade)
   * PATCH /api/v1/restaurantes/meu-restaurante
   */
  atualizar: async (dados) => {
    const config = dados instanceof FormData ? {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    } : {};
    
    const response = await api.patch('/restaurantes/meu-restaurante', dados, config);
    return response.data;
  },

  /**
   * Listar equipe (operadores e admin)
   * GET /api/v1/restaurantes/equipe
   */
  listarEquipe: async () => {
    const response = await api.get('/restaurantes/equipe');
    return response.data;
  },

  /**
   * Criar operador
   * POST /api/v1/restaurantes/equipe
   * @param {Object} dados - { nome, email, senha, papel: 'OPERADOR' }
   */
  criarOperador: async (dados) => {
    const response = await api.post('/restaurantes/equipe', {
      ...dados,
      papel: 'OPERADOR' // Garantir que sempre seja OPERADOR
    });
    return response.data;
  },

  /**
   * Buscar operador específico
   * GET /api/v1/restaurantes/equipe/:id
   * @param {string} operadorId
   */
  buscarOperador: async (operadorId) => {
    const response = await api.get(`/restaurantes/equipe/${operadorId}`);
    return response.data;
  },

  /**
   * Deletar operador
   * DELETE /api/v1/restaurantes/equipe/:id
   * @param {string} operadorId
   */
  deletarOperador: async (operadorId) => {
    const response = await api.delete(`/restaurantes/equipe/${operadorId}`);
    return response.data;
  },
};

// TICKETS - /api/v1/tickets

export const ticketService = {
  // --- CRIAÇÃO E LISTAGEM (Operador/Admin) ---

  /**
   * Cria um ticket presencialmente (cliente no local)
   * POST /api/v1/tickets/filas/:filaId/tickets
   * @param {string} filaId
   * @param {Object} dados - { nomeCliente, telefone, quantidadePessoas, observacoes }
   */
  criarTicketLocal: async (filaId, dados) => {
    const response = await api.post(`/tickets/filas/${filaId}/tickets`, dados);
    return response.data;
  },

  /**
   * Lista a fila ativa (aguardando e chamados)
   * GET /api/v1/tickets/filas/:filaId/tickets/ativa
   * @param {string} filaId
   */
  listarFilaAtiva: async (filaId) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/ativa`);
    return response.data;
  },

  /**
   * Lista todos os tickets da fila (alias para listarFilaAtiva)
   * GET /api/v1/tickets/filas/:filaId/tickets/ativa
   * @param {string} filaId
   */
  listarTickets: async (filaId) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/ativa`);
    return response.data;
  },

  /**
   * Lista histórico com filtros opcionais
   * GET /api/v1/tickets/filas/:filaId/tickets/historico
   * @param {string} filaId
   * @param {Object} [params] - { busca, status, dataInicio, dataFim, pagina, limite }
   */
  listarHistorico: async (filaId, params = {}) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/historico`, { params });
    return response.data;
  },

  /**
   * Buscar histórico (alias para listarHistorico)
   * GET /api/v1/tickets/filas/:filaId/tickets/historico
   * @param {string} filaId
   * @param {Object} [params] - { busca, status, dataInicio, dataFim, pagina, limite }
   */
  buscarHistorico: async (filaId, params = {}) => {
    const response = await api.get(`/tickets/filas/${filaId}/tickets/historico`, { params });
    return response.data;
  },

  /**
   * Busca detalhes completos do ticket (visão operador)
   * GET /api/v1/tickets/:ticketId
   * @param {string} ticketId
   */
  buscarTicketPrivado: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // --- GESTÃO DE TICKETS (Operador/Admin) ---

  /**
   * Chamar cliente
   * POST /api/v1/tickets/:ticketId/chamar
   */
  chamarCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/chamar`);
    return response.data;
  },

  /**
   * Rechamar cliente
   * POST /api/v1/tickets/:ticketId/rechamar
   */
  rechamarCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/rechamar`);
    return response.data;
  },

  /**
   * Confirmar presença do cliente (CHAMADO → MESA_PRONTA)
   * POST /api/v1/tickets/:ticketId/confirmar-presenca
   */
  confirmarPresenca: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/confirmar-presenca`);
    return response.data;
  },

  /**
   * Pular cliente
   * POST /api/v1/tickets/:ticketId/pular
   */
  pularCliente: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/pular`);
    return response.data;
  },

  /**
   * Finalizar atendimento
   * POST /api/v1/tickets/:ticketId/finalizar
   */
  finalizarAtendimento: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/finalizar`);
    return response.data;
  },

  /**
   * Marcar como no-show
   * POST /api/v1/tickets/:ticketId/no-show
   */
  marcarNoShow: async (ticketId) => {
    const response = await api.post(`/tickets/${ticketId}/no-show`);
    return response.data;
  },

  /**
   * Cancelar ticket (Operador/Admin)
   * POST /api/v1/tickets/:ticketId/cancelar
   * @param {string} ticketId
   * @param {string} [motivo] - Opcional
   */
  cancelarTicket: async (ticketId, motivo) => {
    const response = await api.post(`/tickets/${ticketId}/cancelar`, { motivo });
    return response.data;
  },

  // --- ESTATÍSTICAS (Admin/Operador) ---

  /**
   * Buscar estatísticas do restaurante
   * GET /api/v1/tickets/estatisticas
   * @returns {Object} Estatísticas com dados de hoje, últimos 7 e 30 dias, clientes e gráficos
   */
  buscarEstatisticas: async () => {
    const response = await api.get('/tickets/estatisticas');
    return response.data;
  },
};

// PÚBLICO (sem autenticação) - /api/v1/tickets/publico

export const publicoService = {
  /**
   * Buscar restaurante por slug (PÚBLICO)
   * GET /api/v1/restaurantes/:slug
   * @param {string} slug
   */
  buscarRestaurantePorSlug: async (slug) => {
    const response = await api.get(`/restaurantes/${slug}`);
    return response.data;
  },

  /**
   * Busca dados públicos de um ticket
   * GET /api/v1/tickets/publico/:ticketId
   * @param {string} ticketId
   */
  buscarTicketPublico: async (ticketId) => {
    const response = await api.get(`/tickets/publico/${ticketId}`);
    return response.data;
  },

  /**
   * Consulta a posição atual na fila (polling)
   * GET /api/v1/tickets/publico/:ticketId/posicao
   * @param {string} ticketId
   */
  consultarPosicao: async (ticketId) => {
    const response = await api.get(`/tickets/publico/${ticketId}/posicao`);
    return response.data;
  },
};

export default api;
