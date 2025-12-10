import { Settings, UserCog, ArrowLeft, LogOut, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PainelAdministrativo() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpar TODOS os dados do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('operadorLogado');
    localStorage.removeItem('restauranteSlug');
    localStorage.removeItem('filaAtivaId');
    localStorage.removeItem('userRole');
    
    console.log('✅ Logout realizado - localStorage limpo');
    
    // Redirecionar para login
    navigate('/restaurante/login');
  };

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
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Início
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-colors text-sm font-medium"
              title="Sair da conta"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-lg text-gray-400">Selecione a área que deseja acessar</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card Gerenciamento */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Settings className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Gerenciamento</h2>
              <p className="text-gray-400 mb-8">
                Gerencie equipe, operadores e configurações do restaurante
              </p>
              <button
                onClick={() => navigate('/restaurante/gerenciamento')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/25"
              >
                Acessar Gerenciamento
              </button>
            </div>
          </div>

          {/* Card Painel do Operador */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6">
                <UserCog className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Painel do Operador</h2>
              <p className="text-gray-400 mb-8">
                Acesse a fila ao vivo para gerenciar clientes em tempo real
              </p>
              <button
                onClick={() => navigate('/restaurante/painel-operador')}
                className="w-full bg-transparent hover:bg-orange-500/10 text-orange-400 font-semibold py-4 px-6 rounded-xl border border-orange-500/50 hover:border-orange-500 transition-all"
              >
                Acessar Fila ao Vivo
              </button>
            </div>
          </div>

          {/* Card Dashboard */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 hover:border-green-500/30 transition-all hover:shadow-lg hover:shadow-green-500/5">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Dashboard</h2>
              <p className="text-gray-400 mb-8">
                Visualize estatísticas, receitas e métricas do restaurante
              </p>
              <button
                onClick={() => navigate('/restaurante/dashboard')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-green-500/25"
              >
                Ver Estatísticas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelAdministrativo;
