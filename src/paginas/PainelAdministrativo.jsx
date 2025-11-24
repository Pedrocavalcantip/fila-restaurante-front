import { Settings, UserCog, ArrowLeft, Tv, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PainelAdministrativo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-lg text-gray-600">Selecione a área que deseja acessar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card Gerenciamento */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Gerenciamento</h2>
              <p className="text-gray-600 mb-8">
                Gerencie equipe, operadores e configurações de filas
              </p>
              <button
                onClick={() => navigate('/restaurante/gerenciamento')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Acessar Gerenciamento
              </button>
            </div>
          </div>

          {/* Card Painel do Operador */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <UserCog className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Painel do Operador</h2>
              <p className="text-gray-600 mb-8">
                Acesse a fila ao vivo para gerenciar clientes em tempo real
              </p>
              <button
                onClick={() => navigate('/restaurante/painel-operador')}
                className="w-full bg-white hover:bg-gray-50 text-orange-600 font-semibold py-4 px-6 rounded-xl border-2 border-orange-600 transition-colors"
              >
                Acessar Fila ao Vivo
              </button>
            </div>
          </div>

          {/* Card Configurações */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Configurações</h2>
              <p className="text-gray-600 mb-8">
                Configure preços, limites e informações do restaurante
              </p>
              <button
                onClick={() => navigate('/restaurante/configuracoes')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Acessar Configurações
              </button>
            </div>
          </div>

          {/* Card Histórico */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <History className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Histórico</h2>
              <p className="text-gray-600 mb-8">
                Consulte o histórico completo de todos os tickets
              </p>
              <button
                onClick={() => navigate('/restaurante/historico-tickets')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Ver Histórico
              </button>
            </div>
          </div>

          {/* Card Painel Público */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow md:col-span-2">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Tv className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Painel Público (TV)</h2>
              <p className="text-gray-600 mb-8">
                Display para TV mostrando tickets chamados em tempo real
              </p>
              <button
                onClick={() => navigate('/publico/painel')}
                className="max-w-md mx-auto w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Abrir Painel Público
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelAdministrativo;
