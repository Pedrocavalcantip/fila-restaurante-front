import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, Phone, CheckCircle2, XCircle, RefreshCw, SkipForward, AlertCircle, X, MessageSquare, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  // Carregar fila a cada 5 segundos (polling - substituir por WebSocket)
  useEffect(() => {
    carregarFila();
    const interval = setInterval(carregarFila, 5000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarFila = async () => {
    setLoading(true);
    try {
      // TODO: Integrar com API GET /tickets/filas/{filaId}/tickets/ativa
      // Response: { fila, tickets, estatisticas: { totalAguardando, totalChamados } }
      
      const mockData = {
        fila: {
          id: 'fila-123',
          nome: 'Fila Principal',
          restauranteId: 'rest-123'
        },
        tickets: [
          {
            id: 'ticket-1',
            numero: 'A-023',
            nomeCliente: 'João Silva',
            telefone: '11987654321',
            quantidadePessoas: 2,
            prioridade: 'NORMAL',
            status: 'AGUARDANDO',
            posicao: 1,
            tempoEstimadoMinutos: 5,
            criadoEm: new Date(Date.now() - 5 * 60000).toISOString(),
            observacoes: 'Cadeira de bebê'
          },
          {
            id: 'ticket-2',
            numero: 'A-024',
            nomeCliente: 'Maria Santos',
            telefone: '11987651234',
            quantidadePessoas: 4,
            prioridade: 'FAST_LANE',
            status: 'AGUARDANDO',
            posicao: 2,
            tempoEstimadoMinutos: 3,
            criadoEm: new Date(Date.now() - 3 * 60000).toISOString()
          },
          {
            id: 'ticket-3',
            numero: 'A-025',
            nomeCliente: 'Carlos Oliveira',
            telefone: '11987655678',
            quantidadePessoas: 2,
            prioridade: 'NORMAL',
            status: 'CHAMADO',
            posicao: 3,
            tempoEstimadoMinutos: 0,
            chamadasCount: 1,
            criadoEm: new Date(Date.now() - 12 * 60000).toISOString()
          }
        ],
        estatisticas: {
          totalAguardando: 2,
          totalChamados: 1
        }
      };
      
      setFilaData(mockData.fila);
      setTickets(mockData.tickets);
      setEstatisticas(mockData.estatisticas);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
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
      // TODO: Integrar com API POST /tickets/{ticketId}/chamar
      // Muda status AGUARDANDO -> CHAMADO, emite WebSocket
      console.log('Chamando cliente:', ticketId);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao chamar cliente:', error);
    }
  };

  const rechamarCliente = async (ticketId) => {
    try {
      // TODO: Integrar com API POST /tickets/{ticketId}/rechamar
      // Incrementa contagemRechamada, mantém status CHAMADO
      console.log('Rechamando cliente:', ticketId);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao rechamar cliente:', error);
    }
  };

  const finalizarAtendimento = async (ticketId) => {
    try {
      // TODO: Integrar com API POST /tickets/{ticketId}/finalizar
      // Muda status para FINALIZADO
      console.log('Finalizando atendimento:', ticketId);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
    }
  };

  const pularVez = async (ticketId) => {
    try {
      // TODO: Integrar com API POST /tickets/{ticketId}/pular
      // Retorna ticket para o fim da fila (CHAMADO -> AGUARDANDO)
      console.log('Pulando vez:', ticketId);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao pular vez:', error);
    }
  };

  const marcarNoShow = async (ticketId) => {
    if (!window.confirm('Confirmar que o cliente não apareceu?')) return;
    
    try {
      // TODO: Integrar com API POST /tickets/{ticketId}/no-show
      // Status NO_SHOW, incrementa estatística do cliente
      console.log('Marcando no-show:', ticketId);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao marcar no-show:', error);
    }
  };

  const cancelarTicket = async (ticketId) => {
    const motivo = window.prompt('Motivo do cancelamento:');
    if (!motivo) return;

    try {
      // TODO: Integrar com API POST /tickets/{ticketId}/cancelar
      // Body: { motivo }, Status CANCELADO
      console.log('Cancelando ticket:', ticketId, motivo);
      await carregarFila();
    } catch (error) {
      console.error('Erro ao cancelar ticket:', error);
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

  const formatarTempoEspera = (criadoEm) => {
    const minutos = Math.floor((Date.now() - new Date(criadoEm)) / 60000);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/painel')}
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
                            <span className="font-semibold text-orange-600">
                              Aguardando {formatarTempoEspera(ticket.criadoEm)}
                            </span>
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
                            onClick={() => cancelarTicket(ticket.id)}
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
                      onClick={() => { cancelarTicket(ticketSelecionado.id); fecharModal(); }}
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
    </div>
  );
}

export default PainelOperador;
