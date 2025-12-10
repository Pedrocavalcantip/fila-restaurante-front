import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, TrendingUp, UserX, Edit2, History, Clock, MapPin, User, Sparkles, Save, X } from 'lucide-react';
import { clienteService, publicoService } from '../services/api';

export default function PerfilCliente() {
  const [cliente, setCliente] = useState(null);
  const [ticketAtivo, setTicketAtivo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    cidade: '',
    estado: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    carregarPerfil();
    verificarTicketAtivo();
  }, []);

  const carregarPerfil = async () => {
    try {
      // Buscar perfil do backend
      const response = await clienteService.buscarPerfil();
      const clienteData = response.cliente || response;
      
      console.log('✅ Perfil carregado:', clienteData);
      
      setCliente(clienteData);
      setFormData({
        nome: clienteData.nomeCompleto || clienteData.nome || '',
        email: clienteData.email || '',
        telefone: clienteData.telefone || '',
        cpf: clienteData.cpf || '',
        cidade: clienteData.cidade || '',
        estado: clienteData.estado || 'SP'
      });
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error);
    }
  };

  const verificarTicketAtivo = async () => {
    try {
      const response = await clienteService.buscarMeuTicket();
      console.log('🔍 [PerfilCliente] Resposta buscarMeuTicket:', response);
      
      // O backend pode retornar {ticket: {...}} OU um array [{...}, {...}]
      let ticketEncontrado = null;
      
      if (response.ticket) {
        // Formato: {ticket: {...}}
        ticketEncontrado = response.ticket;
      } else if (Array.isArray(response)) {
        // Formato: [{...}, {...}, ...]
        // Buscar o primeiro ticket ATIVO
        ticketEncontrado = response.find(t => 
          ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
        );
        console.log('🔍 [PerfilCliente] Array recebido, ticket ativo:', ticketEncontrado);
      } else if (response.tickets && Array.isArray(response.tickets)) {
        // Formato: {tickets: [{...}, {...}]}
        ticketEncontrado = response.tickets.find(t => 
          ['AGUARDANDO', 'CHAMADO', 'MESA_PRONTA'].includes(t.status)
        );
      }
      
      if (ticketEncontrado) {
        console.log('✅ [PerfilCliente] Ticket ativo encontrado:', ticketEncontrado);
        
        // Se não tem informação do restaurante, buscar via fila
        if (!ticketEncontrado.fila?.restaurante?.nome && !ticketEncontrado.restaurante?.nome) {
          console.log('🔍 [PerfilCliente] Buscando info do restaurante...');
          
          // Tentar buscar pelo filaId ou restauranteId
          const filaId = ticketEncontrado.filaId || ticketEncontrado.fila?.id;
          const restauranteId = ticketEncontrado.restauranteId || ticketEncontrado.fila?.restauranteId;
          
          if (restauranteId) {
            try {
              // Buscar lista de restaurantes e encontrar o correto
              const restaurantes = await publicoService.listarRestaurantes();
              const restaurante = restaurantes.find(r => r.id === restauranteId);
              if (restaurante) {
                ticketEncontrado.restaurante = restaurante;
                console.log('✅ [PerfilCliente] Restaurante encontrado:', restaurante.nome);
              }
            } catch (e) {
              console.log('⚠️ Não foi possível buscar restaurante:', e);
            }
          }
        }
        
        console.log('📋 [PerfilCliente] Estrutura final:', {
          numeroTicket: ticketEncontrado.numeroTicket,
          posicao: ticketEncontrado.posicao,
          status: ticketEncontrado.status,
          prioridade: ticketEncontrado.prioridade,
          fila: ticketEncontrado.fila,
          restaurante: ticketEncontrado.restaurante || ticketEncontrado.fila?.restaurante
        });
        setTicketAtivo(ticketEncontrado);
      } else {
        console.log('ℹ️ [PerfilCliente] Nenhum ticket ativo');
        setTicketAtivo(null);
      }
    } catch (error) {
      console.log('⚠️ [PerfilCliente] Erro ao buscar ticket:', error.response?.status, error.response?.data);
      setTicketAtivo(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvar = async () => {
    try {
      // Atualizar perfil no backend
      const payload = {
        nomeCompleto: formData.nome,
        telefone: formData.telefone,
        cidade: formData.cidade,
        estado: formData.estado
      };
      
      console.log('➡️ Atualizando perfil:', payload);
      
      await clienteService.atualizarPerfil(payload);
      
      console.log('✅ Perfil atualizado com sucesso');
      
      // Recarregar perfil
      await carregarPerfil();
      setEditando(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handleCancelar = () => {
    // Restaurar dados originais
    setFormData({
      nome: cliente.nomeCompleto || cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
      cidade: cliente.cidade,
      estado: cliente.estado
    });
    setEditando(false);
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  if (!cliente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
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
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-white">Meu Perfil</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Título e Subtítulo */}
        <div>
          <h2 className="text-2xl font-bold text-white">Meu Perfil</h2>
          <p className="text-sm text-gray-400 mt-1">
            Gerencie suas informações e veja suas estatísticas
          </p>
        </div>

        {/* Botão Ver Histórico Completo */}
        <button
          onClick={() => navigate('/cliente/historico')}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
        >
          <History size={20} />
          Ver Histórico Completo de Tickets
        </button>

        {/* Ticket Ativo */}
        {ticketAtivo && (
          <div className="bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-orange-600/20 border border-orange-500/30 text-white rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl"></div>
            
            <div className="relative flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold mb-1 text-white">Você está na fila!</h3>
                <p className="text-orange-300/80 text-sm">
                  Acompanhe seu ticket em tempo real
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-500/30 rounded-xl flex items-center justify-center border border-orange-500/40">
                <Clock size={20} className="text-orange-300" />
              </div>
            </div>

            <div className="relative bg-gray-900/30 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-700/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-orange-300/80 text-xs mb-1">Número do Ticket</p>
                  <p className="font-mono text-2xl font-bold text-white">#{ticketAtivo.numeroTicket || ticketAtivo.numero || '?'}</p>
                </div>
                <div>
                  <p className="text-orange-300/80 text-xs mb-1">Posição na Fila</p>
                  <p className="font-mono text-2xl font-bold text-white">{ticketAtivo.posicao || '?'}º</p>
                </div>
              </div>
            </div>

            <div className="relative space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-300/80">Restaurante:</span>
                <span className="font-semibold text-white">
                  {ticketAtivo.fila?.restaurante?.nome || 
                   ticketAtivo.restaurante?.nome || 
                   ticketAtivo.fila?.nome ||
                   'Restaurante'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-300/80">Status:</span>
                <span className={`font-semibold ${ticketAtivo.status === 'CHAMADO' ? 'animate-pulse text-blue-400' : 'text-white'}`}>
                  {ticketAtivo.status === 'AGUARDANDO' ? 'Aguardando' : 
                   ticketAtivo.status === 'CHAMADO' ? 'Chamado - Dirija-se ao atendimento!' :
                   ticketAtivo.status === 'MESA_PRONTA' ? 'Confirmado!' : 
                   ticketAtivo.status || 'Aguardando'}
                </span>
              </div>
              {ticketAtivo.prioridade === 'FAST_LANE' && (
                <div className="flex items-center gap-2 text-sm">
                  
                  <span className="text-orange-300/80">Tipo:</span>
                  <span className="font-semibold text-yellow-400">Fast Lane</span>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/cliente/meu-ticket')}
              className="relative w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
            >
              Acompanhar Ticket em Tempo Real
            </button>
          </div>
        )}


        {/* Dados Pessoais */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Dados Pessoais</h3>
              <p className="text-sm text-gray-500">
                Gerencie suas informações de cadastro
              </p>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-xl transition-all duration-200"
              >
                <Edit2 size={16} />
                Editar
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Linha 1: Nome e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500"
                  />
                ) : (
                  <p className="text-sm text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    {formData.nome || '-'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                {editando ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500"
                  />
                ) : (
                  <p className="text-sm text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    {formData.email || '-'}
                  </p>
                )}
              </div>
            </div>

            {/* Linha 2: Telefone e Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    maxLength="15"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500"
                  />
                ) : (
                  <p className="text-sm text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    {formData.telefone || '-'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-gray-500"
                  />
                ) : (
                  <p className="text-sm text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-700/50">
                    {formData.cidade || '-'}
                  </p>
                )}
              </div>
            </div>

            {/* Linha 3: Estado (centralizado) */}
            <div className="max-w-xs mx-auto md:max-w-sm">
              <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                Estado
              </label>
              {editando ? (
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white"
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado} className="bg-gray-900">
                      {estado}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-white bg-gray-800/30 px-4 py-3 rounded-xl border border-gray-700/50 text-center">
                  {formData.estado || '-'}
                </p>
              )}
            </div>

            {/* Botões de Ação */}
            {editando && (
              <div className="flex gap-3 pt-4 border-t border-gray-800/50">
                <button
                  onClick={handleSalvar}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  <Save size={18} />
                  Salvar Alterações
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-700/50"
                >
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
