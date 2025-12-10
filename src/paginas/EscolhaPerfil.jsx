import { Users, Building2, Sparkles, ArrowRight, Utensils, Clock, Zap, UserCircle, UserSquareIcon, UsersIcon, Users2Icon, GitGraph, DatabaseIcon, BuildingIcon, StoreIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EscolhaPerfil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
             Sistema de Gestão de Filas
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Fast <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Lane</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Escolha como deseja acessar a plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Cliente */}
          <div 
            onClick={() => navigate('/cliente/login')}
            className="group bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1"
          >
            <div className="flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors text-center">
                Sou Cliente
              </h2>
              <p className="text-slate-400 mb-6 text-center">
                Encontre restaurantes, entre na fila e acompanhe seu atendimento em tempo real
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Utensils className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>Descubra restaurantes próximos</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>Acompanhe sua posição na fila</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-orange-400" />
                  </div>
                  <span>Receba notificações em tempo real</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/25">
                Acessar como Cliente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card Restaurante */}
          <div 
            onClick={() => navigate('/restaurante/login')}
            className="group bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
          >
            <div className="flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300 mx-auto">
                <StoreIcon className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors text-center">
                Sou Restaurante
              </h2>
              <p className="text-slate-400 mb-6 text-center">
                Gerencie suas filas, equipe e acompanhe métricas do seu negócio
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Gerencie filas em tempo real</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Controle sua equipe de operadores</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <DatabaseIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <span>Dashboard com analytics avançado</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                Acessar como Restaurante
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default EscolhaPerfil;
