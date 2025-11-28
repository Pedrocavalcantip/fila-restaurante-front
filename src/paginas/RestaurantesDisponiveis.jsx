import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Flame, User, Star, Clock, X, AlertCircle } from 'lucide-react';
import { clienteService } from '../services/api';

export default function RestaurantesDisponiveis() {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketAtivo, setTicketAtivo] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [restauranteSelecionado, setRestauranteSelecionado] = useState(null);
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState('NORMAL');
  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [loadingConfirmar, setLoadingConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Buscar restaurantes próximos
      try {
        console.log('🔍 Buscando restaurantes do backend...');
        const responseRestaurantes = await clienteService.buscarRestaurantes();
        console.log('✅ Resposta COMPLETA do backend:', JSON.stringify(responseRestaurantes, null, 2));
        
        // Aceita tanto array direto quanto objeto com propriedade restaurantes
        const restaurantesData = Array.isArray(responseRestaurantes) 
          ? responseRestaurantes 
          : (responseRestaurantes.restaurantes || []);
        
        console.log(`✅ ${restaurantesData.length} restaurante(s) encontrado(s)`);
        console.log('📊 Dados dos restaurantes:', restaurantesData);
        setRestaurantes(restaurantesData);
        setErro(''); // Limpar erro se sucesso
      } catch (error) {
        console.error('❌ Erro ao buscar restaurantes:', error);
        console.error('❌ Detalhes:', error.response?.data || error.message);
        console.error('❌ Tipo de erro:', error.name);
        
        // Verificar se é erro de conexão
        if (error.name === 'FetchError' || error.message.includes('fetch')) {
          setErro('Erro de conexão com o servidor. Verifique se o backend está rodando na porta 3000.');
        } else if (error.code === 'ERR_NETWORK') {
          setErro('Erro de rede. Verifique sua conexão com a internet e se o backend está rodando.');
        } else if (error.response?.status === 404) {
          setErro('Endpoint não encontrado. Verifique se o backend está atualizado.');
        } else {
          setErro(error.response?.data?.message || 'Erro ao carregar restaurantes. Verifique se o backend está rodando.');
        }
        
        setRestaurantes([]);
      }

      // Verificar se tem ticket ativo no backend
      try {
        const responseTicket = await clienteService.buscarMeuTicket();
        if (responseTicket.ticket) {
          setTicketAtivo(responseTicket.ticket);
          console.log('✅ Ticket ativo encontrado no backend:', responseTicket.ticket);
        }
      } catch (error) {
        // Não tem ticket ativo, isso é normal
        console.log('ℹ️ Nenhum ticket ativo encontrado');
        setTicketAtivo(null);
      }
    } catch (error) {
      console.error('❌ Erro geral ao carregar dados:', error);
      setErro('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
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

  const handleAcompanharFila = () => {
    if (ticketAtivo) {
      navigate('/cliente/meu-ticket');
    }
  };

  const handleEntrarNaFila = (restaurante, prioridade = 'NORMAL') => {
    setRestauranteSelecionado(restaurante);
    setPrioridadeSelecionada(prioridade);
    setQuantidadePessoas(1);
    setObservacoes('');
    setErro('');
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setRestauranteSelecionado(null);
    setErro('');
  };

  const handleConfirmarEntrada = async () => {
    setErro('');
    setLoadingConfirmar(true);

    try {
      // Integração com backend
      const payload = {
        quantidadePessoas,
        prioridade: prioridadeSelecionada,
        observacoes
      };
      
      console.log('📤 Enviando para fila:', {
        slug: restauranteSelecionado.slug,
        payload: payload
      });
      
      const response = await clienteService.entrarNaFila(restauranteSelecionado.slug, payload);
      
      const { ticket } = response;
      console.log('✅ Ticket criado - Response completa:', JSON.stringify(response, null, 2));
      console.log('📋 Campos do ticket:', {
        quantidadePessoas: ticket?.quantidadePessoas,
        observacoes: ticket?.observacoes,
        prioridade: ticket?.prioridade
      });
      
      navigate('/cliente/meu-ticket');
    } catch (error) {
      console.error('Erro ao entrar na fila:', error);
      setErro(error.response?.data?.message || 'Erro ao entrar na fila. Tente novamente.');
    } finally {
      setLoadingConfirmar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Restaurantes Disponíveis</h1>
            <p className="text-sm text-gray-500 mt-0.5">Escolha seu restaurante e entre na fila</p>
          </div>
          
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

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Banner de Erro */}
        {erro && !loading && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Erro ao carregar restaurantes</h3>
              <p className="text-sm text-red-700 mt-1">{erro}</p>
              <button
                onClick={carregarDados}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Banner de Ticket Ativo */}
        {ticketAtivo && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Você está na fila!</h3>
                <p className="text-sm text-gray-600">
                  {ticketAtivo.restaurante?.nome} • Posição: {ticketAtivo.posicao}º • Aguardando
                </p>
              </div>
            </div>
            <button
              onClick={handleAcompanharFila}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              Acompanhar
              <span className="text-lg">→</span>
            </button>
          </div>
        )}

        {/* Grid de Restaurantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantes.map((restaurante) => (
            <RestauranteCard
              key={restaurante.id}
              restaurante={restaurante}
              onEntrarFila={handleEntrarNaFila}
            />
          ))}
        </div>

        {/* Mensagem quando não há restaurantes */}
        {restaurantes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum restaurante disponível
            </h3>
            <p className="text-gray-500">
              Não encontramos restaurantes próximos à sua localização.
            </p>
          </div>
        )}

        {/* Link do painel de restaurante */}
        <div className="mt-8 text-center border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-600 mb-3">
            Você é proprietário de um restaurante?
          </p>
          <button
            onClick={() => navigate('/restaurante/login')}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm inline-flex items-center gap-1 transition-colors"
          >
            Acessar Painel do Restaurante
            <span className="text-lg">→</span>
          </button>
        </div>
      </main>

      {/* Modal de Entrar na Fila */}
      {modalAberto && restauranteSelecionado && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={handleFecharModal}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {prioridadeSelecionada === 'FAST_LANE' ? 'Entrada Fast Lane' : 'Entrar na Fila Normal'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{restauranteSelecionado.nome}</p>
              </div>
              <button
                onClick={handleFecharModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-5">
              {/* Quantidade de Pessoas */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Quantidade de Pessoas <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidadePessoas}
                  onChange={(e) => setQuantidadePessoas(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">Mínimo de 1 pessoa</p>
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-900 mb-2">
                  Observações <span className="text-gray-400">(Opcional)</span>
                </label>
                <textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Cadeira de bebê, aniversário, etc."
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Adicione informações relevantes para o restaurante
                </p>
              </div>

              {/* Box de Valor Fast Lane */}
              {prioridadeSelecionada === 'FAST_LANE' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">Valor Fast Lane</p>
                    <p className="text-lg font-bold text-orange-600">
                      R$ {Number(restauranteSelecionado.precoFastlane || 15).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Pagamento processado após confirmação
                  </p>
                </div>
              )}

              {/* Mensagem de Erro */}
              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{erro}</p>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleFecharModal}
                  disabled={loadingConfirmar}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarEntrada}
                  disabled={loadingConfirmar}
                  className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {loadingConfirmar ? 'Confirmando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Função para formatar tempo estimado
function formatarTempoEstimado(minutos) {
  if (!minutos) return 'Não disponível';
  if (minutos < 60) return `~${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return mins > 0 ? `~${horas}h ${mins}min` : `~${horas}h`;
}

// Componente do Card de Restaurante
function RestauranteCard({ restaurante, onEntrarFila }) {
  // Backend retorna array de filas, precisamos pegar a primeira ou somar todas
  const filas = restaurante.filas || [];
  const filaAtiva = restaurante.filaAtiva || restaurante.fila || filas[0] || {};
  
  // Calcular total de pessoas na fila (soma de todas as filas se houver múltiplas)
  let tamanhoFila = 0;
  if (filas.length > 0) {
    tamanhoFila = filas.reduce((total, fila) => {
      const count = fila._aggr_count_tickets || fila._count?.tickets || fila.tamanhoFila || 0;
      return total + count;
    }, 0);
  } else {
    // Fallback para estrutura antiga
    tamanhoFila = filaAtiva.tamanhoFila || filaAtiva._count?.tickets || filaAtiva._aggr_count_tickets || filaAtiva.ticketsAtivos || 0;
  }
  
  const tempoEstimado = Number(filaAtiva.tempoEstimadoMinutos || filaAtiva.tempoMedioEspera || 0);
  
  // Log para debug
  console.log('Renderizando restaurante:', {
    nome: restaurante.nome,
    filas: filas.length,
    tamanhoFila,
    tempoEstimado,
    precoFastlane: restaurante.precoFastlane,
    estrutura: {
      temFilas: !!restaurante.filas,
      temFilaAtiva: !!restaurante.filaAtiva,
      temFila: !!restaurante.fila
    }
  });
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      {/* Imagem do Restaurante */}
      <div className="relative h-48 overflow-hidden">
        {(restaurante.imagemUrl || restaurante.imagem) ? (
          <img 
            src={restaurante.imagemUrl || restaurante.imagem} 
            alt={restaurante.nome}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h3 className="text-xl font-bold">{restaurante.nome}</h3>
            </div>
          </div>
        )}
        
        {/* Nome sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white text-lg font-bold">{restaurante.nome}</h3>
          <p className="text-white text-sm opacity-90">{restaurante.cidade}, {restaurante.estado}</p>
        </div>
      </div>

      {/* Informações */}
      <div className="p-4">
        {/* Localização - só mostra se tiver endereço */}
        {restaurante.endereco && (
          <div className="mb-3 text-sm text-gray-600">
            <p className="mb-2 line-clamp-1">{restaurante.endereco}</p>
          </div>
        )}

        {/* Informações da Fila */}
        <div className="mb-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-700">
            <User size={16} className="text-orange-600" />
            <span className="font-medium">{tamanhoFila}</span>
            <span className="text-gray-500">na fila</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <Clock size={16} className="text-orange-600" />
            <span className="font-medium">{formatarTempoEstimado(tempoEstimado)}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-2">
          <button
            onClick={() => onEntrarFila(restaurante, 'NORMAL')}
            className="flex-1 py-2.5 px-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
          >
            Fila Normal
          </button>
          <button
            onClick={() => onEntrarFila(restaurante, 'FAST_LANE')}
            className="flex-1 py-2.5 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Flame size={16} />
            Fast Lane
          </button>
        </div>
      </div>
    </div>
  );
}
