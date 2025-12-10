import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, AlertCircle, User, LogOut, History, CheckCircle, XCircle, UserX, Bell, X, ChefHat, Ticket, RefreshCw, Sparkles } from 'lucide-react';
import api, { clienteService, publicoService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

export default function AcompanharFila() {
  const [abaAtiva, setAbaAtiva] = useState('fila'); // 'fila' ou 'historico'
  const [ticket, setTicket] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [loadingHistorico, setLoadingHistorico] = useState(false);
  const [erro, setErro] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [loadingCancelar, setLoadingCancelar] = useState(false);
  const [alertaRechamada, setAlertaRechamada] = useState(false);
  const [contagemRechamada, setContagemRechamada] = useState(0);
  const alertaTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Obter slug do restaurante do ticket ativo
  const restauranteSlug = ticket?.restaurante?.slug || '';

  // Conectar WebSocket para atualizações em tempo real
  const { isConnected, on, off } = useWebSocket({ 
    restauranteSlug,
    autoConnect: !!restauranteSlug 
  });

  useEffect(() => {
    if (abaAtiva === 'fila') {
      carregarTicket();
    } else if (abaAtiva === 'historico') {
      carregarHistorico();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abaAtiva]);

  // Escutar eventos WebSocket do MEU ticket
  useEffect(() => {
    if (!isConnected || !ticket?.id) return;

    logger.log('🎧 Escutando atualizações do ticket:', ticket.id);

    // Ticket atualizado
    const handleTicketAtualizado = (data) => {
      // Verificar se é o meu ticket
      if (data.id === ticket.id) {
        logger.log('📝 Meu ticket atualizado:', data);
        carregarTicket(); // Recarregar dados atualizados
      }
    };

    // Ticket chamado
    const handleTicketChamado = (data) => {
      logger.log('📢 EVENTO WebSocket ticket:chamado recebido:', data);
      
      if (data.id === ticket.id) {
        // Verificar se é rechamada pelo campo contagemRechamada ou se já estava CHAMADO
        const contagemDoEvento = data.contagemRechamada || 0;
        const isRechamada = contagemDoEvento > 0 || ticket?.status === 'CHAMADO';
        

        
        // Atualizar contagem de rechamadas
        setContagemRechamada(contagemDoEvento);
        
        // Título e mensagem diferentes para rechamada
        const titulo = isRechamada 
          ? `⚠️ ATENÇÃO! Chamada ${contagemDoEvento + 1}x` 
          : 'Seu ticket foi chamado!';
        const mensagem = isRechamada 
          ? `URGENTE: Ticket ${data.numeroTicket} - Compareça IMEDIATAMENTE!`
          : `Ticket ${data.numeroTicket} - Dirija-se ao atendimento`;
        
        // Exibir notificação
        if (Notification.permission === 'granted') {
          new Notification(titulo, {
            body: mensagem,
            icon: '/logo.png',
            requireInteraction: isRechamada,
            tag: 'ticket-chamado'
          });
        }
        
        
        // Ativar alerta visual de rechamada
        if (isRechamada) {
          logger.log('🚨 Ativando alerta de rechamada!');
          setAlertaRechamada(true);
          if (alertaTimeoutRef.current) {
            clearTimeout(alertaTimeoutRef.current);
          }
          alertaTimeoutRef.current = setTimeout(() => {
            setAlertaRechamada(false);
          }, 30000);
          
          if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 500]);
          }
        }
        
        carregarTicket();
      }
    };

    // Mesa pronta (quando operador confirma presença)
    const handleMesaPronta = (data) => {
      logger.log('🍽️ EVENTO WebSocket recebido: ticket:mesa-pronta', data);
      logger.log('🔍 Meu ticket ID:', ticket.id);
      logger.log('🔍 Ticket ID do evento:', data.id || data.ticketId);
      
      if (data.id === ticket.id || data.ticketId === ticket.id) {
        logger.log('✅ É o meu ticket! Atualizando...');
        // Exibir notificação
        if (Notification.permission === 'granted') {
          new Notification('Sua mesa está pronta!', {
            body: `Dirija-se ao balcão`,
            icon: '/logo.png'
          });
        }
        // Tocar som
        try {
          const audio = new Audio('/notification.mp3');
          audio.play().catch(err => logger.log('Não foi possível tocar som:', err));
        } catch (err) {
          logger.log('Erro ao tocar som:', err);
        }
        carregarTicket();
      } else {
        logger.log('⚠️ Não é o meu ticket, ignorando');
      }
    };

    on('ticket:atualizado', handleTicketAtualizado);
    on('ticket:chamado', handleTicketChamado);
    on('ticket:mesa-pronta', handleMesaPronta);

    return () => {
      off('ticket:atualizado', handleTicketAtualizado);
      off('ticket:chamado', handleTicketChamado);
      off('ticket:mesa-pronta', handleMesaPronta);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, ticket?.id, on, off]);

  const carregarHistorico = async () => {
    try {
      setLoadingHistorico(true);
      logger.log('ℹ️ Carregando histórico de tickets...');
      
      const response = await clienteService.buscarMeuTicket();
      
      // O endpoint /cliente/meu-ticket retorna { tickets: [...] }
      const todosTickets = response.tickets || [];
      
      // Filtrar apenas tickets finalizados/cancelados/no-show para o histórico
      const ticketsHistorico = todosTickets.filter(t => 
        ['FINALIZADO', 'CANCELADO', 'NO_SHOW'].includes(t.status)
      );
      
      setHistorico(ticketsHistorico);
      logger.log('✅ Histórico carregado:', ticketsHistorico.length, 'tickets');
    } catch (error) {
      logger.error('❌ Erro ao carregar histórico:', error);
      setHistorico([]);
    } finally {
      setLoadingHistorico(false);
    }
  };

  const carregarTicket = async () => {
    try {
      // Buscar ticket ativo da API
      logger.log('🔍 Buscando ticket do cliente autenticado...');
      
      const response = await clienteService.buscarMeuTicket();
      
      logger.log('✅ Ticket carregado - Response completa:', JSON.stringify(response, null, 2));
      logger.log('📦 Estrutura do response:', {
        isArray: Array.isArray(response),
        temTicket: !!response.ticket,
        temTickets: !!response.tickets,
        keys: Array.isArray(response) ? 'É array' : Object.keys(response)
      });
      
      // O backend pode retornar {ticket: {...}} OU um array [{...}, {...}]
      let ticketEncontrado = null;
      
      if (response.ticket) {
        // Formato: {ticket: {...}}
        ticketEncontrado = response.ticket;
      } else if (Array.isArray(response)) {
        // Formato: [{...}, {...}, ...]
        ticketEncontrado = response.find(t => 
          ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
        );
        logger.log('🔍 Array recebido, ticket ativo:', ticketEncontrado);
      } else if (response.tickets && Array.isArray(response.tickets)) {
        // Formato: {tickets: [{...}, {...}]}
        ticketEncontrado = response.tickets.find(t => 
          ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
        );
      } else {
        // Formato antigo: response é o próprio ticket
        ticketEncontrado = response;
      }
      
      if (!ticketEncontrado) {
        throw new Error('Nenhum ticket ativo encontrado');
      }
      
      logger.log('🎯 Campos críticos do ticket:', {
        posicao: ticketEncontrado.posicao,
        tempoEstimado: ticketEncontrado.tempoEstimado,
        tempoEstimadoMinutos: ticketEncontrado.tempoEstimadoMinutos,
        numeroTicket: ticketEncontrado.numeroTicket,
        fila: ticketEncontrado.fila,
        restaurante: ticketEncontrado.restaurante || ticketEncontrado.fila?.restaurante
      });
      
      // Se o restaurante existe mas não tem endereço, busca os detalhes completos usando o slug
      const restauranteSlugAtual = ticketEncontrado?.restaurante?.slug || ticketEncontrado?.fila?.restaurante?.slug;
      if (restauranteSlugAtual && !ticketEncontrado.restaurante?.endereco) {
        try {
          const restauranteData = await publicoService.buscarRestaurantePorSlug(restauranteSlugAtual);
          if (restauranteData?.restaurante) {
            ticketEncontrado.restaurante = {
              ...ticketEncontrado.restaurante,
              ...restauranteData.restaurante
            };
          }
        } catch (error) {
          logger.error('Erro ao buscar detalhes do restaurante:', error);
        }
      }
      
      setTicket(ticketEncontrado);
      setErro('');
    } catch (error) {
      logger.error('❌ Erro ao buscar ticket:', error);
      logger.error('📄 Response error:', error.response?.data);
      setErro('Você não possui tickets ativos no momento.');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirModalCancelar = () => {
    setModalCancelarAberto(true);
  };

  const handleFecharModalCancelar = () => {
    setModalCancelarAberto(false);
  };

  const handleConfirmarCancelamento = async () => {
    setLoadingCancelar(true);
    setErro('');

    try {
      await clienteService.cancelarTicket(ticket.id);
      logger.log('✅ Ticket cancelado');
      setModalCancelarAberto(false);
      navigate('/cliente/restaurantes');
    } catch (error) {
      logger.error('Erro ao cancelar ticket:', error);
      setErro('Erro ao cancelar ticket. Tente novamente.');
      setLoadingCancelar(false);
    }
  };

  const handleAtualizarStatus = async () => {
    setLoading(true);
    await carregarTicket();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cliente');
    navigate('/cliente/login');
  };

  const handlePerfil = () => {
    setMenuAberto(false);
    navigate('/cliente/perfil');
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatarHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const calcularTempoTotal = (inicio, fim) => {
    const diffMs = new Date(fim) - new Date(inicio);
    const minutos = Math.floor(diffMs / 60000);
    return minutos;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MESA_PRONTA':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
          🍽️ Mesa Pronta
        </span>;
      case 'FINALIZADO':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <CheckCircle size={12} /> Finalizado
        </span>;
      case 'CANCELADO':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
          <XCircle size={12} /> Cancelado
        </span>;
      case 'NO_SHOW':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
          <UserX size={12} /> Não Compareceu
        </span>;
      default:
        return null;
    }
  };

  const historicoFiltrado = historico.filter(t => 
    filtroStatus === 'TODOS' || t.status === filtroStatus
  );

  if (loading && !ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'AGUARDANDO':
        return { texto: 'Próximo na Fila', cor: 'text-orange-600', bgCor: 'bg-orange-50', completed: false };
      case 'CHAMADO':
        return { texto: 'Chamado', cor: 'text-blue-600', bgCor: 'bg-blue-50', completed: true };
      case 'MESA_PRONTA':
        return { texto: 'Mesa Pronta', cor: 'text-green-600', bgCor: 'bg-green-50', completed: true };
      case 'ATENDENDO':
        return { texto: 'Atendendo', cor: 'text-purple-600', bgCor: 'bg-purple-50', completed: true };
      default:
        return { texto: 'Na Fila', cor: 'text-gray-600', bgCor: 'bg-gray-50', completed: true };
    }
  };

  const statusProximoNaFila = getStatusInfo('AGUARDANDO');
  const isChamado = ticket?.status === 'CHAMADO';
  const isMesaPronta = ticket?.status === 'MESA_PRONTA';
  const isAtendendo = ticket?.status === 'ATENDENDO';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Voltar</span>
          </button>
          
          <h1 className="text-base font-bold text-white absolute left-1/2 transform -translate-x-1/2">
            {abaAtiva === 'fila' ? ticket?.restaurante?.nome : 'Meu Histórico'}
          </h1>
          
          {/* Menu de Perfil */}
          <div className="relative z-50">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2.5 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-gray-700/50"
              title="Menu"
            >
              <User size={20} />
            </button>

            {/* Dropdown Menu */}
            {menuAberto && (
              <>
                {/* Overlay para fechar ao clicar fora */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setMenuAberto(false)}
                ></div>
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-52 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 z-50">
                  <button
                    onClick={handlePerfil}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white flex items-center gap-3 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                    Ver Perfil
                  </button>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <LogOut size={16} className="text-red-400" />
                    </div>
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-900/60 backdrop-blur-xl border-b border-gray-800/50 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setAbaAtiva('fila')}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
                abaAtiva === 'fila'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <Clock size={16} />
              Fila Atual
            </button>
            <button
              onClick={() => setAbaAtiva('historico')}
              className={`py-4 px-1 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
                abaAtiva === 'historico'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <History size={16} />
              Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Ticket Chamado */}
      {ticket?.status === 'CHAMADO' && (
        <div className="bg-blue-500/20 border-b border-blue-500/30 p-4 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center animate-pulse">
              <Bell className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-blue-300">Você foi chamado!</p>
              <p className="text-sm text-blue-400/80">Dirija-se ao balcão de atendimento.</p>
            </div>
          </div>
        </div>
      )}

      {/* Banner de Confirmado */}
      {ticket?.status === 'MESA_PRONTA' && (
        <div className="bg-green-500/20 border-b border-green-500/30 p-4 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="font-semibold text-green-300">Confirmado!</p>
              <p className="text-sm text-green-400/80">Aguarde, você será atendido em instantes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba Fila */}
      {abaAtiva === 'fila' && (
        <main className="relative max-w-3xl mx-auto px-6 py-5 space-y-4">
          {/* Cartão de Posição */}
        <div className="bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-orange-500/5 rounded-2xl p-6 text-center border border-orange-500/30 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl"></div>
          
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-medium">Sua Posição na Fila</p>
          <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-2">
            {ticket?.posicao}º
          </div>
          <div className="flex items-center justify-center gap-2 text-orange-400/80">
            <Clock size={16} />
            <span className="text-sm font-medium">
              Tempo estimado: {ticket?.tempoEstimadoMinutos || ticket?.tempoEstimado || 15} min
            </span>
          </div>
        </div>

        {/* Detalhes do Ticket */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Ticket size={16} className="text-orange-400" />
            Detalhes do Ticket
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Número do Ticket</span>
              <span className="text-sm font-semibold text-white bg-gray-800/50 px-3 py-1 rounded-lg">{ticket?.numeroTicket}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Tipo de Fila</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                ticket?.prioridade === 'FAST_LANE' 
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/30' 
                  : 'bg-gray-800/50 text-gray-300'
              }`}>
                {ticket?.prioridade === 'FAST_LANE'}
                {ticket?.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Tamanho do Grupo</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white bg-gray-800/50 px-3 py-1 rounded-lg">
                <Users size={14} className="text-orange-400" />
                {ticket?.quantidadePessoas ?? 1} {ticket?.quantidadePessoas === 1 ? 'pessoa' : 'pessoas'}
              </div>
            </div>

            {ticket?.observacoes && (
              <div className="pt-3 border-t border-gray-800/50">
                <span className="text-sm text-gray-400">Observações</span>
                <p className="text-sm text-gray-300 mt-2 bg-gray-800/30 p-3 rounded-lg">{ticket.observacoes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status do Atendimento */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/50">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-orange-400" />
            Status do Atendimento
          </h2>
          
          <div className="space-y-4">
            {/* Ticket Confirmado - Sempre completo */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mt-0.5 shadow-lg shadow-orange-500/25">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Ticket Confirmado</p>
                {ticket?.createdAt && (
                  <p className="text-xs text-gray-500">{formatarHora(ticket.createdAt)}</p>
                )}
              </div>
            </div>

            {/* Na Fila - Sempre completo quando ticket existe */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mt-0.5 shadow-lg shadow-orange-500/25">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Na Fila</p>
                <p className="text-xs text-gray-500">Aguardando ser chamado</p>
              </div>
            </div>

            {/* Chamado - Completo se status for CHAMADO, MESA_PRONTA ou FINALIZADO */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                ['CHAMADO', 'MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status)
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 border-blue-500 shadow-lg shadow-blue-500/25'
                  : 'border-gray-700 bg-gray-800/30'
              }`}>
                {['CHAMADO', 'MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  ['CHAMADO', 'MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status)
                    ? 'text-blue-400'
                    : 'text-gray-600'
                }`}>
                  Chamado
                </p>
                {ticket?.status === 'CHAMADO' && (
                  <p className="text-xs text-blue-400/80 font-medium">Por favor, dirija-se ao restaurante!</p>
                )}
              </div>
            </div>

            {/* Confirmado - Novo status entre CHAMADO e FINALIZADO */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                ['MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status)
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500 shadow-lg shadow-green-500/25'
                  : 'border-gray-700 bg-gray-800/30'
              }`}>
                {['MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  ['MESA_PRONTA', 'FINALIZADO'].includes(ticket?.status)
                    ? 'text-green-400'
                    : 'text-gray-600'
                }`}>
                  Confirmado
                </p>
                {ticket?.status === 'MESA_PRONTA' && (
                  <p className="text-xs text-green-400/80 font-medium">Presença confirmada! Aguarde ser atendido.</p>
                )}
              </div>
            </div>

            {/* Finalizado */}
            <div className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-300 ${
                ticket?.status === 'FINALIZADO'
                  ? 'bg-gradient-to-br from-purple-500 to-violet-500 border-purple-500 shadow-lg shadow-purple-500/25'
                  : 'border-gray-700 bg-gray-800/30'
              }`}>
                {ticket?.status === 'FINALIZADO' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  ticket?.status === 'FINALIZADO'
                    ? 'text-purple-400'
                    : 'text-gray-600'
                }`}>
                  Atendimento Finalizado
                </p>
                {ticket?.status === 'FINALIZADO' && (
                  <p className="text-xs text-purple-400/80 font-medium">Obrigado pela visita!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Boas-Vindas do Restaurante */}
        {ticket?.restaurante?.mensagemBoasVindas && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3 backdrop-blur-sm">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-300 mb-1">Mensagem do Restaurante</p>
              <p className="text-sm text-blue-400/80">
                {ticket.restaurante.mensagemBoasVindas}
              </p>
            </div>
          </div>
        )}
        {/* Botões */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleAtualizarStatus}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-700 text-gray-400 hover:bg-gray-800/80 hover:text-white hover:border-gray-600 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Atualizando...' : 'Atualizar Status'}
          </button>
          
          <button
            onClick={handleAbrirModalCancelar}
            className="w-full py-3 px-4 border border-gray-700 hover:border-red-500 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Cancelar Ticket
          </button>
        </div>
        </main>
      )}

      {/* Conteúdo da Aba Histórico */}
      {abaAtiva === 'historico' && (
        <main className="relative max-w-3xl mx-auto px-6 py-5">
          {/* Filtros */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-gray-800/50">
            <label className="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Filtrar por status</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroStatus('TODOS')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filtroStatus === 'TODOS'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroStatus('FINALIZADO')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filtroStatus === 'FINALIZADO'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                Finalizados
              </button>
              <button
                onClick={() => setFiltroStatus('CANCELADO')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filtroStatus === 'CANCELADO'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                Cancelados
              </button>
              <button
                onClick={() => setFiltroStatus('NO_SHOW')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filtroStatus === 'NO_SHOW'
                    ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                Não Compareceu
              </button>
            </div>
          </div>

          {/* Lista de Histórico */}
          {loadingHistorico ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-800/50">
              <div className="w-10 h-10 relative mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400">Carregando histórico...</p>
            </div>
          ) : historicoFiltrado.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-800/50">
              <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <History className="text-gray-600" size={32} />
              </div>
              <p className="text-sm text-white font-medium">Nenhum ticket no histórico</p>
              <p className="text-xs text-gray-500 mt-1">
                {filtroStatus !== 'TODOS' ? 'Tente alterar o filtro' : 'Seus tickets anteriores aparecerão aqui'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {historicoFiltrado.map((ticket) => (
                <div key={ticket.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white">{ticket.restaurante?.nome || 'Restaurante'}</h3>
                      {ticket.restaurante?.endereco && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                          <MapPin size={12} />
                          <span>{ticket.restaurante.endereco}</span>
                        </div>
                      )}
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-800/30 rounded-lg p-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Ticket</span>
                      <p className="text-xs font-semibold text-white">{ticket.numeroTicket}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Prioridade</span>
                      <p className="text-xs font-medium text-gray-300">
                        {ticket.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
                      </p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Pessoas</span>
                      <p className="text-xs font-medium text-gray-300">{ticket.quantidadePessoas || '-'}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-2">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Data</span>
                      <p className="text-xs font-medium text-gray-300">{formatarData(ticket.createdAt)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-800/50 flex items-center justify-between text-[10px] text-gray-500">
                    <div className="flex items-center gap-4 flex-wrap">
                      <span>
                        Entrada: {formatarHora(ticket.createdAt)}
                      </span>
                      {ticket.finalizadoEm && (
                        <>
                          <span>•</span>
                          <span>
                            Saída: {formatarHora(ticket.finalizadoEm)}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-orange-400">
                            Duração: {calcularTempoTotal(ticket.createdAt, ticket.finalizadoEm)} min
                          </span>
                        </>
                      )}
                      {ticket.canceladoEm && (
                        <>
                          <span>•</span>
                          <span>
                            Cancelado: {formatarHora(ticket.canceladoEm)}
                          </span>
                        </>
                      )}
                      {ticket.noShowEm && (
                        <>
                          <span>•</span>
                          <span>
                            No-show: {formatarHora(ticket.noShowEm)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {ticket.motivoCancelamento && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-[10px] font-semibold text-red-400 uppercase tracking-wider">Motivo do cancelamento:</p>
                      <p className="text-xs text-red-400/80 mt-1">{ticket.motivoCancelamento}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {modalCancelarAberto && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md"
          onClick={handleFecharModalCancelar}
        >
          <div 
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-6 pb-4">
              <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Cancelar Ticket?
              </h2>
              <p className="text-sm text-gray-400 text-center">
                Tem certeza que deseja cancelar seu ticket? Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="px-6 pb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{erro}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleFecharModalCancelar}
                disabled={loadingCancelar}
                className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
              >
                Não, manter ticket
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                disabled={loadingCancelar}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
              >
                {loadingCancelar ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Cancelando...
                  </span>
                ) : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
