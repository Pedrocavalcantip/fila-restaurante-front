import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Users, Clock, MapPin, Phone, Mail, Store, Building2, X } from 'lucide-react';
import { restauranteService } from '../services/api';

export default function ConfiguracoesRestaurante() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [imagemFile, setImagemFile] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [uploadingImagem, setUploadingImagem] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    nome: '',
    telefone: '',
    imagem: '',
    maxTicketsPorHora: 50,
    precoFastlane: 15.00,
    maxReentradasPorDia: 3,
    mensagemBoasVindas: '',
    horariosFuncionamento: {}
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setLoading(true);
    try {
      const response = await restauranteService.buscarMeuRestaurante();
      setConfiguracoes({
        nome: response.nome || '',
        telefone: response.telefone || '',
        imagem: response.imagem || '',
        maxTicketsPorHora: response.maxTicketsPorHora || 50,
        precoFastlane: response.precoFastlane || 15.00,
        maxReentradasPorDia: response.maxReentradasPorDia || 3,
        mensagemBoasVindas: response.mensagemBoasVindas || '',
        horariosFuncionamento: response.horariosFuncionamento || {}
      });
      
      // Carregar preview da imagem existente
      if (response.imagem) {
        setImagemPreview(response.imagem);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      
      if (error.response?.status === 404) {
        alert('⚠️ Restaurante não encontrado.\n\nFaça logout e login novamente.');
      } else {
        alert('Erro ao carregar configurações. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (campo, valor) => {
    setConfiguracoes(prev => ({
      ...prev,
      [campo]: valor
    }));
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

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      // Validar se tem imagem
      if (!imagemFile && !configuracoes.imagem) {
        alert('Por favor, adicione uma imagem do restaurante');
        setSalvando(false);
        return;
      }

      // Se tem nova imagem, enviar FormData
      if (imagemFile) {
        const formData = new FormData();
        
        // Adicionar todos os campos
        formData.append('nome', configuracoes.nome);
        formData.append('telefone', configuracoes.telefone);
        formData.append('maxTicketsPorHora', configuracoes.maxTicketsPorHora);
        formData.append('precoFastlane', configuracoes.precoFastlane);
        formData.append('maxReentradasPorDia', configuracoes.maxReentradasPorDia);
        formData.append('mensagemBoasVindas', configuracoes.mensagemBoasVindas);
        formData.append('imagem', imagemFile);
        
        await restauranteService.atualizarRestaurante(formData);
      } else {
        // Sem imagem, enviar JSON normal
        await restauranteService.atualizarRestaurante(configuracoes);
      }
      
      alert('Configurações salvas com sucesso!');
      await carregarConfiguracoes(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando configurações...</p>
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
            onClick={() => navigate('/restaurante/painel-operador')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">Configurações do Restaurante</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSalvar} className="space-y-6">
          {/* Upload de Imagem */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Building2 size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Imagem do Restaurante *</h2>
            </div>

            {/* Preview da imagem */}
            {imagemPreview && (
              <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
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
                htmlFor="imagem-config" 
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${imagemPreview ? 'hidden' : ''}`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Building2 className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG ou WEBP (máx. 5MB)</p>
                </div>
                <input
                  id="imagem-config"
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

          {/* Informações Básicas */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Store size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Informações Básicas</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Restaurante *
                </label>
                <input
                  type="text"
                  value={configuracoes.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={configuracoes.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Precificação */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Precificação</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Fast Lane (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={configuracoes.precoFastlane}
                  onChange={(e) => handleChange('precoFastlane', parseFloat(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="15.00"
                />
                <p className="text-xs text-gray-500 mt-1">Valor cobrado para entrada prioritária</p>
              </div>
            </div>
          </div>

          {/* Limites e Capacidade */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Users size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Limites e Capacidade</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Tickets por Hora
                </label>
                <input
                  type="number"
                  value={configuracoes.maxTicketsPorHora}
                  onChange={(e) => handleChange('maxTicketsPorHora', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Capacidade de atendimento por hora</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de Reentradas por Dia
                </label>
                <input
                  type="number"
                  value={configuracoes.maxReentradasPorDia}
                  onChange={(e) => handleChange('maxReentradasPorDia', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Limite de vezes que um cliente pode entrar na fila no mesmo dia</p>
              </div>
            </div>
          </div>

          {/* Mensagem de Boas-Vindas */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Mail size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Mensagem de Boas-Vindas</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem Personalizada
              </label>
              <textarea
                value={configuracoes.mensagemBoasVindas}
                onChange={(e) => handleChange('mensagemBoasVindas', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                placeholder="Digite uma mensagem para seus clientes..."
              />
              <p className="text-xs text-gray-500 mt-1">Esta mensagem será exibida aos clientes ao entrar na fila</p>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={salvando}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {salvando ? 'Salvando...' : 'Salvar Configurações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
