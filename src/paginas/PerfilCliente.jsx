import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, TrendingUp, UserX, Edit2 } from 'lucide-react';

export default function PerfilCliente() {
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = () => {
    // Buscar dados do localStorage
    const clienteStorage = localStorage.getItem('cliente');
    if (clienteStorage) {
      const clienteData = JSON.parse(clienteStorage);
      setCliente(clienteData);
      setFormData({
        nomeCompleto: clienteData.nomeCompleto || 'Maria Silva',
        email: clienteData.email || 'maria.silva@email.com',
        telefone: clienteData.telefone || '(11) 98765-4321',
        cidade: clienteData.cidade || 'São Paulo',
        estado: clienteData.estado || 'SP'
      });
    } else {
      // Dados mockados - só para desenvolvimento
      const mockCliente = {
        nomeCompleto: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '(11) 98765-4321',
        cidade: 'São Paulo',
        estado: 'SP',
        isVip: true, // Mock sempre VIP para teste
        estatisticas: {
          totalVisitas: 24,
          vezesNaFastLane: 8,
          noShows: 0
        }
      };
      setCliente(mockCliente);
      setFormData({
        nomeCompleto: mockCliente.nomeCompleto,
        email: mockCliente.email,
        telefone: mockCliente.telefone,
        cidade: mockCliente.cidade,
        estado: mockCliente.estado
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSalvar = () => {
    // Atualizar localStorage
    const clienteAtualizado = {
      ...cliente,
      ...formData
    };
    localStorage.setItem('cliente', JSON.stringify(clienteAtualizado));
    setCliente(clienteAtualizado);
    setEditando(false);
  };

  const handleCancelar = () => {
    // Restaurar dados originais
    setFormData({
      nomeCompleto: cliente.nomeCompleto,
      email: cliente.email,
      telefone: cliente.telefone,
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/cliente/restaurantes')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          
          <h1 className="text-lg font-bold text-gray-900">Meu Perfil</h1>
          
          <div className="w-20"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Título e Subtítulo */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meu Perfil</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas informações e veja suas estatísticas
          </p>
        </div>

        {/* Banner VIP */}
        {cliente.isVip && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center">
                <Crown size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Cliente VIP</h3>
                <p className="text-sm text-gray-600">
                  Você tem acesso exclusivo ao Fast Lane em todos os restaurantes
                </p>
              </div>
            </div>
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
              Ativo
            </div>
          </div>
        )}

        {/* Estatísticas */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Suas Estatísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total de Visitas */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-pink-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Total de Visitas</p>
              <p className="text-3xl font-bold text-gray-900">
                {cliente.estatisticas?.totalVisitas || 24}
              </p>
            </div>

            {/* Vezes na Fast Lane */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Crown size={20} className="text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">Vezes na Fast Lane</p>
              <p className="text-3xl font-bold text-gray-900">
                {cliente.estatisticas?.vezesNaFastLane || 8}
              </p>
            </div>

            {/* No-Shows */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <UserX size={20} className="text-red-600" />
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">No-Shows</p>
              <p className="text-3xl font-bold text-gray-900">
                {cliente.estatisticas?.noShows || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Dados Pessoais */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Dados Pessoais</h3>
              <p className="text-sm text-gray-500">
                Gerencie suas informações de cadastro
              </p>
            </div>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
                Editar
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Nome Completo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formData.nomeCompleto}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {editando ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formData.email}
                  </p>
                )}
              </div>
            </div>

            {/* Telefone e Cidade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formData.telefone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                  />
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formData.cidade}
                  </p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                {editando ? (
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {formData.estado}
                  </p>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            {editando && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSalvar}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
                >
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
