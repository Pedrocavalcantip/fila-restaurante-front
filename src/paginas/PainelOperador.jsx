import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, Phone, CheckCircle2, XCircle, RefreshCw, SkipForward, AlertCircle, X, MessageSquare, Calendar, History, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ticketService, restauranteService } from '../services/api';

function PainelOperador() {
  const navigate = useNavigate();
  const [filaData, setFilaData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
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

  // Carregar fila a cada 5 segundos (polling - substituir por WebSocket)
  useEffect(() => {
    carregarFila();
    // Comentado polling para não sobrescrever alterações locais durante testes
    // TODO: Reativar quando integrar com backend real via WebSocket
    // const interval = setInterval(carregarFila, 5000);
    // return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          
          if (responseRestaurante.restaurante?.filas?.[0]?.id) {
            filaId = responseRestaurante.restaurante.filas[0].id;
            localStorage.setItem('filaAtivaId', filaId);
            console.log('✅ FilaId obtido do restaurante:', filaId);
          } else {
            console.error('❌ ERRO: Restaurante não possui filas');
            setErro('Restaurante sem filas cadastradas. Entre em contato com o suporte.');
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
      setFilaData(response.fila);
      setTickets(response.tickets || []);
      setEstatisticas(response.estatisticas);
      console.log('✅ Fila carregada:', response);
      console.log('📋 Primeiro ticket (estrutura):', response.tickets?.[0] ? Object.keys(response.tickets[0]) : 'Nenhum ticket');
      console.log('🔍 Campos de data:', {
        createdAt: response.tickets?.[0]?.createdAt,
        updatedAt: response.tickets?.[0]?.updatedAt
      });
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

  const finalizarAtendimento = async (ticketId) => {
    try {
      await ticketService.finalizarAtendimento(ticketId);
      console.log('✅ Atendimento finalizado');
      await carregarFila();
      setModalAberto(false);
      setTicketSelecionado(null);
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
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

  const formatarTempoEspera = (createdAt) => {
    const minutos = Math.floor((Date.now() - new Date(createdAt)) / 60000);
    return `${minutos} min`;
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleVoltar}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fila ao Vivo</h1>
                <p className="text-sm text-gray-600">Gerencie os clientes em tempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/publico/painel')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                title="Painel Público (TV)"
              >
                <Tv className="w-4 h-4" />
                Painel TV
              </button>
              <button
                onClick={() => navigate('/restaurante/historico-tickets')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                Histórico
              </button>
              <button
                onClick={() => setModalAdicionarAberto(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Users className="w-4 h-4" />
                Adicionar Cliente
              </button>
              <button
                onClick={atualizarFila}
                disabled={atualizando}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${atualizando ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aguardando</p>
                <p className="text-3xl font-bold text-gray-900">{estatisticas?.totalAguardando || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chamados</p>
                <p className="text-3xl font-bold text-gray-900">{estatisticas?.totalChamados || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total na Fila</p>
                <p className="text-3xl font-bold text-gray-900">{tickets.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista da Fila */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Clientes Aguardando</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Carregando fila...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum cliente na fila no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-6">
                    <div 
                      className="flex items-start gap-4 flex-1 cursor-pointer"
                      onClick={() => abrirDetalhes(ticket)}
                    >
                      {/* Número e Posição */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex flex-col items-center justify-center shadow-md">
                          <span className="text-xs text-white font-medium opacity-90">{ticket.numero}</span>
                          <span className="text-3xl font-bold text-white">{ticket.posicao}º</span>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 
                            className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                            title="Ver detalhes"
                          >
                            {ticket.nomeCliente}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.prioridade === 'FAST_LANE' 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                              : ticket.prioridade === 'VIP'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}>
                            {ticket.prioridade === 'FAST_LANE' ? 'Fast Lane' : ticket.prioridade === 'VIP' ? 'VIP' : 'Normal'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === 'CHAMADO'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-gray-100 text-gray-800 border border-gray-300'
                          }`}>
                            {ticket.status === 'CHAMADO' ? 'CHAMADO' : 'AGUARDANDO'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-3">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{formatarTelefone(ticket.telefone)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span>{ticket.quantidadePessoas} pessoa{ticket.quantidadePessoas > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            {ticket.status === 'CHAMADO' ? (
                              <span className="font-semibold text-green-600">
                                Chamado há {formatarTempoEspera(ticket.createdAt)}
                              </span>
                            ) : (
                              <span className="font-semibold text-orange-600">
                                Aguardando {formatarTempoEspera(ticket.createdAt)}
                              </span>
                            )}
                          </div>
                          {ticket.chamadasCount > 0 && (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <span className="font-medium text-yellow-700">Chamado {ticket.chamadasCount}x</span>
                            </div>
                          )}
                        </div>

                        {ticket.observacoes && (
                          <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="text-blue-600 text-sm">💬</span>
                            <span className="text-sm text-blue-800 font-medium">{ticket.observacoes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex flex-col gap-2 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === 'AGUARDANDO' && (
                        <>
                          <button
                            onClick={() => chamarCliente(ticket.id)}
                            className="w-full px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            🔔 Chamar Cliente
                          </button>
                          <button
                            onClick={() => abrirModalCancelar(ticket.id)}
                            className="w-full px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        </>
                      )}
                      
                      {ticket.status === 'CHAMADO' && (
                        <>
                          <button
                            onClick={() => finalizarAtendimento(ticket.id)}
                            className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Finalizar
                          </button>
                          <button
                            onClick={() => rechamarCliente(ticket.id)}
                            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            🔁 Rechamar
                          </button>
                          <button
                            onClick={() => pularVez(ticket.id)}
                            className="w-full px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all hover:shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <SkipForward className="w-4 h-4" />
                            Pular Vez
                          </button>
                          <button
                            onClick={() => marcarNoShow(ticket.id)}
                            className="w-full px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            No-Show
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
                  <p className="text-3xl font-bold text-blue-600">{formatarTempoEspera(ticketSelecionado.createdAt)}</p>
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
                      {formatarTelefone(ticketSelecionado.telefone)}
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
                      {ticketSelecionado.tempoEstimadoMinutos || 0} minutos
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
              {ticketSelecionado.chamadasCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Status de Chamadas
                  </h3>
                  <p className="text-sm text-yellow-800">
                    Cliente foi chamado <strong>{ticketSelecionado.chamadasCount}x</strong>
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
                      <p className="text-xs text-gray-600">{formatarDataHora(ticketSelecionado.createdAt)}</p>
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
