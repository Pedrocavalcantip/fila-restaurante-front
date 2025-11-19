import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, AlertCircle, User, LogOut } from 'lucide-react';
import { clienteService, publicoService } from '../services/api';

export default function AcompanharFila() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarTicket();
    
    // Atualizar a cada 10 segundos
    const interval = setInterval(() => {
      carregarTicket();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const carregarTicket = async () => {
    try {
      const response = await clienteService.buscarMeuTicket();
      setTicket(response);
      setErro('');
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      
      // Se não encontrar, usar dados mockados
      setTicket({
        id: 'mock-ticket-123',
        numero: 2847,
        status: 'AGUARDANDO',
        prioridade: 'VIP',
        posicaoAtual: 5,
        tempoEstimadoMinutos: 15,
        quantidadePessoas: 4,
        restaurante: {
          nome: 'Trattoria Bella Vista',
          telefone: '5511987654321',
          endereco: 'Rua Augusta, 1234 - São Paulo'
        },
        fila: {
          nome: 'Fila Principal'
        },
        historico: [
          { evento: 'CRIADO', criadoEm: '2025-11-18T14:30:00.000Z' },
          { evento: 'NA_FILA', criadoEm: '2025-11-18T14:35:00.000Z' }
        ],
        criadoEm: '2025-11-18T14:30:00.000Z'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarTicket = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar seu ticket?')) {
      return;
    }

    try {
      await clienteService.cancelarTicket(ticket.id, 'Cancelado pelo cliente');
      navigate('/cliente/restaurantes');
    } catch (error) {
      console.error('Erro ao cancelar ticket:', error);
      setErro('Erro ao cancelar ticket. Tente novamente.');
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/cliente/restaurantes')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">{ticket?.restaurante?.nome}</h1>
          
          {/* Menu de Perfil */}
          <div className="relative">
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
                  className="fixed inset-0 z-10" 
                  onClick={() => setMenuAberto(false)}
                ></div>
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
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
                {ticket?.prioridade === 'VIP' ? 'Fast Lane VIP' : 
                 ticket?.prioridade === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tamanho do Grupo</span>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                <Users size={16} />
                {ticket?.quantidadePessoas || 4} pessoas
              </div>
            </div>
          </div>
        </div>

        {/* Status do Atendimento */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Status do Atendimento</h2>
          
          <div className="space-y-3">
            {/* Ticket Confirmado */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ticket Confirmado</p>
                <p className="text-xs text-gray-500">14:30</p>
              </div>
            </div>

            {/* Na Fila */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Na Fila</p>
                <p className="text-xs text-gray-500">14:35</p>
              </div>
            </div>

            {/* Próximo na Fila */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 ${isChamado || isAtendendo ? 'bg-orange-600 border-orange-600' : 'border-orange-300'} flex items-center justify-center mt-0.5`}>
                {(isChamado || isAtendendo) && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isChamado || isAtendendo ? 'text-orange-600' : 'text-gray-400'}`}>
                  Próximo na Fila
                </p>
                {(isChamado || isAtendendo) && <p className="text-xs text-gray-500">Agora</p>}
                {!isChamado && !isAtendendo && (
                  <p className="text-xs text-gray-500">Fique atento! Você será chamado em breve.</p>
                )}
              </div>
            </div>

            {/* Chamado */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 ${isChamado || isAtendendo ? 'border-gray-300' : 'border-gray-200'} flex items-center justify-center mt-0.5`}>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Chamado</p>
              </div>
            </div>

            {/* Mesa Pronta */}
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full border-2 ${isAtendendo ? 'border-gray-300' : 'border-gray-200'} flex items-center justify-center mt-0.5`}>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Mesa Pronta</p>
              </div>
            </div>
          </div>
        </div>

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
            onClick={handleCancelarTicket}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Cancelar Ticket
          </button>
        </div>
      </main>
    </div>
  );
}
