import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, Phone, CheckCircle, CheckCircle2, XCircle, RefreshCw, SkipForward, AlertCircle, X, MessageSquare, Calendar, History, Tv } from 'lucide-react';
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

  // Obter slug do restaurante do localStorage
  const restauranteSlug = localStorage.getItem('restauranteSlug') || '';

  // Conectar WebSocket para atualizações em tempo real
  const { isConnected, error: wsError, on, off } = useWebSocket({ 
    restauranteSlug,
    autoConnect: !!restauranteSlug 
  });

  // Carregar fila inicial
  useEffect(() => {
    carregarFila();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escutar eventos WebSocket em tempo real
  useEffect(() => {
    if (!isConnected) {
      console.log('⚠️ WebSocket não conectado, listeners não registrados');
      return;
    }

    console.log('🎧 Registrando listeners WebSocket...');

    // Ticket criado
    const handleTicketCriado = (data) => {
      console.log('🎫 EVENTO RECEBIDO: ticket:criado', data);
      // Recarregar fila para pegar atualização
      carregarFila();
    };

    // Ticket atualizado (status/posição mudou)
    const handleTicketAtualizado = (data) => {
      console.log('📝 EVENTO RECEBIDO: ticket:atualizado', data);
      carregarFila();
    };

    // Ticket chamado
    const handleTicketChamado = (data) => {
      console.log('📢 EVENTO RECEBIDO: ticket:chamado', data);
      // Tocar som de notificação
      playNotificationSound();
      carregarFila();
    };

    // Mesa pronta (cliente confirmou presença)
    const handleMesaPronta = (data) => {
      console.log('🍽️ EVENTO RECEBIDO: ticket:mesa-pronta', data);
      // Tocar som de notificação
      playNotificationSound();
      carregarFila();
    };

    // Ticket finalizado
    const handleTicketFinalizado = (data) => {
      console.log('✅ EVENTO RECEBIDO: ticket:finalizado', data);
      carregarFila();
    };

    // Ticket cancelado
    const handleTicketCancelado = (data) => {
      console.log('❌ EVENTO RECEBIDO: ticket:cancelado', data);
      carregarFila();
    };

    // Fila atualizada (estatísticas)
    const handleFilaAtualizada = (data) => {
      console.log('📊 EVENTO RECEBIDO: fila:atualizada', data);
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
    
    console.log('✅ Listeners WebSocket registrados com sucesso');

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
      audio.play().catch(err => console.log('Não foi possível tocar som:', err));
    } catch (err) {
      console.log('Erro ao tocar som:', err);
    }
  };

  const carregarFila = async () => {
    setLoading(true);
    try {
      // Tentar obter filaId do localStorage
      let filaId = localStorage.getItem('filaAtivaId');
      
      // Se não tiver filaId, buscar do backend
      if (!filaId) {
        console.warn('⚠️ filaId não encontrado no localStorage. Buscando dados do restaurante...');
        try {
          const restauranteSlug = localStorage.getItem('restauranteSlug');
          if (!restauranteSlug) {
            console.error('❌ ERRO: restauranteSlug também não encontrado');
            setErro('Erro ao carregar dados do restaurante. Faça login novamente.');
            return;
          }
          
          // Buscar dados do restaurante para obter o filaId
          const responseRestaurante = await restauranteService.buscarMeuRestaurante();
          console.log('📦 Dados do restaurante:', responseRestaurante);
          
          // Backend retorna { restaurante: { filas: [...] } } ou diretamente { filas: [...] }
          const filas = responseRestaurante.restaurante?.filas || responseRestaurante.filas || [];
          
          if (filas.length > 0) {
            filaId = filas[0].id;
            localStorage.setItem('filaAtivaId', filaId);
            console.log('✅ FilaId obtido:', filaId);
          } else {
            console.error('❌ ERRO: Restaurante não possui filas');
            console.error('❌ Resposta completa:', responseRestaurante);
            setErro('⚠️ ERRO DE CONFIGURAÇÃO: O backend não retornou as filas do restaurante. Verifique se o endpoint GET /restaurantes/meu-restaurante está incluindo o relacionamento "filas" ou "Fila".');
            return;
          }
        } catch (error) {
          console.error('❌ Erro ao buscar dados do restaurante:', error);
          setErro('Erro ao carregar dados. Faça login novamente.');
          return;
        }
      }
      
      console.log('🔍 Carregando fila:', filaId);
      const response = await ticketService.listarFilaAtiva(filaId);
      console.log('📋 Tickets recebidos:', response.tickets);
      console.log('🔍 Primeiro ticket completo:', response.tickets?.[0]);
      console.log('👥 Quantidade pessoas:', response.tickets?.[0]?.quantidadePessoas);
      setFilaData(response.fila);
      setTickets(response.tickets || []);
      setEstatisticas(response.estatisticas);
      console.log('✅ Fila carregada:', response);
      console.log('📊 Total de tickets:', response.tickets?.length);
      console.log('📋 Status dos tickets:', response.tickets?.map(t => ({ numero: t.numero, status: t.status })));
      console.log('🔍 Primeiro ticket completo:', response.tickets?.[0]);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
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
      console.log('✅ Cliente chamado');
      await carregarFila();
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
    }
  };

  const rechamarCliente = async (ticketId) => {
    try {
      await ticketService.rechamarCliente(ticketId);
      console.log('✅ Cliente rechamado');
      await carregarFila();
    } catch (error) {
      console.error('Erro ao rechamar cliente:', error);
    }
  };

  const confirmarPresenca = async (ticketId) => {
    try {
      console.log('🔄 Confirmando presença do ticket:', ticketId);
      const response = await ticketService.confirmarPresenca(ticketId);
      console.log('✅ Resposta do backend:', response);
      console.log('📊 Status do ticket após confirmar:', response.ticket?.status);
      console.log('📦 Ticket completo:', JSON.stringify(response.ticket, null, 2));
      
      // Recarregar fila para mostrar atualização
      await carregarFila();
    } catch (error) {
      console.error('❌ Erro ao confirmar presença:', error);
      const mensagem = error.response?.data?.mensagem || error.response?.data?.erro || 'Erro ao confirmar presença';
      alert(`Erro: ${mensagem}`);
    }
  };

  const finalizarAtendimento = async (ticketId) => {
    try {
      console.log('🔄 Finalizando atendimento do ticket:', ticketId);
      const response = await ticketService.finalizarAtendimento(ticketId);
      console.log('✅ Atendimento finalizado:', response);
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
    } catch (error) {
      console.error('❌ Erro ao finalizar atendimento:', error);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Dados:', error.response?.data);
      const mensagem = error.response?.data?.mensagem || error.response?.data?.erro || 'Erro ao finalizar atendimento';
      alert(`Erro: ${mensagem}`);
    }
  };

  const pularVez = async (ticketId) => {
    try {
      await ticketService.pularCliente(ticketId);
      console.log('✅ Vez pulada');
      await carregarFila();
    } catch (error) {
      console.error('Erro ao pular vez:', error);
    }
  };

  const marcarNoShow = async (ticketId) => {
    if (!window.confirm('Confirmar que o cliente não apareceu?')) return;
    
    try {
      await ticketService.marcarNoShow(ticketId);
      console.log('✅ No-show registrado');
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
    } catch (error) {
      console.error('Erro ao marcar no-show:', error);
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
      console.log('✅ Ticket cancelado');
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
      setModalCancelarAberto(false);
      setMotivoCancelamento('');
      setTicketParaCancelar(null);
    } catch (error) {
      console.error('Erro ao cancelar ticket:', error);
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
        console.error('❌ ERRO: filaId não encontrado');
        return;
      }
      
      await ticketService.criarTicketLocal(filaId, {
        nomeCliente: novoCliente.nomeCliente,
        telefone: novoCliente.telefone,
        quantidadePessoas: novoCliente.quantidadePessoas,
        observacoes: novoCliente.observacoes
      });
      
      console.log('✅ Cliente presencial adicionado');
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
      console.error('Erro ao adicionar cliente:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Simplificado */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleVoltar}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Fila ao Vivo</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-gray-500">Gerencie os clientes em tempo real</p>
                  <WebSocketStatus isConnected={isConnected} error={wsError} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/publico/painel')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
                title="Painel Público (TV)"
              >
                <Tv className="w-4 h-4" />
                Painel TV
              </button>
              <button
                onClick={() => navigate('/restaurante/historico-tickets')}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <History className="w-4 h-4" />
                Histórico
              </button>
              <button
                onClick={() => setModalAdicionarAberto(true)}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Cliente Local +
              </button>
              <button
                onClick={atualizarFila}
                disabled={atualizando}
                className="flex items-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
              >
                <RefreshCw className={`w-4 h-4 ${atualizando ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Aguardando</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.totalAguardando || 0}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Chamados</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas?.totalChamados || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Total na Fila</p>
                <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista da Fila */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">Clientes Aguardando</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-3 text-sm text-gray-600">Carregando fila...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Nenhum cliente na fila no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-6">
                    <div 
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => abrirDetalhes(ticket)}
                    >
                      {/* Posição - Design mais compacto */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                          <span className="text-3xl font-bold text-white">{ticket.posicao}º</span>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-base font-bold text-gray-900 truncate hover:text-orange-600 transition-colors">
                            {ticket.nomeCliente}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                            ticket.prioridade === 'FAST_LANE' 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : ticket.prioridade === 'VIP'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {ticket.prioridade === 'FAST_LANE' ? '⚡ AGUARDANDO' : ticket.prioridade}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {formatarTelefone(ticket.telefoneCliente) || 'Sem telefone'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {ticket.quantidadePessoas || 1} pessoa{(ticket.quantidadePessoas || 1) > 1 ? 's' : ''}
                          </span>
                          <span className={`flex items-center gap-1 font-medium ${
                            ticket.status === 'CHAMADO' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            <Clock className="w-3.5 h-3.5" />
                            {ticket.status === 'CHAMADO' ? 'Aguardando' : 'Aguardando'} {formatarTempoEspera(ticket.criadoEm)}
                          </span>
                          {ticket.contagemRechamada > 0 && (
                            <span className="flex items-center gap-1 text-yellow-700 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {ticket.contagemRechamada}x
                            </span>
                          )}
                        </div>

                        {ticket.observacoes && (
                          <div className="mt-2 text-xs text-gray-600 italic">
                            💬 {ticket.observacoes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações - Botões com cores mais suaves */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === 'AGUARDANDO' && (
                        <>
                          <button
                            onClick={() => chamarCliente(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all text-sm font-medium whitespace-nowrap shadow-sm"
                          >
                            🔔 Chamar Cliente
                          </button>
                          <button
                            onClick={() => abrirModalCancelar(ticket.id)}
                            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all text-sm font-medium shadow-sm"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'CHAMADO' && (
                        <>
                          <button
                            onClick={() => confirmarPresenca(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all text-sm font-medium whitespace-nowrap shadow-sm"
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={() => rechamarCliente(ticket.id)}
                            className="px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                          >
                            Rechamar
                          </button>
                          <button
                            onClick={() => pularVez(ticket.id)}
                            className="px-3 py-2 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm"
                          >
                            Pular
                          </button>
                          <button
                            onClick={() => marcarNoShow(ticket.id)}
                            className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all text-sm font-medium shadow-sm"
                          >
                            No-Show
                          </button>
                        </>
                      )}

                      {ticket.status === 'MESA_PRONTA' && (
                        <>
                          <button
                            onClick={() => finalizarAtendimento(ticket.id)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium whitespace-nowrap shadow-sm"
                          >
                            Finalizar
                          </button>
                          <button
                            onClick={() => abrirModalCancelar(ticket.id)}
                            className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg transition-all text-sm font-medium shadow-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={fecharModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="sticky top-0 bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{ticketSelecionado.nomeCliente}</h2>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-full text-sm font-medium">
                      Ticket {ticketSelecionado.numero}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticketSelecionado.status === 'CHAMADO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ticketSelecionado.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={fecharModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6 space-y-6">
              {/* Informações Principais */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs text-orange-600 font-medium mb-1">Posição na Fila</p>
                  <p className="text-3xl font-bold text-orange-600">{ticketSelecionado.posicao}º</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-medium mb-1">Tempo de Espera</p>
                  <p className="text-3xl font-bold text-blue-600">{formatarTempoEspera(ticketSelecionado.criadoEm)}</p>
                </div>
              </div>

              {/* Detalhes do Cliente */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Telefone</p>
                    <p className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {formatarTelefone(ticketSelecionado.telefoneCliente)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Quantidade de Pessoas</p>
                    <p className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      {ticketSelecionado.quantidadePessoas} pessoa{ticketSelecionado.quantidadePessoas > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Prioridade</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      ticketSelecionado.prioridade === 'FAST_LANE' 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                        : ticketSelecionado.prioridade === 'VIP'
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {ticketSelecionado.prioridade === 'FAST_LANE' ? 'Fast Lane' : ticketSelecionado.prioridade === 'VIP' ? 'VIP' : 'Normal'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium mb-1">Tempo Estimado</p>
                    <p className="text-sm text-gray-900 font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {ticketSelecionado.tempoEstimado || 0} minutos
                    </p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {ticketSelecionado.observacoes && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Observações
                  </h3>
                  <p className="text-sm text-blue-800">{ticketSelecionado.observacoes}</p>
                </div>
              )}

              {/* Informações de Chamadas */}
              {ticketSelecionado.contagemRechamada > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Status de Chamadas
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Cliente foi chamado <strong>{ticketSelecionado.contagemRechamada}x</strong>
                  </p>
                </div>
              )}

              {/* Histórico de Timestamps */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Histórico
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ticket Criado</p>
                      <p className="text-xs text-gray-600">{formatarDataHora(ticketSelecionado.criadoEm)}</p>
                    </div>
                  </div>
                  {ticketSelecionado.status === 'CHAMADO' && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Cliente Chamado</p>
                        <p className="text-xs text-gray-600">Aguardando confirmação</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer com Ações */}
            <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t border-gray-200">
              <div className="flex gap-3">
                {ticketSelecionado.status === 'AGUARDANDO' && (
                  <>
                    <button
                      onClick={() => { chamarCliente(ticketSelecionado.id); fecharModal(); }}
                      className="flex-1 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all hover:shadow-lg font-semibold"
                    >
                      🔔 Chamar Cliente
                    </button>
                    <button
                      onClick={() => { abrirModalCancelar(ticketSelecionado.id); }}
                      className="px-4 py-3 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-lg transition-all font-semibold"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {ticketSelecionado.status === 'CHAMADO' && (
                  <>
                    <button
                      onClick={() => { finalizarAtendimento(ticketSelecionado.id); fecharModal(); }}
                      className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all hover:shadow-lg font-semibold"
                    >
                      Finalizar
                    </button>
                    <button
                      onClick={() => { rechamarCliente(ticketSelecionado.id); fecharModal(); }}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg font-semibold"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setModalCancelarAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cancelar Ticket</h2>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo do cancelamento *
              </label>
              <textarea
                value={motivoCancelamento}
                onChange={(e) => setMotivoCancelamento(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="3"
                placeholder="Ex: Cliente desistiu, problema no sistema..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setModalCancelarAberto(false); setMotivoCancelamento(''); setTicketParaCancelar(null); }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Voltar
              </button>
              <button
                onClick={cancelarTicket}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar Cliente Presencial */}
      {modalAdicionarAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setModalAdicionarAberto(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Adicionar Cliente</h2>
                <p className="text-sm text-gray-600">Adicionar cliente presencial na fila</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={novoCliente.nomeCliente}
                  onChange={(e) => setNovoCliente({ ...novoCliente, nomeCliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={novoCliente.telefone}
                  onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="(11) 98765-4321"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Pessoas
                </label>
                <input
                  type="number"
                  min="1"
                  value={novoCliente.quantidadePessoas}
                  onChange={(e) => setNovoCliente({ ...novoCliente, quantidadePessoas: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={novoCliente.observacoes}
                  onChange={(e) => setNovoCliente({ ...novoCliente, observacoes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="2"
                  placeholder="Ex: Cadeira de bebê, mesa próxima à janela..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setModalAdicionarAberto(false); setNovoCliente({ nomeCliente: '', telefone: '', quantidadePessoas: 1, observacoes: '' }); }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarClientePresencial}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
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
