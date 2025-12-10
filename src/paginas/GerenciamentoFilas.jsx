import { useState, useEffect } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { restauranteService } from '../services/api';

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
      // Buscar dados do restaurante do backend
      const response = await restauranteService.buscarMeuRestaurante();
      const rest = response.restaurante || response;
      
      console.log('✅ Dados do restaurante carregados:', rest);
      
      setRestaurante(rest);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/gerenciamento')}
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
              onClick={() => navigate('/restaurante/gerenciamento')}
              className="py-4 px-2 font-medium border-b-2 border-transparent text-gray-400 hover:text-white transition-colors"
            >
              Equipe
            </button>
            <button
              className="py-4 px-2 font-medium border-b-2 border-orange-500 text-orange-400 transition-colors"
            >
              Filas
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informação sobre a Fila Única */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
          <AlertCircle size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300 mb-1">Fila Única do Sistema</p>
            <p className="text-xs text-blue-400/80">
              A fila padrão foi criada automaticamente no cadastro do restaurante. 
              O preço de Fast Lane é uma configuração global do restaurante.
            </p>
          </div>
        </div>

        {/* Configurações de Preços */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl mb-6">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-xl font-bold text-white">Configurações de Preços</h2>
            <p className="text-sm text-gray-400 mt-1">Valores aplicados a todas as filas prioritárias</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preço Fast Lane (R$)
                </label>
                <input
                  type="number"
                  value={restaurante?.precoFastlane || 0}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Fila rápida com prioridade</p>
              </div>
                <p className="text-xs text-gray-500 mt-1">Prioridade máxima</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max. Reentradas/Dia
                </label>
                <input
                  type="number"
                  value={restaurante?.maxReentradasPorDia || 0}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Limite por cliente</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-800/30 rounded-xl">
              <p className="text-xs text-gray-400">
                💡 <strong className="text-gray-300">Nota:</strong> Essas configurações foram definidas no cadastro do restaurante. 
                Para alterá-las, entre em contato com o suporte ou atualize via API.
              </p>
            </div>
          </div>
        </div>

        {/* Fila Ativa */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl">
          <div className="p-6 border-b border-gray-800/50">
            <h2 className="text-xl font-bold text-white">Fila do Restaurante</h2>
            <p className="text-sm text-gray-400 mt-1">Informações da fila principal</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tickets Ativos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Tempo Médio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {restaurante?.filas?.map((fila) => (
                  <tr key={fila.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-white">{fila.nome}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">{fila.ticketsAtivos} pessoas</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-400">{fila.tempoMedioEspera} min</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
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
  );
}

export default GerenciamentoFilas;
