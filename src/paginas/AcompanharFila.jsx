import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, AlertCircle, User, LogOut, History, CheckCircle, XCircle, UserX } from 'lucide-react';
import { clienteService, publicoService } from '../services/api';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (abaAtiva === 'fila') {
      carregarTicket();
      
      // Atualizar a cada 10 segundos
      const interval = setInterval(() => {
        carregarTicket();
      }, 10000);

      return () => clearInterval(interval);
    } else if (abaAtiva === 'historico') {
      carregarHistorico();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abaAtiva]);

  const carregarHistorico = async () => {
    try {
      setLoadingHistorico(true);
      // TODO: Integrar com API GET /cliente/tickets/historico
      // Query params: ?status=FINALIZADO,CANCELADO,NO_SHOW
      
      // Mock data
      const mockHistorico = [
        {
          id: 'ticket-h1',
          numero: 'A-120',
          status: 'FINALIZADO',
          prioridade: 'NORMAL',
          quantidadePessoas: 2,
          restaurante: {
            nome: 'Trattoria Bella Vista',
            endereco: 'Rua Augusta, 1234'
          },
          criadoEm: '2025-11-20T19:30:00.000Z',
          finalizadoEm: '2025-11-20T20:15:00.000Z'
        },
        {
          id: 'ticket-h2',
          numero: 'A-085',
          status: 'FINALIZADO',
          prioridade: 'FAST_LANE',
          quantidadePessoas: 4,
          restaurante: {
            nome: 'Pizzaria Napolitana',
            endereco: 'Av. Paulista, 1000'
          },
          criadoEm: '2025-11-18T20:00:00.000Z',
          finalizadoEm: '2025-11-18T20:25:00.000Z'
        },
        {
          id: 'ticket-h3',
          numero: 'A-056',
          status: 'CANCELADO',
          prioridade: 'NORMAL',
          quantidadePessoas: 3,
          restaurante: {
            nome: 'Sushi House',
            endereco: 'Rua Oscar Freire, 500'
          },
          criadoEm: '2025-11-15T18:45:00.000Z',
          canceladoEm: '2025-11-15T19:00:00.000Z',
          motivoCancelamento: 'Cliente desistiu'
        },
        {
          id: 'ticket-h4',
          numero: 'A-034',
          status: 'NO_SHOW',
          prioridade: 'NORMAL',
          quantidadePessoas: 2,
          restaurante: {
            nome: 'Burger Station',
            endereco: 'Rua da Consolação, 800'
          },
          criadoEm: '2025-11-10T21:00:00.000Z',
          noShowEm: '2025-11-10T21:35:00.000Z'
        }
      ];
      
      setHistorico(mockHistorico);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoadingHistorico(false);
    }
  };

  const carregarTicket = async () => {
    try {
      // Buscar ticket ativo da API
      const response = await clienteService.buscarMeuTicket();
      setTicket(response.ticket || response);
      setErro('');
      console.log('✅ Ticket carregado:', response);
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
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
      console.log('✅ Ticket cancelado');
      setModalCancelarAberto(false);
      navigate('/cliente/restaurantes');
    } catch (error) {
      console.error('Erro ao cancelar ticket:', error);
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
      case 'FINALIZADO':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <CheckCircle size={12} /> Finalizado
        </span>;
      case 'CANCELADO':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          <XCircle size={12} /> Cancelado
        </span>;
      case 'NO_SHOW':
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
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
      case 'ATENDENDO':
        return { texto: 'Mesa Pronta', cor: 'text-green-600', bgCor: 'bg-green-50', completed: true };
      default:
        return { texto: 'Na Fila', cor: 'text-gray-600', bgCor: 'bg-gray-50', completed: true };
    }
  };

  const statusProximoNaFila = getStatusInfo('AGUARDANDO');
  const isChamado = ticket?.status === 'CHAMADO';
  const isAtendendo = ticket?.status === 'ATENDENDO';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            {abaAtiva === 'fila' ? ticket?.restaurante?.nome : 'Meu Histórico'}
          </h1>
          
          {/* Menu de Perfil */}
          <div className="relative z-50">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handlePerfil}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <User size={16} />
                    Ver Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setAbaAtiva('fila')}
              className={`py-3 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'fila'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock size={18} />
              Fila Atual
            </button>
            <button
              onClick={() => setAbaAtiva('historico')}
              className={`py-3 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'historico'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <History size={18} />
              Histórico
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo da Aba Fila */}
      {abaAtiva === 'fila' && (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Endereço */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={16} />
            <span>{ticket?.restaurante?.endereco}</span>
          </div>

        {/* Card de Posição na Fila */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Sua Posição na Fila</p>
          <div className="text-7xl font-bold text-orange-600 mb-3">
            {ticket?.posicaoAtual}º
          </div>
          <div className="flex items-center justify-center gap-2 text-orange-700">
            <Clock size={16} />
            <span className="text-sm font-medium">
              Tempo estimado: {ticket?.tempoEstimadoMinutos || 15} min
            </span>
          </div>
        </div>

        {/* Detalhes do Ticket */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Detalhes do Ticket</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Número do Ticket</span>
              <span className="text-sm font-semibold text-gray-900">TKT-{ticket?.numero}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tipo de Fila</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                {ticket?.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tamanho do Grupo</span>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <Users size={16} />
                {ticket?.quantidadePessoas || 4} pessoas
              </div>
            </div>

            {ticket?.observacoes && (
              <div className="pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Observações</span>
                <p className="text-sm text-gray-900 mt-1">{ticket.observacoes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Status do Atendimento */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Status do Atendimento</h2>
          
          <div className="space-y-3">
            {/* Ticket Confirmado - Sempre completo */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ticket Confirmado</p>
                {ticket?.criadoEm && (
                  <p className="text-xs text-gray-500">{formatarHora(ticket.criadoEm)}</p>
                )}
              </div>
            </div>

            {/* Na Fila - Sempre completo quando ticket existe */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Na Fila</p>
                <p className="text-xs text-gray-500">Aguardando ser chamado</p>
              </div>
            </div>

            {/* Chamado - Completo apenas se status for CHAMADO */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                ticket?.status === 'CHAMADO' || ticket?.status === 'FINALIZADO'
                  ? 'bg-orange-600 border-orange-600'
                  : 'border-orange-300'
              }`}>
                {(ticket?.status === 'CHAMADO' || ticket?.status === 'FINALIZADO') && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  ticket?.status === 'CHAMADO' || ticket?.status === 'FINALIZADO'
                    ? 'text-orange-600'
                    : 'text-gray-400'
                }`}>
                  Chamado
                </p>
                {ticket?.status === 'CHAMADO' && (
                  <p className="text-xs text-orange-600 font-medium">Por favor, dirija-se ao restaurante!</p>
                )}
                {ticket?.status === 'AGUARDANDO' && (
                  <p className="text-xs text-gray-500">Fique atento! Você será chamado em breve.</p>
                )}
              </div>
            </div>

            {/* Mesa Pronta / Finalizado */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                ticket?.status === 'FINALIZADO'
                  ? 'bg-green-600 border-green-600'
                  : 'border-gray-200'
              }`}>
                {ticket?.status === 'FINALIZADO' && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  ticket?.status === 'FINALIZADO' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  Mesa Pronta
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Boas-Vindas do Restaurante */}
        {ticket?.restaurante?.mensagemBoasVindas && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Mensagem do Restaurante</p>
              <p className="text-xs text-blue-700">
                {ticket.restaurante.mensagemBoasVindas}
              </p>
            </div>
          </div>
        )}

        {/* Alerta */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-900 mb-1">Atenção</p>
            <p className="text-xs text-orange-700">
              Por favor, esteja pronto quando sua posição for chamada. Você terá 5 minutos para confirmar sua presença.
            </p>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleAtualizarStatus}
            disabled={loading}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Atualizando...' : 'Atualizar Status'}
          </button>
          
          <button
            onClick={handleAbrirModalCancelar}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancelar Ticket
          </button>
        </div>
        </main>
      )}

      {/* Conteúdo da Aba Histórico */}
      {abaAtiva === 'historico' && (
        <main className="max-w-2xl mx-auto px-4 py-6">
          {/* Filtros */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">Filtrar por status</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltroStatus('TODOS')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === 'TODOS'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroStatus('FINALIZADO')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === 'FINALIZADO'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Finalizados
              </button>
              <button
                onClick={() => setFiltroStatus('CANCELADO')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === 'CANCELADO'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelados
              </button>
              <button
                onClick={() => setFiltroStatus('NO_SHOW')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filtroStatus === 'NO_SHOW'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Não Compareceu
              </button>
            </div>
          </div>

          {/* Lista de Histórico */}
          {loadingHistorico ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-gray-600">Carregando histórico...</p>
            </div>
          ) : historicoFiltrado.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum ticket no histórico</p>
              <p className="text-sm text-gray-500 mt-2">
                {filtroStatus !== 'TODOS' ? 'Tente alterar o filtro' : 'Seus tickets anteriores aparecerão aqui'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {historicoFiltrado.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{ticket.restaurante.nome}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin size={14} />
                        <span>{ticket.restaurante.endereco}</span>
                      </div>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">Ticket</span>
                      <p className="text-sm font-semibold text-gray-900">TKT-{ticket.numero}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Prioridade</span>
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Pessoas</span>
                      <p className="text-sm font-medium text-gray-900">{ticket.quantidadePessoas}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Data</span>
                      <p className="text-sm font-medium text-gray-900">{formatarData(ticket.criadoEm)}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <span>
                        Entrada: {formatarHora(ticket.criadoEm)}
                      </span>
                      {ticket.finalizadoEm && (
                        <>
                          <span>•</span>
                          <span>
                            Saída: {formatarHora(ticket.finalizadoEm)}
                          </span>
                          <span>•</span>
                          <span className="font-medium text-orange-600">
                            Duração: {calcularTempoTotal(ticket.criadoEm, ticket.finalizadoEm)} min
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
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-900">Motivo do cancelamento:</p>
                      <p className="text-sm text-red-700 mt-1">{ticket.motivoCancelamento}</p>
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
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={handleFecharModalCancelar}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-6 pb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                Cancelar Ticket?
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Tem certeza que deseja cancelar seu ticket? Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="px-6 pb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={handleFecharModalCancelar}
                disabled={loadingCancelar}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
              >
                Não, manter ticket
              </button>
              <button
                onClick={handleConfirmarCancelamento}
                disabled={loadingCancelar}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50"
              >
                {loadingCancelar ? 'Cancelando...' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
