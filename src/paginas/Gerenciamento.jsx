import { useState } from 'react';
import { ArrowLeft, UserPlus, Edit2, Trash2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Gerenciamento() {
  const navigate = useNavigate();
  
  // Dados mock da equipe
  const [membrosEquipe, setMembrosEquipe] = useState([
    {
      id: 1,
      nome: 'Carlos Silva',
      email: 'carlos.silva@restaurant.com',
      cargo: 'Operador'
    },
    {
      id: 2,
      nome: 'Ana Martins',
      email: 'ana.martins@restaurant.com',
      cargo: 'Operador'
    },
    {
      id: 3,
      nome: 'João Santos',
      email: 'joao.santos@restaurant.com',
      cargo: 'Gerente'
    },
    {
      id: 4,
      nome: 'Mariana Costa',
      email: 'mariana.costa@restaurant.com',
      cargo: 'Operador'
    }
  ]);

  const [mostrarModalOperador, setMostrarModalOperador] = useState(false);

  const removerMembro = (id) => {
    setMembrosEquipe(membrosEquipe.filter(membro => membro.id !== id));
  };

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
              className="py-4 px-2 font-medium border-b-2 border-orange-600 text-orange-600 transition-colors"
            >
              Equipe
            </button>
            <button
              onClick={() => navigate('/restaurante/gerenciamento/filas')}
              className="py-4 px-2 font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors"
            >
              Filas
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Aba Equipe */}
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
                      Cargo
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
                          membro.cargo === 'Gerente'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {membro.cargo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removerMembro(membro.id)}
                            className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
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
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nome Completo</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-600"
                  placeholder="joao.silva@restaurant.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Cargo</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-600 bg-white">
                  <option value="">Selecione o cargo</option>
                  <option value="operador">Operador</option>
                  <option value="gerente">Gerente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Criar Senha</label>
                <input
                  type="password"
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
    </div>
  );
}

export default Gerenciamento;
