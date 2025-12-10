import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Clock, CheckCircle, XCircle, UserX } from 'lucide-react';
import { ticketService } from '../services/api';

export default function HistoricoTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const ticketsPorPagina = 10;

  useEffect(() => {
    carregarHistorico();
  }, [filtroStatus, paginaAtual]);

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const filaId = localStorage.getItem('filaAtivaId');
      
      if (!filaId) {
        console.warn('⚠️ FilaId não encontrado no localStorage');
        setLoading(false);
        return;
      }

      // Buscar histórico de tickets do backend
      const response = await ticketService.buscarHistorico(filaId);
      
      console.log('✅ Histórico carregado:', response);
      
      // Extrair array de tickets da resposta
      const ticketsArray = response.tickets || [];
      
      // Filtrar por status se necessário
      let ticketsFiltrados = ticketsArray;
      if (filtroStatus !== 'TODOS') {
        ticketsFiltrados = ticketsArray.filter(t => t.status === filtroStatus);
      }
      
      setTickets(ticketsFiltrados);
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const ticketsFiltrados = tickets.filter(ticket => 
    (ticket.numeroTicket?.toString() || '').includes(busca) ||
    (ticket.nomeCliente || '').toLowerCase().includes(busca.toLowerCase()) ||
    (ticket.telefone || '').includes(busca)
  );

  const totalPaginas = Math.ceil(ticketsFiltrados.length / ticketsPorPagina);
  const ticketsExibidos = ticketsFiltrados.slice(
    (paginaAtual - 1) * ticketsPorPagina,
    paginaAtual * ticketsPorPagina
  );

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
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/restaurante/painel-operador')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-white">Histórico de Tickets</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filtros */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por número, nome ou telefone..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Filtro Status */}
            <div className="flex gap-2">
              <button
                onClick={() => setFiltroStatus('TODOS')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filtroStatus === 'TODOS'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFiltroStatus('FINALIZADO')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filtroStatus === 'FINALIZADO'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Finalizados
              </button>
              <button
                onClick={() => setFiltroStatus('CANCELADO')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filtroStatus === 'CANCELADO'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Cancelados
              </button>
              <button
                onClick={() => setFiltroStatus('NO_SHOW')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filtroStatus === 'NO_SHOW'
                    ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                No-Show
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Tickets */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Carregando histórico...</p>
            </div>
          ) : ticketsExibidos.length === 0 ? (
            <div className="p-12 text-center">
              <Clock size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum ticket encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pessoas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Data</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {ticketsExibidos.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-semibold text-white">
                          #{ticket.numeroTicket}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {ticket.nomeCliente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {ticket.telefone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {ticket.quantidadePessoas}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.prioridade === 'FAST_LANE' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {ticket.prioridade === 'FAST_LANE' ? '⚡ Fast' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          {ticket.status === 'FINALIZADO' ? 'Finalizado' :
                           ticket.status === 'CANCELADO' ? 'Cancelado' : 'No-Show'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => navigate(`/restaurante/ticket/${ticket.id}`)}
                          className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                        >
                          Ver detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-4">
            <p className="text-sm text-gray-400">
              Mostrando {((paginaAtual - 1) * ticketsPorPagina) + 1} a {Math.min(paginaAtual * ticketsPorPagina, ticketsFiltrados.length)} de {ticketsFiltrados.length} tickets
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
                className="px-4 py-2 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
                className="px-4 py-2 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
