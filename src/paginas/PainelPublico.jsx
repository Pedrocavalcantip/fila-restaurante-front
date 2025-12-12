import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Clock, ArrowLeft } from 'lucide-react';
import { ticketService } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

export default function PainelPublico() {
  const navigate = useNavigate();
  const [ticketsChamados, setTicketsChamados] = useState([]);
  const [horaAtual, setHoraAtual] = useState(new Date());

  // Obter slug do restaurante
  const restauranteSlug = localStorage.getItem('restauranteSlug') || '';

  // Conectar WebSocket
  const { isConnected, on, off } = useWebSocket({ 
    restauranteSlug,
    autoConnect: !!restauranteSlug 
  });

  useEffect(() => {
    // Atualizar hora a cada segundo
    const intervaloHora = setInterval(() => {
      setHoraAtual(new Date());
    }, 1000);

    // Carregar tickets iniciais
    carregarTicketsChamados();

    return () => {
      clearInterval(intervaloHora);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escutar eventos WebSocket em tempo real
  useEffect(() => {
    if (!isConnected) return;

    console.log('🎧 Painel Público: Escutando tickets chamados...');

    // Ticket chamado - adicionar ao topo da lista
    const handleTicketChamado = (data) => {
      console.log('📢 TICKET CHAMADO:', data);
      
      // Tocar som de notificação
      playNotificationSound();
      
      // Adicionar ao topo e manter apenas os 10 mais recentes
      setTicketsChamados(prev => {
        const novosTickets = [data, ...prev.filter(t => t.id !== data.id)];
        return novosTickets.slice(0, 10);
      });
    };

    // Ticket atualizado - atualizar na lista se estiver presente
    const handleTicketAtualizado = (data) => {
      setTicketsChamados(prev => {
        const index = prev.findIndex(t => t.id === data.id);
        if (index !== -1) {
          const novosTickets = [...prev];
          novosTickets[index] = { ...novosTickets[index], ...data };
          return novosTickets;
        }
        return prev;
      });
    };

    on('ticket:chamado', handleTicketChamado);
    on('ticket:atualizado', handleTicketAtualizado);

    return () => {
      off('ticket:chamado', handleTicketChamado);
      off('ticket:atualizado', handleTicketAtualizado);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, on, off]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(err => console.log('Não foi possível tocar som:', err));
    } catch (err) {
      console.log('Erro ao tocar som:', err);
    }
  };

  const carregarTicketsChamados = async () => {
    try {
      const filaId = localStorage.getItem('filaAtivaId');
      
      if (!filaId) {
        console.warn('⚠️ FilaId não encontrado no localStorage');
        return;
      }

      // Buscar tickets da fila - usa mesma rota do PainelOperador
      const response = await ticketService.listarFilaAtiva(filaId);
      
      // A resposta vem como { tickets: [...], fila: {...}, estatisticas: {...} }
      const todosTickets = response.tickets || response || [];
      
      // Filtrar apenas tickets chamados e ordenar por mais recente
      const ticketsFiltrados = todosTickets
        .filter(ticket => ticket.status === 'CHAMADO')
        .sort((a, b) => new Date(b.chamadoEm || b.atualizadoEm) - new Date(a.chamadoEm || a.atualizadoEm))
        .slice(0, 10); // Últimos 10 tickets chamados
      
      console.log('📺 Painel TV - Tickets chamados:', ticketsFiltrados.length);
      setTicketsChamados(ticketsFiltrados);
    } catch (error) {
      console.error('❌ Erro ao carregar tickets:', error);
    }
  };

  const formatarHora = (data) => {
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getPrioridadeStyle = (prioridade) => {
    switch (prioridade) {
      case 'FAST_LANE':
        return 'bg-gradient-to-r from-orange-500 to-orange-700 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-700 text-white';
    }
  };

  const getPrioridadeIcon = (prioridade) => {
    switch (prioridade) {
      case 'FAST_LANE':
        return '⚡';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white overflow-hidden">
      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-gray-800/50"
            >
              <ArrowLeft size={24} />
              <span className="text-lg font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Bell size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Painel de Chamadas</h1>
                <p className="text-gray-400 text-lg">Acompanhe sua vez</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-3 text-gray-400 mb-1">
                <Clock size={24} />
                <span className="text-2xl font-medium">Horário Atual</span>
              </div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 font-mono">
                {formatarHora(horaAtual)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative container mx-auto px-8 py-12">
        {ticketsChamados.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-32 h-32 bg-gray-800/50 rounded-3xl flex items-center justify-center mb-6">
              <Bell size={64} className="text-gray-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-400 mb-2">Aguardando Chamadas</h2>
            <p className="text-xl text-gray-500">Os tickets chamados aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white">Tickets Chamados Recentemente</h2>
            </div>

            <div className="grid gap-6">
              {ticketsChamados.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className={`${getPrioridadeStyle(ticket.prioridade)} rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-105 ${
                    index === 0 ? 'ring-4 ring-white ring-opacity-50 animate-pulse' : ''
                  }`}
                  style={{
                    animation: index === 0 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {index === 0 && (
                        <div className="flex flex-col items-center">
                          <Bell size={48} className="animate-bounce" />
                          <span className="text-sm font-bold mt-2">CHAMANDO</span>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {ticket.prioridade !== 'NORMAL' && (
                            <span className="text-5xl">{getPrioridadeIcon(ticket.prioridade)}</span>
                          )}
                          <span className="text-2xl font-bold opacity-90">
                            {ticket.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
                          </span>
                        </div>
                        <div className="text-sm opacity-75 mb-1">TICKET</div>
                        <div className="text-8xl font-black tracking-wider font-mono">
                          #{ticket.numeroTicket}
                        </div>
                        <div className="text-2xl font-medium mt-3 opacity-90">
                          Fila: {ticket.fila}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm opacity-75 mb-2">Chamado às</div>
                      <div className="text-4xl font-bold font-mono">
                        {new Date(ticket.chamadoEm).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800/50 py-4">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg">Sistema Online - Atualização Automática</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span>Fast Lane</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <span>Normal</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
