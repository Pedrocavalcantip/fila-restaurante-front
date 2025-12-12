import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Phone, Users, Clock, Calendar, MessageSquare, CheckCircle, XCircle, AlertCircle, UserX } from 'lucide-react';

export default function DetalhesTicket() {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [ticketId]);

  const carregarDetalhes = async () => {
    setLoading(true);
    try {
      // Simulação de dados mockados
      const ticketMock = {
        id: ticketId,
        numero: 1042,
        nomeCliente: 'Maria Santos',
        telefone: '(11) 98765-4321',
        email: 'maria.santos@email.com',
        quantidadePessoas: 4,
        observacoes: 'Preferência por mesa próxima à janela',
        status: 'FINALIZADO',
        prioridade: 'FAST_LANE',
        posicao: null,
        tempoEstimadoMinutos: null,
        createdAt: '2025-01-15T18:30:00Z',
        chamadoEm: '2025-01-15T19:15:00Z',
        finalizadoEm: '2025-01-15T19:30:00Z',
        canceladoEm: null,
        motivoCancelamento: null,
        valorPago: 15.00,
        cliente: {
          nomeCompleto: 'Maria Santos',
          telefone: '(11) 98765-4321',
          email: 'maria.santos@email.com',
          cidade: 'São Paulo',
          estado: 'SP'
        },
        fila: {
          nome: 'Jantar',
          tipo: 'NORMAL'
        },
        logs: [
          {
            id: 1,
            acao: 'CRIADO',
            detalhes: 'Ticket criado pelo cliente',
            createdAt: '2025-01-15T18:30:00Z',
            operador: null
          },
          {
            id: 2,
            acao: 'PAGAMENTO_CONFIRMADO',
            detalhes: 'Pagamento Fast Lane confirmado - R$ 15,00',
            createdAt: '2025-01-15T18:31:00Z',
            operador: null
          },
          {
            id: 3,
            acao: 'CHAMADO',
            detalhes: 'Cliente chamado para atendimento',
            createdAt: '2025-01-15T19:15:00Z',
            operador: {
              nome: 'João Operador',
              email: 'joao@restaurante.com'
            }
          },
          {
            id: 4,
            acao: 'FINALIZADO',
            detalhes: 'Cliente atendido com sucesso',
            createdAt: '2025-01-15T19:30:00Z',
            operador: {
              nome: 'João Operador',
              email: 'joao@restaurante.com'
            }
          }
        ]
      };
      
      setTicket(ticketMock);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AGUARDANDO':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'CHAMADO':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
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
      case 'AGUARDANDO':
        return <Clock size={20} />;
      case 'CHAMADO':
        return <AlertCircle size={20} />;
      case 'FINALIZADO':
        return <CheckCircle size={20} />;
      case 'CANCELADO':
        return <XCircle size={20} />;
      case 'NO_SHOW':
        return <UserX size={20} />;
      default:
        return <Clock size={20} />;
    }
  };

  const getLogIcon = (acao) => {
    switch (acao) {
      case 'CRIADO':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'CHAMADO':
        return <AlertCircle size={16} className="text-orange-400" />;
      case 'FINALIZADO':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'CANCELADO':
        return <XCircle size={16} className="text-red-400" />;
      case 'PAGAMENTO_CONFIRMADO':
        return <CheckCircle size={16} className="text-green-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const formatarData = (dataISO) => {
    return new Date(dataISO).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-400 mx-auto mb-4" />
          <p className="text-gray-400">Ticket não encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-white">Detalhes do Ticket</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Card Principal */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Ticket #{ticket.numeroTicket}
              </h2>
              <p className="text-gray-400">Fila: {ticket.fila.nome}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium border ${getStatusColor(ticket.status)}`}>
              {getStatusIcon(ticket.status)}
              {ticket.status === 'AGUARDANDO' ? 'Aguardando' :
               ticket.status === 'CHAMADO' ? 'Chamado' :
               ticket.status === 'FINALIZADO' ? 'Finalizado' :
               ticket.status === 'CANCELADO' ? 'Cancelado' : 'No-Show'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Informações do Cliente</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Nome</p>
                  <p className="font-medium text-white">{ticket.nomeCliente}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Telefone</p>
                  <p className="font-medium text-white">{ticket.telefone}</p>
                </div>
              </div>

              {ticket.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">E-mail</p>
                    <p className="font-medium text-white">{ticket.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Users size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Quantidade de Pessoas</p>
                  <p className="font-medium text-white">{ticket.quantidadePessoas}</p>
                </div>
              </div>
            </div>

            {/* Informações do Ticket */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Informações do Ticket</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Calendar size={20} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Criado em</p>
                  <p className="font-medium text-white">{formatarData(ticket.createdAt)}</p>
                </div>
              </div>

              {ticket.chamadoEm && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <AlertCircle size={20} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Chamado em</p>
                    <p className="font-medium text-white">{formatarData(ticket.chamadoEm)}</p>
                  </div>
                </div>
              )}

              {ticket.finalizadoEm && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Finalizado em</p>
                    <p className="font-medium text-white">{formatarData(ticket.finalizadoEm)}</p>
                  </div>
                </div>
              )}

              {ticket.prioridade === 'FAST_LANE' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-medium text-orange-400">
                      Fast Lane
                    </p>
                    {ticket.valorPago && (
                      <p className="text-sm text-orange-300">
                        R$ {ticket.valorPago.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          {ticket.observacoes && (
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <div className="flex items-start gap-3">
                <MessageSquare size={20} className="text-gray-400 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Observações</h3>
                  <p className="text-gray-300 bg-gray-800/50 p-3 rounded-xl">{ticket.observacoes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Motivo Cancelamento */}
          {ticket.motivoCancelamento && (
            <div className="mt-6 pt-6 border-t border-gray-800/50">
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-red-400 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">Motivo do Cancelamento</h3>
                  <p className="text-red-300 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{ticket.motivoCancelamento}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Histórico de Eventos */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Histórico de Eventos</h3>
          
          <div className="space-y-4">
            {ticket.logs.map((log, index) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-800/50 rounded-full flex items-center justify-center">
                    {getLogIcon(log.acao)}
                  </div>
                  {index < ticket.logs.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-800 mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-white">
                      {log.acao === 'CRIADO' ? 'Ticket Criado' :
                       log.acao === 'CHAMADO' ? 'Cliente Chamado' :
                       log.acao === 'FINALIZADO' ? 'Atendimento Finalizado' :
                       log.acao === 'CANCELADO' ? 'Ticket Cancelado' :
                       log.acao === 'PAGAMENTO_CONFIRMADO' ? 'Pagamento Confirmado' : log.acao}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatarData(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-1">{log.detalhes}</p>
                  {log.operador && (
                    <p className="text-xs text-gray-500">
                      Por: {log.operador.nome} ({log.operador.email})
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
