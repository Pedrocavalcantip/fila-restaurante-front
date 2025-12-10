import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Flame, User, Star, Clock, X, AlertCircle, MapPin, Users, Zap, ChefHat } from 'lucide-react';
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
        console.log('🔍 Resposta completa do buscarMeuTicket:', responseTicket);
        
        // O backend pode retornar {ticket: {...}} OU um array [{...}, {...}]
        let ticketEncontrado = null;
        
        if (responseTicket.ticket) {
          // Formato: {ticket: {...}}
          ticketEncontrado = responseTicket.ticket;
        } else if (Array.isArray(responseTicket)) {
          // Formato: [{...}, {...}, ...]
          // Buscar o primeiro ticket ATIVO (não FINALIZADO, CANCELADO, NO_SHOW)
          ticketEncontrado = responseTicket.find(t => 
            ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
          );
          console.log('🔍 Array de tickets recebido, buscando ticket ativo...');
          console.log('✅ Ticket ativo encontrado:', ticketEncontrado);
        } else if (responseTicket.tickets && Array.isArray(responseTicket.tickets)) {
          // Formato: {tickets: [{...}, {...}]}
          ticketEncontrado = responseTicket.tickets.find(t => 
            ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
          );
        }
        
        if (ticketEncontrado) {
          console.log('✅ Ticket ativo encontrado:', ticketEncontrado);
          console.log('📋 Dados do ticket:', {
            id: ticketEncontrado.id,
            numeroTicket: ticketEncontrado.numeroTicket,
            status: ticketEncontrado.status,
            posicao: ticketEncontrado.posicao,
            fila: ticketEncontrado.fila,
            restaurante: ticketEncontrado.restaurante || ticketEncontrado.fila?.restaurante
          });
          setTicketAtivo(ticketEncontrado);
        } else {
          console.log('ℹ️ Nenhum ticket ativo encontrado (todos finalizados/cancelados)');
          setTicketAtivo(null);
        }
      } catch (error) {
        // Não tem ticket ativo, isso é normal
        console.log('⚠️ Erro ao buscar ticket ativo:', error.response?.status, error.response?.data);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-400 font-medium">Carregando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      {/* Ambient Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-white">Restaurantes Disponíveis</h1>
              <p className="text-sm text-gray-400 mt-0.5">Escolha seu restaurante e entre na fila</p>
            </div>
          </div>
          
          {/* Menu de Perfil */}
          <div className="relative">
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2.5 text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-xl transition-all duration-200 border border-gray-700/50"
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
                <div className="absolute right-0 mt-2 w-52 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 py-2 z-20">
                  <button
                    onClick={handlePerfil}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white flex items-center gap-3 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-gray-400" />
                    </div>
                    Ver Perfil
                  </button>
                  <div className="border-t border-gray-800 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <LogOut size={16} className="text-red-400" />
                    </div>
                    Sair
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-6">
        {/* Banner de Erro */}
        {erro && !loading && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="text-red-400" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-300">Erro ao carregar restaurantes</h3>
              <p className="text-sm text-red-400/80 mt-1">{erro}</p>
              <button
                onClick={carregarDados}
                className="mt-3 text-sm font-medium text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}
        {/* Banner de Ticket Ativo */}
        {ticketAtivo && (
          <div className="mb-6 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-5 flex items-center justify-between backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-bold text-white text-lg">Você está na fila!</h3>
                <p className="text-sm text-gray-300">
                  {ticketAtivo.fila?.restaurante?.nome || ticketAtivo.restaurante?.nome || 'Restaurante'} • 
                  {ticketAtivo.posicao ? ` Posição: ${ticketAtivo.posicao}º` : ' Aguardando posição'} • 
                  Ticket: #{ticketAtivo.numeroTicket || ticketAtivo.numero || '?'}
                </p>
              </div>
            </div>
            <button
              onClick={handleAcompanharFila}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
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
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
              <ChefHat size={40} className="text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Nenhum restaurante disponível
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Não encontramos restaurantes próximos à sua localização no momento.
            </p>
          </div>
        )}

        {/* Link do painel de restaurante */}
        <div className="mt-10 text-center border-t border-gray-800/50 pt-8">
          <p className="text-sm text-gray-500 mb-4">
            Você é proprietário de um restaurante?
          </p>
          <button
            onClick={() => navigate('/restaurante/login')}
            className="text-orange-400 hover:text-orange-300 font-semibold text-sm inline-flex items-center gap-2 transition-colors group"
          >
            Acessar Painel do Restaurante
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </main>

      {/* Modal de Entrar na Fila */}
      {modalAberto && restauranteSelecionado && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-md"
          onClick={handleFecharModal}
        >
          <div 
            className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${prioridadeSelecionada === 'FAST_LANE' ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25' : 'bg-gray-800'}`}>
                  {prioridadeSelecionada === 'FAST_LANE' ? <Zap className="text-white" size={20} /> : <Users className="text-gray-400" size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {prioridadeSelecionada === 'FAST_LANE' ? 'Fast Lane' : 'Fila Normal'}
                  </h2>
                  <p className="text-sm text-gray-400">{restauranteSelecionado.nome}</p>
                </div>
              </div>
              <button
                onClick={handleFecharModal}
                className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-xl transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Quantidade de Pessoas */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantidade de Pessoas <span className="text-orange-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidadePessoas}
                  onChange={(e) => setQuantidadePessoas(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-2">Mínimo de 1 pessoa</p>
              </div>

              {/* Observações */}
              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300 mb-2">
                  Observações <span className="text-gray-500">(Opcional)</span>
                </label>
                <textarea
                  id="observacoes"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Cadeira de bebê, aniversário, etc."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Adicione informações relevantes para o restaurante
                </p>
              </div>

              {/* Box de Valor Fast Lane */}
              {prioridadeSelecionada === 'FAST_LANE' && (
                <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-300">Valor Fast Lane</p>
                    <p className="text-xl font-bold text-orange-400">
                      R$ {Number(restauranteSelecionado.precoFastlane || 15).toFixed(2)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Pagamento processado após confirmação
                  </p>
                </div>
              )}

              {/* Mensagem de Erro */}
              {erro && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{erro}</p>
                </div>
              )}

              {/* Botões */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleFecharModal}
                  disabled={loadingConfirmar}
                  className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmarEntrada}
                  disabled={loadingConfirmar}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
                >
                  {loadingConfirmar ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Confirmando...
                    </span>
                  ) : 'Confirmar'}
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
    <div className="group bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
      {/* Imagem do Restaurante */}
      <div className="relative h-52 overflow-hidden">
        {(restaurante.imagemUrl || restaurante.imagem) ? (
          <img 
            src={restaurante.imagemUrl || restaurante.imagem} 
            alt={restaurante.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-600 via-amber-500 to-red-600 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <ChefHat size={48} className="mx-auto mb-2 opacity-80" />
              <h3 className="text-xl font-bold">{restaurante.nome}</h3>
            </div>
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent"></div>
        
        {/* Nome sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-lg font-bold">{restaurante.nome}</h3>
          <div className="flex items-center gap-1.5 text-gray-300 text-sm mt-1">
            <MapPin size={14} className="text-orange-400" />
            <p>{restaurante.cidade}, {restaurante.estado}</p>
          </div>
        </div>
      </div>

      {/* Informações */}
      <div className="p-5">
        {/* Localização - só mostra se tiver endereço */}
        {restaurante.endereco && (
          <div className="mb-4 text-sm text-gray-400">
            <p className="line-clamp-1">{restaurante.endereco}</p>
          </div>
        )}

        {/* Informações da Fila */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
            <Users size={16} className="text-orange-400" />
            <span className="font-semibold text-white">{tamanhoFila}</span>
            <span className="text-gray-500 text-sm">na fila</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
            <Clock size={16} className="text-amber-400" />
            <span className="font-medium text-white text-sm">{formatarTempoEstimado(tempoEstimado)}</span>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={() => onEntrarFila(restaurante, 'NORMAL')}
            className="flex-1 py-3 px-4 border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200"
          >
            Fila Normal
          </button>
          <button
            onClick={() => onEntrarFila(restaurante, 'FAST_LANE')}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
            <Zap size={16} />
            Fast Lane
          </button>
        </div>
      </div>
    </div>
  );
}
