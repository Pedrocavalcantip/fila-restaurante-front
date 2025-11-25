import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, DollarSign, Users, Clock, MapPin, Phone, Mail, Store } from 'lucide-react';

export default function ConfiguracoesRestaurante() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [configuracoes, setConfiguracoes] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    precoFastLane: '',
    limiteTicketsPorCliente: '',
    tempoToleranciaMinutos: '',
    mensagemBoasVindas: ''
  });

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    setLoading(true);
    try {
      // Simulação de dados mockados
      const configMock = {
        nomeFantasia: 'Restaurante Sabor & Arte',
        razaoSocial: 'Sabor & Arte Gastronomia Ltda',
        cnpj: '12.345.678/0001-90',
        telefone: '(11) 3456-7890',
        email: 'contato@saborarte.com.br',
        endereco: {
          logradouro: 'Rua das Flores',
          numero: '123',
          complemento: 'Loja 1',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        precoFastLane: '15.00',
        limiteTicketsPorCliente: '3',
        tempoToleranciaMinutos: '10',
        mensagemBoasVindas: 'Bem-vindo ao Restaurante Sabor & Arte! Aguarde ser chamado.'
      };
      
      setConfiguracoes(configMock);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (campo, valor) => {
    if (campo.includes('.')) {
      const [pai, filho] = campo.split('.');
      setConfiguracoes(prev => ({
        ...prev,
        [pai]: {
          ...prev[pai],
          [filho]: valor
        }
      }));
    } else {
      setConfiguracoes(prev => ({
        ...prev,
        [campo]: valor
      }));
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    
    try {
      // Aqui faria a chamada para a API
      // await restauranteService.atualizar(configuracoes);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const mascaraCNPJ = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const mascaraTelefone = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const mascaraCEP = (valor) => {
    return valor
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
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
          {/* Informações da Empresa */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Store size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Informações da Empresa</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Fantasia *
                </label>
                <input
                  type="text"
                  value={configuracoes.nomeFantasia}
                  onChange={(e) => handleChange('nomeFantasia', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razão Social *
                </label>
                <input
                  type="text"
                  value={configuracoes.razaoSocial}
                  onChange={(e) => handleChange('razaoSocial', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ *
                </label>
                <input
                  type="text"
                  value={configuracoes.cnpj}
                  onChange={(e) => handleChange('cnpj', mascaraCNPJ(e.target.value))}
                  placeholder="00.000.000/0000-00"
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
                  onChange={(e) => handleChange('telefone', mascaraTelefone(e.target.value))}
                  placeholder="(00) 0000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={configuracoes.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Endereço</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logradouro *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.logradouro}
                  onChange={(e) => handleChange('endereco.logradouro', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.numero}
                  onChange={(e) => handleChange('endereco.numero', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.complemento}
                  onChange={(e) => handleChange('endereco.complemento', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.bairro}
                  onChange={(e) => handleChange('endereco.bairro', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.cidade}
                  onChange={(e) => handleChange('endereco.cidade', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.estado}
                  onChange={(e) => handleChange('endereco.estado', e.target.value)}
                  maxLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  value={configuracoes.endereco.cep}
                  onChange={(e) => handleChange('endereco.cep', mascaraCEP(e.target.value))}
                  placeholder="00000-000"
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
                  value={configuracoes.precoFastLane}
                  onChange={(e) => handleChange('precoFastLane', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="15.00"
                />
                <p className="text-xs text-gray-500 mt-1">Valor cobrado para entrada prioritária</p>
              </div>
            </div>
          </div>

          {/* Limites e Tolerâncias */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Limites e Tolerâncias</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de Tickets por Cliente
                </label>
                <input
                  type="number"
                  value={configuracoes.limiteTicketsPorCliente}
                  onChange={(e) => handleChange('limiteTicketsPorCliente', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">Máximo de tickets ativos simultaneamente</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo de Tolerância (minutos)
                </label>
                <input
                  type="number"
                  value={configuracoes.tempoToleranciaMinutos}
                  onChange={(e) => handleChange('tempoToleranciaMinutos', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Tempo após chamada antes de marcar No-Show</p>
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
