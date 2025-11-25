import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, UserX, Filter, Calendar, TrendingUp } from 'lucide-react';
import { clienteService } from '../services/api';

export default function HistoricoClienteTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [estatisticas, setEstatisticas] = useState({
    totalTickets: 0,
    finalizados: 0,
    cancelados: 0,
    noShows: 0,
    tempoMedioEspera: 0
  });

  useEffect(() => {
    carregarHistorico();
  }, [filtroStatus]);

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      // Buscar histórico completo do cliente (todos os tickets)
      const response = await clienteService.buscarMeuTicket();
      
      console.log('✅ Histórico do cliente carregado:', response);
      
      // Response pode ser um ticket único ou array de tickets
      const todosTickets = Array.isArray(response) ? response : [response];
      
      // Filtrar por status se necessário
      let ticketsFiltrados = todosTickets;
      if (filtroStatus !== 'TODOS') {
        ticketsFiltrados = todosTickets.filter(t => t.status === filtroStatus);
      }
      
      // Calcular estatísticas
      const finalizados = todosTickets.filter(t => t.status === 'FINALIZADO').length;
      const cancelados = todosTickets.filter(t => t.status === 'CANCELADO').length;
      const noShows = todosTickets.filter(t => t.status === 'NO_SHOW').length;
      
      // Calcular tempo médio (se disponível)
      const ticketsComTempo = todosTickets.filter(t => t.tempoEsperaMinutos);
      const tempoTotal = ticketsComTempo.reduce((acc, t) => acc + (t.tempoEsperaMinutos || 0), 0);
      const tempoMedio = ticketsComTempo.length > 0 ? Math.round(tempoTotal / ticketsComTempo.length) : 0;
      
      setEstatisticas({
        totalTickets: todosTickets.length,
        finalizados,
        cancelados,
        noShows,
        tempoMedioEspera: tempoMedio
      });
      
      setTickets(ticketsFiltrados);
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'FINALIZADO':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELADO':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'NO_SHOW':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'FINALIZADO':
        return <CheckCircle size={16} />;
      case 'CANCELADO':
        return <XCircle size={16} />;
      case 'NO_SHOW':
        return <UserX size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">Meu Histórico</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalTickets}</p>
              </div>
              <Calendar size={32} className="text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Finalizados</p>
                <p className="text-2xl font-bold text-green-600">{estatisticas.finalizados}</p>
              </div>
              <CheckCircle size={32} className="text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-gray-600">{estatisticas.cancelados}</p>
              </div>
              <XCircle size={32} className="text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No-Shows</p>
                <p className="text-2xl font-bold text-red-600">{estatisticas.noShows}</p>
              </div>
              <UserX size={32} className="text-red-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-orange-600">{estatisticas.tempoMedioEspera}min</p>
              </div>
              <TrendingUp size={32} className="text-orange-400" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">Filtrar por Status</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus('TODOS')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'TODOS'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos ({estatisticas.totalTickets})
            </button>
            <button
              onClick={() => setFiltroStatus('FINALIZADO')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'FINALIZADO'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Finalizados ({estatisticas.finalizados})
            </button>
            <button
              onClick={() => setFiltroStatus('CANCELADO')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'CANCELADO'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelados ({estatisticas.cancelados})
            </button>
            <button
              onClick={() => setFiltroStatus('NO_SHOW')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'NO_SHOW'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No-Shows ({estatisticas.noShows})
            </button>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando histórico...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
              <Clock size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum ticket encontrado</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {ticket.restaurante?.nome || 'Restaurante'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status === 'FINALIZADO' ? 'Finalizado' :
                         ticket.status === 'CANCELADO' ? 'Cancelado' : 'No-Show'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.restaurante?.cidade || ''}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-gray-900">#{ticket.numero}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ticket.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Pessoas</p>
                    <p className="font-medium text-gray-900">{ticket.quantidadePessoas}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tipo</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.prioridade === 'FAST_LANE' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-700'
                      }`}>
                      {ticket.prioridade === 'FAST_LANE' ? '⚡ Fast' : 'Normal'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tempo Espera</p>
                    <p className="font-medium text-gray-900">{ticket.tempoEsperaMinutos} min</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">Valor Pago</p>
                    <p className="font-medium text-gray-900">
                      {ticket.valorPago > 0 ? `R$ ${ticket.valorPago.toFixed(2)}` : 'Gratuito'}
                    </p>
                  </div>
                </div>

                {ticket.status === 'FINALIZADO' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      Finalizado em: {new Date(ticket.finalizadoEm).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
