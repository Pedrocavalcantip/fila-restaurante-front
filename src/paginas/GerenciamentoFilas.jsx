import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function GerenciamentoFilas() {
  const navigate = useNavigate();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carregarDados = async () => {
    try {
      // TODO: Integrar com API GET /restaurantes/meu-restaurante
      // A fila padrão é criada automaticamente no cadastro
      const mockRestaurante = {
        id: 'rest-123',
        nome: 'Trattoria Bella Vista',
        slug: 'trattoria-bella-vista',
        precoFastlane: 15.00,
        precoVip: 25.00,
        maxReentradasPorDia: 3,
        tempoMedioAtendimento: 15,
        status: 'ATIVO',
        filas: [
          {
            id: 'fila-123',
            nome: 'Fila Principal',
            status: 'ATIVA',
            ticketsAtivos: 12,
            tempoMedioEspera: 20
          }
        ]
      };
      
      setRestaurante(mockRestaurante);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/gerenciamento')}
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
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => navigate('/restaurante/gerenciamento')}
              className="py-4 px-2 font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 transition-colors"
            >
              Equipe
            </button>
            <button
              className="py-4 px-2 font-medium border-b-2 border-orange-600 text-orange-600 transition-colors"
            >
              Filas
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informação sobre a Fila Única */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">Fila Única do Sistema</p>
            <p className="text-xs text-blue-700">
              A fila padrão foi criada automaticamente no cadastro do restaurante. 
              Os preços de Fast Lane e VIP são configurações globais do restaurante.
            </p>
          </div>
        </div>

        {/* Configurações de Preços */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Configurações de Preços</h2>
            <p className="text-sm text-gray-600 mt-1">Valores aplicados a todas as filas prioritárias</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço Fast Lane (R$)
                </label>
                <input
                  type="number"
                  value={restaurante?.precoFastlane || 0}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Fila rápida com prioridade</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço VIP (R$)
                </label>
                <input
                  type="number"
                  value={restaurante?.precoVip || 0}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Prioridade máxima</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max. Reentradas/Dia
                </label>
                <input
                  type="number"
                  value={restaurante?.maxReentradasPorDia || 0}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Limite por cliente</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                💡 <strong>Nota:</strong> Essas configurações foram definidas no cadastro do restaurante. 
                Para alterá-las, entre em contato com o suporte ou atualize via API.
              </p>
            </div>
          </div>
        </div>

        {/* Fila Ativa */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Fila do Restaurante</h2>
            <p className="text-sm text-gray-600 mt-1">Informações da fila principal</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Tickets Ativos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Tempo Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restaurante?.filas?.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{fila.nome}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{fila.ticketsAtivos} pessoas</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{fila.tempoMedioEspera} min</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                        {fila.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GerenciamentoFilas;
