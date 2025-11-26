import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Users, Clock, MapPin, Phone, Mail, Store } from 'lucide-react';
import { restauranteService } from '../services/api';

export default function ConfiguracoesRestaurante() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    nome: '',
    telefone: '',
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
        maxTicketsPorHora: response.maxTicketsPorHora || 50,
        precoFastlane: response.precoFastlane || 15.00,
        maxReentradasPorDia: response.maxReentradasPorDia || 3,
        mensagemBoasVindas: response.mensagemBoasVindas || '',
        horariosFuncionamento: response.horariosFuncionamento || {}
      });
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      alert('Erro ao carregar configurações. Tente novamente.');
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

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      await restauranteService.atualizarRestaurante(configuracoes);
      alert('Configurações salvas com sucesso!');
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
