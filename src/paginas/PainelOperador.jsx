import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, Phone, CheckCircle, CheckCircle2, XCircle, RefreshCw, SkipForward, AlertCircle, X, MessageSquare, Calendar, History, Tv, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ticketService, restauranteService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';
import WebSocketStatus from '../components/WebSocketStatus';

function PainelOperador() {
  const navigate = useNavigate();
  const [filaData, setFilaData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [filaId, setFilaId] = useState('fila-123'); // TODO: Obter do contexto/localStorage
  const [ticketSelecionado, setTicketSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [ticketParaCancelar, setTicketParaCancelar] = useState(null);
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    nomeCliente: '',
    telefone: '',
    quantidadePessoas: 1,
    observacoes: ''
  });

  // Obter restauranteId do localStorage (UUID)
  const restauranteId = localStorage.getItem('restauranteId') || '';
  const restauranteSlug = localStorage.getItem('restauranteSlug') || '';

  // Conectar WebSocket para atualizações em tempo real
  const { isConnected, error: wsError, on, off } = useWebSocket({ 
    restauranteId,
    restauranteSlug, // fallback caso restauranteId não esteja disponível
    autoConnect: !!(restauranteId || restauranteSlug)
  });

  // Carregar fila inicial
  useEffect(() => {
    carregarFila();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escutar eventos WebSocket em tempo real
  useEffect(() => {
    if (!isConnected) {
      logger.log('⚠️ WebSocket não conectado, listeners não registrados');
      return;
    }

    logger.log('🎧 Registrando listeners WebSocket...');

    // Ticket criado
    const handleTicketCriado = (data) => {
      logger.log('🎫 EVENTO RECEBIDO: ticket:criado', data);
      // Recarregar fila para pegar atualização
      carregarFila();
    };

    // Ticket atualizado (status/posição mudou)
    const handleTicketAtualizado = (data) => {
      logger.log('📝 EVENTO RECEBIDO: ticket:atualizado', data);
      carregarFila();
    };

    // Ticket chamado
    const handleTicketChamado = (data) => {
      logger.log('📢 EVENTO RECEBIDO: ticket:chamado', data);
      // Tocar som de notificação
      playNotificationSound();
      carregarFila();
    };

    // Mesa pronta (cliente confirmou presença)
    const handleMesaPronta = (data) => {
      logger.log('🍽️ EVENTO RECEBIDO: ticket:mesa-pronta', data);
      // Tocar som de notificação
      playNotificationSound();
      carregarFila();
    };

    // Ticket finalizado
    const handleTicketFinalizado = (data) => {
      logger.log('✅ EVENTO RECEBIDO: ticket:finalizado', data);
      carregarFila();
    };

    // Ticket cancelado
    const handleTicketCancelado = (data) => {
      logger.log('❌ EVENTO RECEBIDO: ticket:cancelado', data);
      carregarFila();
    };

    // Fila atualizada (estatísticas)
    const handleFilaAtualizada = (data) => {
      logger.log('📊 EVENTO RECEBIDO: fila:atualizada', data);
      setEstatisticas(data);
    };

    // Registrar eventos
    on('ticket:criado', handleTicketCriado);
    on('ticket:atualizado', handleTicketAtualizado);
    on('ticket:chamado', handleTicketChamado);
    on('ticket:mesa-pronta', handleMesaPronta);
    on('ticket:finalizado', handleTicketFinalizado);
    on('ticket:cancelado', handleTicketCancelado);
    on('fila:atualizada', handleFilaAtualizada);
    
    logger.log('✅ Listeners WebSocket registrados com sucesso');

    // Cleanup
    return () => {
      off('ticket:criado', handleTicketCriado);
      off('ticket:atualizado', handleTicketAtualizado);
      off('ticket:chamado', handleTicketChamado);
      off('ticket:mesa-pronta', handleMesaPronta);
      off('ticket:finalizado', handleTicketFinalizado);
      off('ticket:cancelado', handleTicketCancelado);
      off('fila:atualizada', handleFilaAtualizada);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, on, off]);

  const playNotificationSound = () => {
    // Tocar som de notificação (se tiver arquivo de áudio)
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => logger.log('Não foi possível tocar som:', err));
    } catch (err) {
      logger.log('Erro ao tocar som:', err);
    }
  };

  const carregarFila = async () => {
    setLoading(true);
    try {
      // Tentar obter filaId do localStorage
      let filaId = localStorage.getItem('filaAtivaId');
      
      // Se não tiver filaId, buscar do backend
      if (!filaId) {
        logger.warn('⚠️ filaId não encontrado no localStorage. Buscando dados do restaurante...');
        try {
          const restauranteSlug = localStorage.getItem('restauranteSlug');
          if (!restauranteSlug) {
            logger.error('❌ ERRO: restauranteSlug também não encontrado');
            setErro('Erro ao carregar dados do restaurante. Faça login novamente.');
            return;
          }
          
          // Buscar dados do restaurante para obter o filaId
          const responseRestaurante = await restauranteService.buscarMeuRestaurante();
          logger.log('📦 Dados do restaurante:', responseRestaurante);
          
          // Backend retorna { restaurante: { filas: [...] } } ou diretamente { filas: [...] }
          const filas = responseRestaurante.restaurante?.filas || responseRestaurante.filas || [];
          
          if (filas.length > 0) {
            filaId = filas[0].id;
            localStorage.setItem('filaAtivaId', filaId);
            logger.log('✅ FilaId obtido:', filaId);
          } else {
            logger.error('❌ ERRO: Restaurante não possui filas');
            logger.error('❌ Resposta completa:', responseRestaurante);
            setErro('⚠️ ERRO DE CONFIGURAÇÃO: O backend não retornou as filas do restaurante. Verifique se o endpoint GET /restaurantes/meu-restaurante está incluindo o relacionamento "filas" ou "Fila".');
            return;
          }
        } catch (error) {
          logger.error('❌ Erro ao buscar dados do restaurante:', error);
          setErro('Erro ao carregar dados. Faça login novamente.');
          return;
        }
      }
      
      logger.log('🔍 Carregando fila:', filaId);
      const response = await ticketService.listarFilaAtiva(filaId);
      logger.log('📋 Tickets recebidos:', response.tickets);
      logger.log('🔍 Primeiro ticket completo:', response.tickets?.[0]);
      logger.log('👥 Campos de quantidade:', {
        quantidadePessoas: response.tickets?.[0]?.quantidadePessoas,
        qtdPessoas: response.tickets?.[0]?.qtdPessoas,
        numeroPessoas: response.tickets?.[0]?.numeroPessoas,
        pessoas: response.tickets?.[0]?.pessoas
      });
      setFilaData(response.fila);
      
      // Calcular posições localmente baseado na ordem dos tickets AGUARDANDO
      const ticketsComPosicao = (response.tickets || []).map((ticket, index) => {
        // Se o ticket está AGUARDANDO, calcular posição baseada na ordem
        // Tickets CHAMADO/MESA_PRONTA não contam na fila de espera
        return ticket;
      });
      
      // Recalcular posições apenas para tickets AGUARDANDO
      let posicaoAtual = 1;
      const ticketsOrdenados = ticketsComPosicao.map(ticket => {
        if (ticket.status === 'AGUARDANDO') {
          return { ...ticket, posicao: posicaoAtual++ };
        }
        // Tickets CHAMADO ou MESA_PRONTA ficam sem posição numérica
        return { ...ticket, posicao: ticket.status === 'CHAMADO' ? '📢' : ticket.status === 'MESA_PRONTA' ? '✅' : ticket.posicao };
      });
      
      setTickets(ticketsOrdenados);
      setEstatisticas(response.estatisticas);
      logger.log('✅ Fila carregada:', response);
      logger.log('📊 Total de tickets:', response.tickets?.length);
      logger.log('📋 Status dos tickets:', response.tickets?.map(t => ({ numeroTicket: t.numeroTicket, status: t.status })));
      logger.log('🔍 Primeiro ticket completo:', response.tickets?.[0]);
    } catch (error) {
      logger.error('Erro ao carregar fila:', error);
      setErro('Erro ao carregar fila. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const atualizarFila = async () => {
    setAtualizando(true);
    await carregarFila();
    setAtualizando(false);
  };

  const chamarCliente = async (ticketId) => {
    try {
      await ticketService.chamarCliente(ticketId);
      logger.log('✅ Cliente chamado');
      await carregarFila();
    } catch (error) {
      logger.error('Erro ao chamar cliente:', error);
    }
  };

  const rechamarCliente = async (ticketId) => {
    try {
      await ticketService.rechamarCliente(ticketId);
      logger.log('✅ Cliente rechamado');
      await carregarFila();
    } catch (error) {
      logger.error('Erro ao rechamar cliente:', error);
    }
  };

  const confirmarPresenca = async (ticketId) => {
    try {
      logger.log('🔄 Confirmando presença do ticket:', ticketId);
      const response = await ticketService.confirmarPresenca(ticketId);
      logger.log('✅ Resposta do backend:', response);
      logger.log('📊 Status do ticket após confirmar:', response.ticket?.status);
      logger.log('📦 Ticket completo:', JSON.stringify(response.ticket, null, 2));
      
      // Recarregar fila para mostrar atualização
      await carregarFila();
    } catch (error) {
      logger.error('❌ Erro ao confirmar presença:', error);
      const mensagem = error.response?.data?.mensagem || error.response?.data?.erro || 'Erro ao confirmar presença';
      alert(`Erro: ${mensagem}`);
    }
  };

  const finalizarAtendimento = async (ticketId) => {
    try {
      logger.log('🔄 Finalizando atendimento do ticket:', ticketId);
      const response = await ticketService.finalizarAtendimento(ticketId);
      logger.log('✅ Atendimento finalizado:', response);
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
    } catch (error) {
      logger.error('❌ Erro ao finalizar atendimento:', error);
      logger.error('❌ Status:', error.response?.status);
      logger.error('❌ Dados:', error.response?.data);
      const mensagem = error.response?.data?.mensagem || error.response?.data?.erro || 'Erro ao finalizar atendimento';
      alert(`Erro: ${mensagem}`);
    }
  };

  const pularVez = async (ticketId) => {
    try {
      await ticketService.pularCliente(ticketId);
      logger.log('✅ Vez pulada');
      await carregarFila();
    } catch (error) {
      logger.error('Erro ao pular vez:', error);
    }
  };

  const marcarNoShow = async (ticketId) => {
    if (!window.confirm('Confirmar que o cliente não apareceu?')) return;
    
    try {
      await ticketService.marcarNoShow(ticketId);
      logger.log('✅ No-show registrado');
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
    } catch (error) {
      logger.error('Erro ao marcar no-show:', error);
    }
  };

  const abrirModalCancelar = (ticketId) => {
    setTicketParaCancelar(ticketId);
    setModalCancelarAberto(true);
  };

  const cancelarTicket = async () => {
    if (!motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    try {
      await ticketService.cancelarTicket(ticketParaCancelar, motivoCancelamento);
      logger.log('✅ Ticket cancelado');
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
      setModalCancelarAberto(false);
      setMotivoCancelamento('');
      setTicketParaCancelar(null);
    } catch (error) {
      logger.error('Erro ao cancelar ticket:', error);
    }
  };

  const adicionarClientePresencial = async () => {
    if (!novoCliente.nomeCliente.trim() || !novoCliente.telefone.trim()) {
      alert('Nome e telefone são obrigatórios.');
      return;
    }

    try {
      const filaId = localStorage.getItem('filaAtivaId');
      if (!filaId) {
        logger.error('❌ ERRO: filaId não encontrado');
        return;
      }
      
      await ticketService.criarTicketLocal(filaId, {
        nomeCliente: novoCliente.nomeCliente,
        telefone: novoCliente.telefone,
        quantidadePessoas: novoCliente.quantidadePessoas,
        observacoes: novoCliente.observacoes
      });
      
      logger.log('✅ Cliente presencial adicionado');
      await carregarFila();
      
      // Limpar form e fechar modal
      setNovoCliente({
        nomeCliente: '',
        telefone: '',
        quantidadePessoas: 1,
        observacoes: ''
      });
      setModalAdicionarAberto(false);
    } catch (error) {
      logger.error('Erro ao adicionar cliente:', error);
    }
  };

  const formatarTelefone = (tel) => {
    if (!tel) return '';
    const num = tel.replace(/\D/g, '');
    if (num.length === 11) {
      return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    }
    return tel;
  };

  const formatarTempoEspera = (dataISO) => {
    if (!dataISO) return '0 min';
    const minutos = Math.floor((Date.now() - new Date(dataISO)) / 60000);
    return `${minutos} min`;
  };

  const formatarTempoChamado = (ticket) => {
    // Para tickets chamados, calcular desde quando foi chamado (atualizadoEm)
    // Para tickets aguardando, calcular desde criação (criadoEm)
    const dataReferencia = ticket.status === 'CHAMADO' ? ticket.atualizadoEm : ticket.criadoEm;
    return formatarTempoEspera(dataReferencia);
  };

  const abrirDetalhes = (ticket) => {
    setTicketSelecionado(ticket);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setTicketSelecionado(null);
  };

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleVoltar = () => {
    // Verificar role do usuário logado (prioriza userRole do localStorage)
    const userRole = localStorage.getItem('userRole');
    
    if (!userRole) {
      // Fallback: tentar extrair do operadorLogado
      const operadorLogado = JSON.parse(localStorage.getItem('operadorLogado') || '{}');
      const role = (operadorLogado.role || operadorLogado.papel)?.toUpperCase();
      
      if (role === 'ADMIN') {
        navigate('/restaurante/painel');
      } else {
        navigate('/restaurante/login');
      }
    } else {
      // ADMIN tem acesso ao Painel Administrativo
      // OPERADOR volta para a tela de login
      if (userRole === 'ADMIN') {
        navigate('/restaurante/painel');
      } else {
        navigate('/restaurante/login');
      }
    }
  };

  const handleLogout = () => {
    // Limpar TODOS os dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('operadorLogado');
    localStorage.removeItem('restauranteSlug');
    localStorage.removeItem('filaAtivaId');
    localStorage.removeItem('userRole');
    
    logger.log('✅ Logout realizado - localStorage limpo');
    
    // Redirecionar para login
    navigate('/restaurante/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVoltar}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Fila ao Vivo</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-gray-400">Gerencie os clientes em tempo real</p>
                  <WebSocketStatus isConnected={isConnected} error={wsError} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/publico/painel')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50 rounded-xl transition-all duration-200 text-sm font-medium"
                title="Painel Público (TV)"
              >
                <Tv className="w-4 h-4" />
                Painel TV
              </button>
              <button
                onClick={() => navigate('/restaurante/historico-tickets')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white border border-gray-700/50 rounded-xl transition-all duration-200 text-sm font-medium"
              >
                <History className="w-4 h-4" />
                Histórico
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl transition-all duration-200 text-sm font-medium"
                title="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
              <button
                onClick={() => setModalAdicionarAberto(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg shadow-orange-500/25"
              >
                <Users className="w-4 h-4" />
                Cliente Local +
              </button>
              <button
                onClick={atualizarFila}
                disabled={atualizando}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 text-sm font-semibold shadow-lg shadow-orange-500/25"
              >
                <RefreshCw className={`w-4 h-4 ${atualizando ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      

        {/* Lista da Fila */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800/50">
          <div className="px-6 py-4 border-b border-gray-800/50">
            <h2 className="text-base font-bold text-white">Clientes Aguardando</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 relative mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400">Carregando fila...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-sm text-gray-500">Nenhum cliente na fila no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800/50">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-5 hover:bg-gray-800/30 transition-all duration-200">
                  <div className="flex items-center justify-between gap-6">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => abrirDetalhes(ticket)}
                    >
                      {/* Posição - Design mais compacto */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                          ticket.status === 'CHAMADO' 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25' 
                            : ticket.status === 'MESA_PRONTA'
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/25'
                            : 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-gray-500/25'
                        }`}>
                          <span className="text-3xl font-bold text-white">
                            {ticket.status === 'CHAMADO' ? '📢' : 
                             ticket.status === 'MESA_PRONTA' ? '✅' :
                             `${ticket.posicao}º`}
                          </span>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-bold text-white truncate hover:text-orange-400 transition-colors">
                            {ticket.nomeCliente}
                          </h3>
                          {/* Badge de Prioridade */}
                          {ticket.prioridade === 'FAST_LANE' && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              ⚡ Fast Lane
                            </span>
                          )}
                          {ticket.prioridade === 'VIP' && (
                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap bg-purple-500/20 text-purple-400 border border-purple-500/30">
                              👑 VIP
                            </span>
                          )}
                          {/* Badge de Status */}
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                            ticket.status === 'CHAMADO' 
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                              : ticket.status === 'MESA_PRONTA'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {ticket.status === 'CHAMADO' ? '📢 Chamado' : 
                             ticket.status === 'MESA_PRONTA' ? '✅ Confirmado' :
                             '⏳ Aguardando'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" />
                            {formatarTelefone(ticket.telefoneCliente) || 'Sem telefone'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            {ticket.quantidadePessoas || 1} pessoa{(ticket.quantidadePessoas || 1) > 1 ? 's' : ''}
                          </span>
                          <span className={`flex items-center gap-1.5 font-medium ${
                            ticket.status === 'CHAMADO' ? 'text-purple-400' : 'text-orange-400'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {ticket.status === 'CHAMADO' ? 'Aguardando' : 'Aguardando'} {formatarTempoEspera(ticket.criadoEm)}
                          </span>
                          {ticket.contagemRechamada > 0 && (
                            <span className="flex items-center gap-1.5 text-red-400 font-bold bg-red-500/20 px-2 py-0.5 rounded-lg animate-pulse border border-red-500/30">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Rechamado {ticket.contagemRechamada}x
                            </span>
                          )}
                        </div>

                        {ticket.observacoes && (
                          <div className="mt-2 text-xs text-gray-500 italic">
                            💬 {ticket.observacoes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações - Botões */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === 'AGUARDANDO' && (
                        <>
                          <button
                            onClick={() => chamarCliente(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all text-sm font-semibold whitespace-nowrap shadow-lg shadow-orange-500/25"
                          >
                            🔔 Chamar Cliente
                          </button>
                          <button
                            onClick={() => abrirModalCancelar(ticket.id)}
                            className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 rounded-xl transition-all text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'CHAMADO' && (
                        <>
                          <button
                            onClick={() => confirmarPresenca(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all text-sm font-semibold whitespace-nowrap shadow-lg shadow-orange-500/25"
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={() => rechamarCliente(ticket.id)}
                            className="px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all text-sm font-semibold shadow-lg shadow-purple-500/25"
                          >
                            Rechamar
                          </button>
                          <button
                            onClick={() => pularVez(ticket.id)}
                            className="px-3 py-2 bg-gray-700/50 hover:bg-white hover:text-gray-900 text-gray-300 border border-gray-600/50 rounded-xl transition-all text-sm font-medium"
                          >
                            Pular
                          </button>
                          <button
                            onClick={() => marcarNoShow(ticket.id)}
                            className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 rounded-xl transition-all text-sm font-medium"
                          >
                            No-Show
                          </button>
                        </>
                      )}

                      {ticket.status === 'MESA_PRONTA' && (
                        <>
                          <button
                            onClick={() => finalizarAtendimento(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all text-sm font-semibold whitespace-nowrap shadow-lg shadow-orange-500/25"
                          >
                            Finalizar
                          </button>
                          <button
                            onClick={() => abrirModalCancelar(ticket.id)}
                            className="px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-700/50 rounded-xl transition-all text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Ticket */}
      {modalAberto && ticketSelecionado && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={fecharModal}>
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="sticky top-0 bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{ticketSelecionado.nomeCliente}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                      Ticket {ticketSelecionado.numeroTicket}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticketSelecionado.status === 'CHAMADO'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {ticketSelecionado.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={fecharModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <p className="text-xs text-orange-400 font-medium mb-1">Posição na Fila</p>
                  <p className="text-3xl font-bold text-orange-400">{ticketSelecionado.posicao}º</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <p className="text-xs text-purple-400 font-medium mb-1">Tempo de Espera</p>
                  <p className="text-3xl font-bold text-purple-400">{formatarTempoEspera(ticketSelecionado.criadoEm)}</p>
                </div>
              </div>

              {/* Detalhes do Cliente */}
              <div className="bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Telefone</p>
                    <p className="text-sm text-white font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {formatarTelefone(ticketSelecionado.telefoneCliente)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Quantidade de Pessoas</p>
                    <p className="text-sm text-white font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      {ticketSelecionado.quantidadePessoas} pessoa{ticketSelecionado.quantidadePessoas > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Prioridade</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      ticketSelecionado.prioridade === 'FAST_LANE' 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : ticketSelecionado.prioridade === 'VIP'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {ticketSelecionado.prioridade === 'FAST_LANE' ? 'Fast Lane' : ticketSelecionado.prioridade === 'VIP' ? 'VIP' : 'Normal'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1">Tempo Estimado</p>
                    <p className="text-sm text-white font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {ticketSelecionado.tempoEstimado || 0} minutos
                    </p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {ticketSelecionado.observacoes && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Observações
                  </h3>
                  <p className="text-sm text-purple-300">{ticketSelecionado.observacoes}</p>
                </div>
              )}

              {/* Informações de Chamadas */}
              {ticketSelecionado.contagemRechamada > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Status de Chamadas
                  </h3>
                  <p className="text-sm text-orange-300">
                    Cliente foi chamado <strong>{ticketSelecionado.contagemRechamada}x</strong>
                  </p>
                </div>
              )}

              {/* Histórico de Timestamps */}
              <div className="bg-gray-800/50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  Histórico
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Ticket Criado</p>
                      <p className="text-xs text-gray-400">{formatarDataHora(ticketSelecionado.criadoEm)}</p>
                    </div>
                  </div>
                  {ticketSelecionado.status === 'CHAMADO' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">Cliente Chamado</p>
                        <p className="text-xs text-gray-400">Aguardando confirmação</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-sm p-6 rounded-b-2xl border-t border-gray-700/50">
              <div className="flex gap-3">
                {ticketSelecionado.status === 'AGUARDANDO' && (
                  <>
                    <button
                      onClick={() => { chamarCliente(ticketSelecionado.id); fecharModal(); }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all font-semibold"
                    >
                      🔔 Chamar Cliente
                    </button>
                    <button
                      onClick={() => { abrirModalCancelar(ticketSelecionado.id); }}
                      className="px-4 py-3 bg-transparent hover:bg-red-500/10 text-red-400 border border-red-500/50 hover:border-red-500 rounded-xl transition-all font-semibold"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {ticketSelecionado.status === 'CHAMADO' && (
                  <>
                    <button
                      onClick={() => { finalizarAtendimento(ticketSelecionado.id); fecharModal(); }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all font-semibold"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={() => { rechamarCliente(ticketSelecionado.id); fecharModal(); }}
                      className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-all font-semibold"
                    >
                      🔁 Rechamar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {modalCancelarAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalCancelarAberto(false)}>
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Cancelar Ticket</h2>
                <p className="text-sm text-gray-400">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Motivo do cancelamento *
              </label>
              <textarea
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Ex: Cliente desistiu, problema no sistema..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setModalCancelarAberto(false); setMotivoCancelamento(''); setTicketParaCancelar(null); }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors font-medium border border-gray-700"
              >
                Voltar
              </button>
              <button
                onClick={cancelarTicket}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-red-500/25"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Cliente Presencial */}
      {modalAdicionarAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setModalAdicionarAberto(false)}>
          <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-800/50" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Adicionar Cliente</h2>
                <p className="text-sm text-gray-400">Adicionar cliente presencial na fila</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={novoCliente.nomeCliente}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nomeCliente: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantidade de Pessoas
                </label>
                <input
                  type="number"
                  min="1"
                  value={novoCliente.quantidadePessoas}
                  onChange={(e) => setNovoCliente({ ...novoCliente, quantidadePessoas: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Observações
                </label>
                <textarea
                  value={novoCliente.observacoes}
                  onChange={(e) => setNovoCliente({ ...novoCliente, observacoes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="2"
                  placeholder="Ex: Cadeira de bebê, mesa próxima à janela..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setModalAdicionarAberto(false); setNovoCliente({ nomeCliente: '', telefone: '', quantidadePessoas: 1, observacoes: '' }); }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors font-medium border border-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarClientePresencial}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:bg-white hover:from-white hover:to-white hover:text-gray-900 text-white rounded-xl transition-colors font-semibold shadow-lg shadow-orange-500/25"
              >
                Adicionar à Fila
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PainelOperador;
