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
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELADO':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'NO_SHOW':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-white">Meu Histórico</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{estatisticas.totalTickets}</p>
              </div>
              <Calendar size={32} className="text-gray-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Finalizados</p>
                <p className="text-2xl font-bold text-green-400">{estatisticas.finalizados}</p>
              </div>
              <CheckCircle size={32} className="text-green-500/50" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Cancelados</p>
                <p className="text-2xl font-bold text-gray-300">{estatisticas.cancelados}</p>
              </div>
              <XCircle size={32} className="text-gray-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">No-Shows</p>
                <p className="text-2xl font-bold text-red-400">{estatisticas.noShows}</p>
              </div>
              <UserX size={32} className="text-red-500/50" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Tempo Médio</p>
                <p className="text-2xl font-bold text-orange-400">{estatisticas.tempoMedioEspera}min</p>
              </div>
              <TrendingUp size={32} className="text-orange-500/50" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            <Filter size={20} className="text-gray-400" />
            <h2 className="font-semibold text-white">Filtrar por Status</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroStatus('TODOS')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtroStatus === 'TODOS'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                  : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Todos ({estatisticas.totalTickets})
            </button>
            <button
              onClick={() => setFiltroStatus('FINALIZADO')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtroStatus === 'FINALIZADO'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Finalizados ({estatisticas.finalizados})
            </button>
            <button
              onClick={() => setFiltroStatus('CANCELADO')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtroStatus === 'CANCELADO'
                  ? 'bg-gray-600 text-white shadow-lg shadow-gray-500/25'
                  : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              Cancelados ({estatisticas.cancelados})
            </button>
            <button
              onClick={() => setFiltroStatus('NO_SHOW')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtroStatus === 'NO_SHOW'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'border border-gray-700 text-gray-300 hover:bg-gray-800'
              }`}
            >
              No-Shows ({estatisticas.noShows})
            </button>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-800/50 text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando histórico...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-800/50 text-center">
              <Clock size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum ticket encontrado</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {ticket.restaurante?.nome || 'Restaurante'}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        {ticket.status === 'FINALIZADO' ? 'Finalizado' :
                         ticket.status === 'CANCELADO' ? 'Cancelado' : 'No-Show'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{ticket.restaurante?.cidade || ''}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-lg font-bold text-white">#{ticket.numeroTicket}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-800/50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pessoas</p>
                    <p className="font-medium text-white">{ticket.quantidadePessoas}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tipo</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.prioridade === 'FAST_LANE' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-gray-700/50 text-gray-400'
                      }`}>
                      {ticket.prioridade === 'FAST_LANE' ? '⚡ Fast' : 'Normal'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tempo Espera</p>
                    <p className="font-medium text-white">{ticket.tempoEsperaMinutos} min</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Valor Pago</p>
                    <p className="font-medium text-white">
                      {ticket.valorPago > 0 ? `R$ ${ticket.valorPago.toFixed(2)}` : 'Gratuito'}
                    </p>
                  </div>
                </div>

                {ticket.status === 'FINALIZADO' && (
                  <div className="mt-4 pt-4 border-t border-gray-800/50">
                    <p className="text-xs text-gray-500">
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
