import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Trash2, User, Settings, DollarSign, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { restauranteService } from '../services/api';

function Gerenciamento() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('equipe'); // 'equipe' ou 'configuracoes'
  const [loading, setLoading] = useState(true);
  
  // Dados da equipe
  const [membrosEquipe, setMembrosEquipe] = useState([]);

  const [mostrarModalOperador, setMostrarModalOperador] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [membroParaExcluir, setMembroParaExcluir] = useState(null);
  const [novoMembro, setNovoMembro] = useState({
    nome: '',
    email: '',
    senha: '',
    role: 'OPERADOR'
  });

  // Configurações do Restaurante
  const [configuracoes, setConfiguracoes] = useState({
    nome: '',
    slug: '',
    telefone: '',
    endereco: '',
    capacidade: 50,
    precoFastlane: 15.00,
    maxReentradasPorDia: 3,
    mensagemBoasVindas: '',
    horarios: {
      segunda: { aberto: true, inicio: '11:00', fim: '23:00' },
      terca: { aberto: true, inicio: '11:00', fim: '23:00' },
      quarta: { aberto: true, inicio: '11:00', fim: '23:00' },
      quinta: { aberto: true, inicio: '11:00', fim: '23:00' },
      sexta: { aberto: true, inicio: '11:00', fim: '23:00' },
      sabado: { aberto: true, inicio: '11:00', fim: '23:00' },
      domingo: { aberto: false, inicio: '11:00', fim: '23:00' }
    }
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await restauranteService.buscarMeuRestaurante();
      const rest = response.restaurante || response;
      
      console.log('✅ Dados do restaurante carregados:', rest);
      
      // Parsear horários se existirem (backend pode retornar JSON string)
      let horariosParsed = {
        segunda: { aberto: true, inicio: '11:00', fim: '23:00' },
        terca: { aberto: true, inicio: '11:00', fim: '23:00' },
        quarta: { aberto: true, inicio: '11:00', fim: '23:00' },
        quinta: { aberto: true, inicio: '11:00', fim: '23:00' },
        sexta: { aberto: true, inicio: '11:00', fim: '23:00' },
        sabado: { aberto: true, inicio: '11:00', fim: '23:00' },
        domingo: { aberto: false, inicio: '11:00', fim: '23:00' }
      };
      
      if (rest.horariosFuncionamento) {
        try {
          horariosParsed = typeof rest.horariosFuncionamento === 'string' 
            ? JSON.parse(rest.horariosFuncionamento)
            : rest.horariosFuncionamento;
        } catch (e) {
          console.warn('Erro ao parsear horários:', e);
        }
      }
      
      // Montar endereço completo do objeto aninhado
      const enderecoCompleto = rest.endereco 
        ? `${rest.endereco.rua || ''}, ${rest.endereco.numero || ''} - ${rest.endereco.bairro || ''}, ${rest.endereco.cidade || ''}/${rest.endereco.estado || ''}`
        : '';
      
      setConfiguracoes({
        nome: rest.nome || '',
        slug: rest.slug || '',
        telefone: rest.telefone || '',
        endereco: enderecoCompleto,
        capacidade: rest.maxTicketsPorHora || 50, // Backend usa maxTicketsPorHora
        precoFastlane: rest.precoFastlane || 15.00,
        maxReentradasPorDia: rest.maxReentradasPorDia || 3,
        mensagemBoasVindas: rest.mensagemBoasVindas || '',
        horarios: horariosParsed
      });
      
      // TODO: Carregar membros da equipe quando endpoint estiver disponível
      // setMembrosEquipe(rest.equipe || []);
    } catch (error) {
      console.error('❌ Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarMembro = async (e) => {
    e.preventDefault();
    
    try {
      console.log('➡️ Tentando criar operador:', novoMembro);
      
      // TODO: Integrar com API para criar operador
      // await restauranteService.criarOperador(novoMembro);
      
      console.warn('⚠️ MOCK: Operador NÃO foi salvo no banco de dados');
      console.warn('⚠️ Endpoint de criar operador ainda não implementado no frontend');
      
      // Temporariamente adiciona ao estado local (apenas visual)
      const novoId = Date.now();
      setMembrosEquipe([...membrosEquipe, { ...novoMembro, id: novoId }]);
      setNovoMembro({ nome: '', email: '', senha: '', role: 'OPERADOR' });
      setMostrarModalOperador(false);
      
      alert('⚠️ ATENÇÃO: Este operador foi adicionado apenas localmente.\nA integração com o backend ainda precisa ser implementada.');
    } catch (error) {
      console.error('❌ Erro ao criar operador:', error);
      alert('Erro ao criar operador. Tente novamente.');
    }
  };

  const abrirModalExcluir = (membro) => {
    setMembroParaExcluir(membro);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = () => {
    if (membroParaExcluir) {
      setMembrosEquipe(membrosEquipe.filter(membro => membro.id !== membroParaExcluir.id));
      setMostrarModalExcluir(false);
      setMembroParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalExcluir(false);
    setMembroParaExcluir(null);
  };

  const handleSalvarConfiguracoes = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: configuracoes.nome,
        telefone: configuracoes.telefone,
        maxTicketsPorHora: configuracoes.capacidade, // Frontend usa 'capacidade', backend usa 'maxTicketsPorHora'
        precoFastlane: configuracoes.precoFastlane,
        maxReentradasPorDia: configuracoes.maxReentradasPorDia,
        mensagemBoasVindas: configuracoes.mensagemBoasVindas,
        horariosFuncionamento: configuracoes.horarios // Envia objeto de horários
      };
      
      console.log('➡️ Salvando configurações:', payload);
      
      await restauranteService.atualizarRestaurante(payload);
      
      console.log('✅ Configurações salvas com sucesso');
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      
      // Extrair mensagem de erro
      let mensagem = 'Erro ao salvar configurações. Tente novamente.';
      if (error.response?.data?.message) {
        mensagem = error.response.data.message;
      }
      
      alert(mensagem);
    }
  };

  const handleHorarioChange = (dia, campo, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia],
          [campo]: valor
        }
      }
    }));
  };

  const diasSemana = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/painel')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Equipe e Filas</h1>
                <p className="text-sm text-gray-600">Configure sua equipe e filas do restaurante</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setAbaAtiva('equipe')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'equipe'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4" />
              Equipe
            </button>
            <button
              onClick={() => setAbaAtiva('configuracoes')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'configuracoes'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aba Equipe */}
        {abaAtiva === 'equipe' && (
          <div className="bg-white rounded-xl shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Membros da Equipe</h2>
                  <p className="text-sm text-gray-600 mt-1">Gerencie os operadores e gerentes do restaurante</p>
                </div>
                <button
                  onClick={() => setMostrarModalOperador(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Adicionar Operador
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {membrosEquipe.map((membro) => (
                      <tr key={membro.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{membro.nome}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{membro.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            membro.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {membro.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => abrirModalExcluir(membro)}
                              className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                              title="Remover membro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* Aba Configurações */}
        {abaAtiva === 'configuracoes' && (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Básicas
              </h2>
              <form onSubmit={handleSalvarConfiguracoes} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Nome do Restaurante</label>
                    <input
                      type="text"
                      value={configuracoes.nome}
                      onChange={(e) => setConfiguracoes({...configuracoes, nome: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="Ex: Trattoria Bella Vista"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={configuracoes.slug}
                      onChange={(e) => setConfiguracoes({...configuracoes, slug: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50"
                      placeholder="trattoria-bella-vista"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={configuracoes.telefone}
                      onChange={(e) => setConfiguracoes({...configuracoes, telefone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="11987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Capacidade (mesas/pessoas)</label>
                    <input
                      type="number"
                      value={configuracoes.capacidade}
                      onChange={(e) => setConfiguracoes({...configuracoes, capacidade: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      placeholder="50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Endereço Completo</label>
                  <input
                    type="text"
                    value={configuracoes.endereco}
                    onChange={(e) => setConfiguracoes({...configuracoes, endereco: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="Rua Augusta, 1234 - São Paulo"
                  />
                </div>
              </form>
            </div>

            {/* Configurações de Fila */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Configurações de Fila
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Máx. Reentradas por Dia</label>
                  <input
                    type="number"
                    value={configuracoes.maxReentradasPorDia}
                    onChange={(e) => setConfiguracoes({...configuracoes, maxReentradasPorDia: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Preço Fast Lane (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.precoFastlane}
                    onChange={(e) => setConfiguracoes({...configuracoes, precoFastlane: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    placeholder="15.00"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">Mensagem de Boas-Vindas</label>
                <textarea
                  value={configuracoes.mensagemBoasVindas}
                  onChange={(e) => setConfiguracoes({...configuracoes, mensagemBoasVindas: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                  placeholder="Digite a mensagem que será exibida aos clientes ao entrar na fila"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta mensagem será exibida aos clientes quando entrarem na fila
                </p>
              </div>
            </div>

            {/* Horários de Funcionamento */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Funcionamento
              </h2>
              <div className="space-y-4">
                {diasSemana.map((dia) => (
                  <div key={dia.key} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-32">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={configuracoes.horarios[dia.key].aberto}
                          onChange={(e) => handleHorarioChange(dia.key, 'aberto', e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-900">{dia.label}</span>
                      </label>
                    </div>
                    {configuracoes.horarios[dia.key].aberto && (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={configuracoes.horarios[dia.key].inicio}
                          onChange={(e) => handleHorarioChange(dia.key, 'inicio', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                        />
                        <span className="text-gray-500">até</span>
                        <input
                          type="time"
                          value={configuracoes.horarios[dia.key].fim}
                          onChange={(e) => handleHorarioChange(dia.key, 'fim', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                        />
                      </div>
                    )}
                    {!configuracoes.horarios[dia.key].aberto && (
                      <span className="text-sm text-gray-500 italic">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end">
              <button
                onClick={handleSalvarConfiguracoes}
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-semibold shadow-md hover:shadow-lg"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar Operador */}
      {mostrarModalOperador && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 relative">
            <button
              onClick={() => setMostrarModalOperador(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Novo Membro da Equipe</h3>
            <form onSubmit={handleAdicionarMembro} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={novoMembro.nome}
                  onChange={(e) => setNovoMembro({...novoMembro, nome: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  value={novoMembro.email}
                  onChange={(e) => setNovoMembro({...novoMembro, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-600"
                  placeholder="joao.silva@restaurant.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Role</label>
                <select 
                  value={novoMembro.role}
                  onChange={(e) => setNovoMembro({...novoMembro, role: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-600 bg-white"
                >
                  <option value="OPERADOR">OPERADOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ADMIN tem acesso total, OPERADOR gerencia apenas filas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Senha Inicial</label>
                <input
                  type="password"
                  value={novoMembro.senha}
                  onChange={(e) => setNovoMembro({...novoMembro, senha: e.target.value})}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setMostrarModalOperador(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Salvar Membro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {mostrarModalExcluir && membroParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Remover Membro da Equipe</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover <span className="font-semibold text-gray-900">{membroParaExcluir.nome}</span> da equipe?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelarExclusao}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gerenciamento;
