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
        criadoEm: '2025-01-15T18:30:00Z',
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
          estado: 'SP',
          isVip: false
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
            criadoEm: '2025-01-15T18:30:00Z',
            operador: null
          },
          {
            id: 2,
            acao: 'PAGAMENTO_CONFIRMADO',
            detalhes: 'Pagamento Fast Lane confirmado - R$ 15,00',
            criadoEm: '2025-01-15T18:31:00Z',
            operador: null
          },
          {
            id: 3,
            acao: 'CHAMADO',
            detalhes: 'Cliente chamado para atendimento',
            criadoEm: '2025-01-15T19:15:00Z',
            operador: {
              nome: 'João Operador',
              email: 'joao@restaurante.com'
            }
          },
          {
            id: 4,
            acao: 'FINALIZADO',
            detalhes: 'Cliente atendido com sucesso',
            criadoEm: '2025-01-15T19:30:00Z',
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
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CHAMADO':
        return 'bg-orange-100 text-orange-700 border-orange-200';
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
        return <CheckCircle size={16} className="text-green-600" />;
      case 'CHAMADO':
        return <AlertCircle size={16} className="text-orange-600" />;
      case 'FINALIZADO':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'CANCELADO':
        return <XCircle size={16} className="text-red-600" />;
      case 'PAGAMENTO_CONFIRMADO':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Ticket não encontrado</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

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
          
          <h1 className="text-lg font-bold text-gray-900">Detalhes do Ticket</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Card Principal */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Ticket #{ticket.numero}
              </h2>
              <p className="text-gray-600">Fila: {ticket.fila.nome}</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Cliente</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-900">{ticket.nomeCliente}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Phone size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium text-gray-900">{ticket.telefone}</p>
                </div>
              </div>

              {ticket.email && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <p className="font-medium text-gray-900">{ticket.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quantidade de Pessoas</p>
                  <p className="font-medium text-gray-900">{ticket.quantidadePessoas}</p>
                </div>
              </div>
            </div>

            {/* Informações do Ticket */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Ticket</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Criado em</p>
                  <p className="font-medium text-gray-900">{formatarData(ticket.criadoEm)}</p>
                </div>
              </div>

              {ticket.chamadoEm && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chamado em</p>
                    <p className="font-medium text-gray-900">{formatarData(ticket.chamadoEm)}</p>
                  </div>
                </div>
              )}

              {ticket.finalizadoEm && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Finalizado em</p>
                    <p className="font-medium text-gray-900">{formatarData(ticket.finalizadoEm)}</p>
                  </div>
                </div>
              )}

              {ticket.prioridade === 'FAST_LANE' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <p className="font-medium text-orange-700">
                      Fast Lane
                    </p>
                    {ticket.valorPago && (
                      <p className="text-sm text-orange-600">
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <MessageSquare size={20} className="text-gray-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Observações</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{ticket.observacoes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Motivo Cancelamento */}
          {ticket.motivoCancelamento && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <XCircle size={20} className="text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Motivo do Cancelamento</h3>
                  <p className="text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">{ticket.motivoCancelamento}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Histórico de Eventos */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Eventos</h3>
          
          <div className="space-y-4">
            {ticket.logs.map((log, index) => (
              <div key={log.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {getLogIcon(log.acao)}
                  </div>
                  {index < ticket.logs.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-gray-900">
                      {log.acao === 'CRIADO' ? 'Ticket Criado' :
                       log.acao === 'CHAMADO' ? 'Cliente Chamado' :
                       log.acao === 'FINALIZADO' ? 'Atendimento Finalizado' :
                       log.acao === 'CANCELADO' ? 'Ticket Cancelado' :
                       log.acao === 'PAGAMENTO_CONFIRMADO' ? 'Pagamento Confirmado' : log.acao}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatarData(log.criadoEm)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.detalhes}</p>
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
