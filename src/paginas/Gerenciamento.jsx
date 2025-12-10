import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Trash2, User, Settings, DollarSign, Clock, Building2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { restauranteService } from '../services/api';

function Gerenciamento() {
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState('equipe'); // 'equipe' ou 'configuracoes'
  const [loading, setLoading] = useState(true);
  
  // Estados para upload de imagem
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  
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
    cidade: '',
    estado: '',
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
    console.log('🔄 [Gerenciamento] Iniciando carregamento de dados...');
    setLoading(true);
    
    try {
      console.log('📡 [Gerenciamento] Buscando dados do restaurante...');
      const response = await restauranteService.buscarMeuRestaurante();
      console.log('📦 [Gerenciamento] Response completo:', response);
      
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
        cidade: rest.cidade || '',
        estado: rest.estado || '',
        capacidade: rest.maxTicketsPorHora || 50, // Backend usa maxTicketsPorHora
        precoFastlane: rest.precoFastlane || rest.precoFastLane || 15.00,
        maxReentradasPorDia: rest.maxReentradasPorDia || 3,
        mensagemBoasVindas: rest.mensagemBoasVindas || '',
        horarios: horariosParsed
      });
      
      // Carregar equipe do backend
      try {
        const equipeResponse = await restauranteService.listarEquipe();
        setMembrosEquipe(equipeResponse.equipe || []);
        console.log('✅ Equipe carregada:', equipeResponse.equipe);
        console.log('📊 Total de membros:', equipeResponse.total);
      } catch (error) {
        console.error('❌ Erro ao carregar equipe:', error);
        
        // Se a rota não existir (404), mostrar aviso mas não bloquear
        if (error.response?.status === 404) {
          console.warn('⚠️ Rota /restaurantes/equipe não implementada no backend');
          console.warn('⚠️ A funcionalidade de equipe estará temporariamente indisponível');
        }
        
        setMembrosEquipe([]);
      }
    } catch (error) {
      console.error('❌ [Gerenciamento] Erro ao carregar dados:', error);
      console.error('❌ [Gerenciamento] Error response:', error.response);
      console.error('❌ [Gerenciamento] Error status:', error.response?.status);
      console.error('❌ [Gerenciamento] Error data:', error.response?.data);
      
      // Se for 404, pode ser token antigo
      if (error.response?.status === 404) {
        alert('⚠️ Restaurante não encontrado.\n\nIsso pode acontecer se você está usando um token antigo.\nFaça logout e login novamente.');
      } else {
        alert(`❌ Erro ao carregar dados: ${error.response?.data?.message || error.message || 'Erro desconhecido'}`);
      }
    } finally {
      console.log('✅ [Gerenciamento] Carregamento finalizado (loading = false)');
      setLoading(false);
    }
  };

  const handleAdicionarMembro = async (e) => {
    e.preventDefault();
    
    try {
      console.log('➡️ Criando operador:', novoMembro);
      
      // Integração com backend
      const response = await restauranteService.criarOperador({
        nome: novoMembro.nome,
        email: novoMembro.email,
        senha: novoMembro.senha
      });
      
      console.log('✅ Resposta do backend:', response);
      
      // Adicionar à lista local
      setMembrosEquipe([...membrosEquipe, response.operador]);
      setNovoMembro({ nome: '', email: '', senha: '', role: 'OPERADOR' });
      setMostrarModalOperador(false);
      
      alert(`✅ ${response.mensagem || 'Operador criado com sucesso!'}`);
    } catch (error) {
      console.error('❌ Erro ao criar operador:', error);
      const mensagem = error.response?.data?.message || 'Erro ao criar operador. Tente novamente.';
      alert(mensagem);
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return;
    }

    setImagemFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagemPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoverImagem = () => {
    setImagemFile(null);
    setImagemPreview(configuracoes.imagem || null);
  };

  const abrirModalExcluir = (membro) => {
    setMembroParaExcluir(membro);
    setMostrarModalExcluir(true);
  };

  const confirmarExclusao = async () => {
    if (membroParaExcluir) {
      try {
        // Verificar se é ADMIN (não pode deletar)
        if (membroParaExcluir.papel === 'ADMIN') {
          alert('❌ Não é possível excluir um administrador.');
          cancelarExclusao();
          return;
        }

        await restauranteService.deletarOperador(membroParaExcluir.id);
        console.log('✅ Operador deletado:', membroParaExcluir.id);
        
        // Remover da lista local
        setMembrosEquipe(membrosEquipe.filter(membro => membro.id !== membroParaExcluir.id));
        setMostrarModalExcluir(false);
        setMembroParaExcluir(null);
        
        alert('✅ Operador removido com sucesso!');
      } catch (error) {
        console.error('❌ Erro ao deletar operador:', error);
        const mensagem = error.response?.data?.message || 'Erro ao remover operador. Tente novamente.';
        alert(mensagem);
      }
    }
  };

  const cancelarExclusao = () => {
    setMostrarModalExcluir(false);
    setMembroParaExcluir(null);
  };

  const handleSalvarConfiguracoes = async (e) => {
    e.preventDefault();
    try {
      // Validar se tem imagem (required)
      if (!imagemFile && !configuracoes.imagem) {
        alert('Por favor, adicione uma imagem do restaurante');
        return;
      }

      // Se tem nova imagem, enviar FormData
      if (imagemFile) {
        const formData = new FormData();
        
        // Adicionar todos os campos
        formData.append('nome', configuracoes.nome);
        formData.append('telefone', configuracoes.telefone);
        formData.append('maxTicketsPorHora', configuracoes.capacidade);
        formData.append('precoFastlane', configuracoes.precoFastlane);
        formData.append('maxReentradasPorDia', configuracoes.maxReentradasPorDia);
        formData.append('mensagemBoasVindas', configuracoes.mensagemBoasVindas);
        formData.append('imagem', imagemFile);
        
        console.log('➡️ Salvando configurações com imagem (FormData)');
        await restauranteService.atualizarRestaurante(formData);
      } else {
        // Sem imagem nova, enviar JSON normal
        const payload = {
          nome: configuracoes.nome,
          telefone: configuracoes.telefone,
          maxTicketsPorHora: configuracoes.capacidade,
          precoFastlane: configuracoes.precoFastlane,
          maxReentradasPorDia: configuracoes.maxReentradasPorDia,
          mensagemBoasVindas: configuracoes.mensagemBoasVindas,
          horariosFuncionamento: configuracoes.horarios
        };
        
        console.log('➡️ Salvando configurações:', payload);
        await restauranteService.atualizarRestaurante(payload);
      }
      
      console.log('✅ Configurações salvas com sucesso');
      alert('Configurações salvas com sucesso!');
      await carregarDados(); // Recarregar dados
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

  // Tela de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dados do gerenciamento...</p>
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
      <div className="relative bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/painel')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Gerenciamento de Equipe e Filas</h1>
                <p className="text-sm text-gray-400">Configure sua equipe e filas do restaurante</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-gray-900/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setAbaAtiva('equipe')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'equipe'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              Equipe
            </button>
            <button
              onClick={() => setAbaAtiva('configuracoes')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${
                abaAtiva === 'configuracoes'
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configurações
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aba Equipe */}
        {abaAtiva === 'equipe' && (
          <>
            
            {/* Lista da Equipe */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl">
              <div className="px-6 py-4 border-b border-gray-800/50 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">Membros da Equipe</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Gerencie os operadores e gerentes do restaurante</p>
                  </div>
                  <button
                    onClick={() => setMostrarModalOperador(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-orange-500/25"
                  >
                    <UserPlus className="w-4 h-4" />
                    Adicionar Operador
                  </button>
                </div>

              <div className="overflow-x-auto">
                {membrosEquipe.length === 0 ? (
                  <div className="text-center py-12 bg-gray-800/30 rounded-b-2xl">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhum membro na equipe
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      A rota de listagem de equipe ainda não está implementada no backend.
                    </p>
                    <p className="text-xs text-gray-500">
                      Implemente GET /api/v1/restaurantes/equipe no backend para ver a lista.
                    </p>
                  </div>
                ) : (
                <table className="w-full">
                  <thead className="bg-gray-800/50 border-b border-gray-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {membrosEquipe.map((membro) => (
                      <tr key={membro.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-white">{membro.nome}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-400">{membro.email}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            (membro.papel || membro.role) === 'ADMIN'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {membro.papel || membro.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => abrirModalExcluir(membro)}
                              className="p-2 text-gray-500 hover:text-red-400 transition-colors"
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
                )}
              </div>
            </div>
          </>
        )}

        {/* Aba Configurações */}
        {abaAtiva === 'configuracoes' && (
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-orange-400" />
                Informações Básicas
              </h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nome do Restaurante</label>
                    <input
                      type="text"
                      value={configuracoes.nome}
                      onChange={(e) => setConfiguracoes({...configuracoes, nome: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder:text-gray-500"
                      placeholder="Ex: Trattoria Bella Vista"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={configuracoes.slug}
                      onChange={(e) => setConfiguracoes({...configuracoes, slug: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                      placeholder="trattoria-bella-vista"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Capacidade (tickets/hora)</label>
                    <input
                      type="number"
                      value={configuracoes.capacidade}
                      onChange={(e) => setConfiguracoes({...configuracoes, capacidade: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cidade</label>
                    <input
                      type="text"
                      value={configuracoes.cidade}
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                      placeholder="Recife"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                    <input
                      type="text"
                      value={configuracoes.estado}
                      className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                      placeholder="PE"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Cidade e Estado foram definidos no cadastro do restaurante e não podem ser alterados.
                </p>
              </div>
            </div>

            {/* Upload de Imagem do Restaurante */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                Imagem do Restaurante *
              </h2>

              {/* Preview da imagem */}
              {imagemPreview && (
                <div className="mb-4 relative w-full h-48 rounded-xl overflow-hidden border border-gray-700">
                  <img 
                    src={imagemPreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoverImagem}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
                    title="Remover imagem"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {/* Input de arquivo */}
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="imagem-gerenciamento" 
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-800/30 hover:bg-gray-800/50 transition-colors ${imagemPreview ? 'hidden' : ''}`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Building2 className="w-10 h-10 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG ou WEBP (máx. 5MB)</p>
                  </div>
                  <input
                    id="imagem-gerenciamento"
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImagemChange}
                  />
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                <strong>* Campo obrigatório:</strong> A imagem será exibida na lista de restaurantes disponíveis para os clientes
              </p>
            </div>

            {/* Configurações de Fila */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-400" />
                Configurações de Fila
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Máx. Reentradas por Dia</label>
                  <input
                    type="number"
                    value={configuracoes.maxReentradasPorDia}
                    onChange={(e) => setConfiguracoes({...configuracoes, maxReentradasPorDia: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Preço Fast Lane (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={configuracoes.precoFastlane}
                    onChange={(e) => setConfiguracoes({...configuracoes, precoFastlane: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                    placeholder="15.00"
                  />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensagem de Boas-Vindas</label>
                <textarea
                  value={configuracoes.mensagemBoasVindas}
                  onChange={(e) => setConfiguracoes({...configuracoes, mensagemBoasVindas: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder:text-gray-500 resize-none"
                  placeholder="Digite a mensagem que será exibida aos clientes ao entrar na fila"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta mensagem será exibida aos clientes quando entrarem na fila
                </p>
              </div>
            </div>

            {/* Horários de Funcionamento */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Horários de Funcionamento
              </h2>
              <div className="space-y-4">
                {diasSemana.map((dia) => (
                  <div key={dia.key} className="flex items-center gap-4 pb-4 border-b border-gray-800/50 last:border-0">
                    <div className="w-32">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={configuracoes.horarios[dia.key].aberto}
                          onChange={(e) => handleHorarioChange(dia.key, 'aberto', e.target.checked)}
                          className="w-4 h-4 text-orange-500 border-gray-600 rounded focus:ring-orange-500 bg-gray-800"
                        />
                        <span className="text-sm font-medium text-white">{dia.label}</span>
                      </label>
                    </div>
                    {configuracoes.horarios[dia.key].aberto && (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={configuracoes.horarios[dia.key].inicio}
                          onChange={(e) => handleHorarioChange(dia.key, 'inicio', e.target.value)}
                          className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white text-sm"
                        />
                        <span className="text-gray-500">até</span>
                        <input
                          type="time"
                          value={configuracoes.horarios[dia.key].fim}
                          onChange={(e) => handleHorarioChange(dia.key, 'fim', e.target.value)}
                          className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white text-sm"
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
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-orange-500/25"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar Operador */}
      {mostrarModalOperador && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-xl max-w-lg w-full p-8 relative border border-gray-800/50">
            <button
              onClick={() => setMostrarModalOperador(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Adicionar Novo Membro da Equipe</h3>
            <form onSubmit={handleAdicionarMembro} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={novoMembro.nome}
                  onChange={(e) => setNovoMembro({...novoMembro, nome: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder:text-gray-500"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={novoMembro.email}
                  onChange={(e) => setNovoMembro({...novoMembro, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder:text-gray-500"
                  placeholder="joao.silva@restaurant.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select 
                  value={novoMembro.role}
                  onChange={(e) => setNovoMembro({...novoMembro, role: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white"
                >
                  <option value="OPERADOR">OPERADOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  ADMIN tem acesso total, OPERADOR gerencia apenas filas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Senha Inicial</label>
                <input
                  type="password"
                  value={novoMembro.senha}
                  onChange={(e) => setNovoMembro({...novoMembro, senha: e.target.value})}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-white placeholder:text-gray-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setMostrarModalOperador(false)}
                  className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-orange-500/25"
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8 relative border border-gray-800/50">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Remover Membro da Equipe</h3>
              <p className="text-gray-400 mb-6">
                Tem certeza que deseja remover <span className="font-semibold text-white">{membroParaExcluir.nome}</span> da equipe?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelarExclusao}
                  className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl transition-all font-medium shadow-lg shadow-red-500/25"
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
