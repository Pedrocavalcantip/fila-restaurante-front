import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  DollarSign, 
  Calendar,
  UserCheck,
  UserX,
  Zap,
  Star,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  Target,
  Award,
  Crown,
  Timer,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Coffee,
  ChefHat,
  Utensils,
  Eye,
  Phone,
  Mail,
  CalendarDays,
  Percent,
  PieChart,
  LineChart
} from 'lucide-react';
import { ticketService } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [estatisticas, setEstatisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('hoje');
  const [animacaoAtiva, setAnimacaoAtiva] = useState(false);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useEffect(() => {
    // Animação de entrada
    if (estatisticas) {
      setAnimacaoAtiva(true);
    }
  }, [estatisticas]);

  const carregarEstatisticas = async () => {
    try {
      setLoading(true);
      setErro('');
      const dados = await ticketService.buscarEstatisticas();
      setEstatisticas(dados);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setErro('Erro ao carregar estatísticas. Verifique suas permissões.');
    } finally {
      setLoading(false);
    }
  };

  const getDadosPeriodo = () => {
    if (!estatisticas) return null;
    switch (periodoSelecionado) {
      case '7dias':
        return estatisticas.ultimos7Dias;
      case '30dias':
        return estatisticas.ultimos30Dias;
      default:
        return estatisticas.hoje;
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarNumero = (valor) => {
    return new Intl.NumberFormat('pt-BR').format(valor || 0);
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatarDataCompleta = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      day: '2-digit', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular variação percentual (mock para demonstração visual)
  const getVariacao = (valor) => {
    // Em produção, comparar com período anterior
    const variacoes = [12, -5, 8, 15, -3, 20, 7, -10, 25, 18];
    return variacoes[Math.abs(valor) % variacoes.length];
  };

  const dados = getDadosPeriodo();

  // Calcular máximo para o gráfico
  const maxGrafico = useMemo(() => {
    if (!estatisticas?.graficos?.ticketsPorDia) return 1;
    return Math.max(...estatisticas.graficos.ticketsPorDia.map(d => d.total || 0), 1);
  }, [estatisticas]);

  // Calcular porcentagens para o gráfico de pizza
  const pizzaData = useMemo(() => {
    if (!dados) return [];
    const total = (dados.ticketsFastLane || 0) + (dados.ticketsVip || 0) + (dados.ticketsNormais || 0);
    if (total === 0) return [];
    return [
      { label: 'Fast Lane', valor: dados.ticketsFastLane || 0, percent: ((dados.ticketsFastLane || 0) / total * 100).toFixed(1), cor: '#f97316' },
      { label: 'VIP', valor: dados.ticketsVip || 0, percent: ((dados.ticketsVip || 0) / total * 100).toFixed(1), cor: '#8b5cf6' },
      { label: 'Normal', valor: dados.ticketsNormais || 0, percent: ((dados.ticketsNormais || 0) / total * 100).toFixed(1), cor: '#6b7280' },
    ];
  }, [dados]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-500/30 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-transparent border-t-orange-500 rounded-full animate-spin absolute top-0"></div>
            <BarChart3 className="w-8 h-8 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-400 mt-6 text-lg">Carregando estatísticas...</p>
          <div className="flex gap-1 justify-center mt-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-red-500/20 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
          <p className="text-slate-400 mb-6">{erro}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={carregarEstatisticas}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-all"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white">Dashboard</h1>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-sm text-slate-400">Estatísticas em tempo real</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Período Seletor com Design Premium */}
              <div className="hidden sm:flex bg-slate-800/50 rounded-xl p-1 border border-slate-700/50">
                {[
                  { id: 'hoje', label: 'Hoje', icon: Calendar },
                  { id: '7dias', label: '7 Dias', icon: CalendarDays },
                  { id: '30dias', label: '30 Dias', icon: Activity }
                ].map((periodo) => (
                  <button
                    key={periodo.id}
                    onClick={() => setPeriodoSelecionado(periodo.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      periodoSelecionado === periodo.id
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <periodo.icon className="w-4 h-4" />
                    {periodo.label}
                  </button>
                ))}
              </div>

              <button
                onClick={carregarEstatisticas}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all group border border-slate-700/50"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Period Selector */}
      <div className="sm:hidden px-4 py-3 flex gap-2 overflow-x-auto">
        {[
          { id: 'hoje', label: 'Hoje' },
          { id: '7dias', label: '7 Dias' },
          { id: '30dias', label: '30 Dias' }
        ].map((periodo) => (
          <button
            key={periodo.id}
            onClick={() => setPeriodoSelecionado(periodo.id)}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              periodoSelecionado === periodo.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
            }`}
          >
            {periodo.label}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Hero Stats - Cards Principais */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 transition-all duration-700 ${animacaoAtiva ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Card Receita Total - Destaque */}
          <div className="lg:col-span-2 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-2xl p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Receita Total</p>
                  <h2 className="text-4xl font-bold text-white tracking-tight">
                    {formatarMoeda(dados?.receitaTotal)}
                  </h2>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-white" />
                    <span className="text-xs text-orange-100">Fast Lane</span>
                  </div>
                  <p className="text-lg font-bold text-white">{formatarMoeda(dados?.receitaFastLane)}</p>
                </div>
                <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-xs text-orange-100">VIP</span>
                  </div>
                  <p className="text-lg font-bold text-white">{formatarMoeda(dados?.receitaVip)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Tickets */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-blue-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                getVariacao(dados?.totalTickets) >= 0 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {getVariacao(dados?.totalTickets) >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(getVariacao(dados?.totalTickets))}%
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Total Tickets</p>
            <p className="text-3xl font-bold text-white">{formatarNumero(dados?.totalTickets)}</p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                {dados?.finalizados || 0}
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <XCircle className="w-3 h-3" />
                {dados?.cancelados || 0}
              </span>
            </div>
          </div>

          {/* Pessoas Atendidas */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-purple-500/10">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                getVariacao(dados?.totalPessoasAtendidas) >= 0 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {getVariacao(dados?.totalPessoasAtendidas) >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(getVariacao(dados?.totalPessoasAtendidas))}%
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Pessoas Atendidas</p>
            <p className="text-3xl font-bold text-white">{formatarNumero(dados?.totalPessoasAtendidas)}</p>
            <p className="mt-3 text-xs text-slate-500">
              Média: <span className="text-purple-400 font-medium">{(dados?.mediaPessoasPorTicket || 0).toFixed(1)}</span> por ticket
            </p>
          </div>
        </div>

        {/* Segunda Linha - Performance */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 transition-all duration-700 delay-100 ${animacaoAtiva ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Taxa de Conversão */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-slate-400 text-sm">Conversão</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-white">{(dados?.taxaConversao || 0).toFixed(1)}</p>
              <span className="text-emerald-500 text-lg font-medium mb-0.5">%</span>
            </div>
            {/* Mini Progress Bar */}
            <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(dados?.taxaConversao || 0, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Tempo Médio Espera */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Timer className="w-5 h-5 text-yellow-500" />
              </div>
              <span className="text-slate-400 text-sm">Espera Média</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-white">{dados?.tempoMedioEspera || 0}</p>
              <span className="text-yellow-500 text-sm font-medium mb-0.5">min</span>
            </div>
          </div>

          {/* Tempo Médio Atendimento */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5 text-cyan-500" />
              </div>
              <span className="text-slate-400 text-sm">Atendimento</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-white">{dados?.tempoMedioAtendimento || 0}</p>
              <span className="text-cyan-500 text-sm font-medium mb-0.5">min</span>
            </div>
          </div>

          {/* No-Shows */}
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 hover:border-red-500/50 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-slate-400 text-sm">No-Shows</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-white">{dados?.noShows || 0}</p>
              <span className="text-red-400 text-xs font-medium mb-0.5">({(dados?.taxaNoShow || 0).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 transition-all duration-700 delay-200 ${animacaoAtiva ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Gráfico de Barras - Tickets por Dia */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Tickets por Dia</h3>
                  <p className="text-xs text-slate-400">Últimos 7 dias</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-400">Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-400">Finalizados</span>
                </div>
              </div>
            </div>
            
            {estatisticas?.graficos?.ticketsPorDia ? (
              <div className="relative h-64">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-slate-700/50 border-dashed"></div>
                  ))}
                </div>
                
                {/* Bars */}
                <div className="relative h-full flex items-end justify-between gap-2 pt-6">
                  {estatisticas.graficos.ticketsPorDia.slice(-7).map((dia, index) => {
                    const alturaTotal = (dia.total / maxGrafico) * 100;
                    const alturaFinalizado = (dia.finalizados / maxGrafico) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex flex-col items-center" style={{ height: '180px' }}>
                          {/* Tooltip */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 whitespace-nowrap border border-slate-700">
                            <p className="text-white text-xs font-medium">{dia.total} tickets</p>
                            <p className="text-emerald-400 text-xs">{dia.finalizados} finalizados</p>
                            <p className="text-orange-400 text-xs">{formatarMoeda(dia.receita)}</p>
                          </div>
                          
                          {/* Bar Container */}
                          <div className="w-full h-full flex items-end justify-center gap-1">
                            {/* Total Bar */}
                            <div 
                              className="w-5 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-md transition-all duration-500 hover:from-orange-500 hover:to-amber-400"
                              style={{ height: `${Math.max(alturaTotal, 2)}%` }}
                            ></div>
                            {/* Finalizados Bar */}
                            <div 
                              className="w-5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all duration-500 hover:from-emerald-500 hover:to-teal-400"
                              style={{ height: `${Math.max(alturaFinalizado, 2)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{formatarData(dia.data)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                <p>Nenhum dado disponível</p>
              </div>
            )}
          </div>

          {/* Status Atual & Prioridades */}
          <div className="space-y-6">
            {/* Status Atual - Cards Animados */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Status Atual
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl p-4 border border-yellow-500/20 group hover:border-yellow-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-yellow-400 font-medium">Aguardando</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dados?.aguardando || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-500/20 group hover:border-blue-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-400 font-medium">Atendimento</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dados?.emAtendimento || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 group hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-400 font-medium">Finalizados</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dados?.finalizados || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl p-4 border border-red-500/20 group hover:border-red-500/50 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-400 font-medium">Cancelados</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{dados?.cancelados || 0}</p>
                </div>
              </div>
            </div>

            {/* Distribuição por Prioridade */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Por Prioridade
              </h3>
              <div className="space-y-3">
                {/* Fast Lane */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">Fast Lane</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{dados?.ticketsFastLane || 0}</p>
                      <p className="text-xs text-orange-400">{formatarMoeda(dados?.receitaFastLane)}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${pizzaData.find(d => d.label === 'Fast Lane')?.percent || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* VIP */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">VIP</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{dados?.ticketsVip || 0}</p>
                      <p className="text-xs text-purple-400">{formatarMoeda(dados?.receitaVip)}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                      style={{ width: `${pizzaData.find(d => d.label === 'VIP')?.percent || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Normal */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-300 font-medium">Normal</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{dados?.ticketsNormais || 0}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-slate-500 to-slate-400 rounded-full transition-all duration-1000"
                      style={{ width: `${pizzaData.find(d => d.label === 'Normal')?.percent || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Clientes */}
        {estatisticas?.clientes?.topClientes && estatisticas.clientes.topClientes.length > 0 && (
          <div className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-700 delay-300 ${animacaoAtiva ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Top Clientes</h3>
                    <p className="text-xs text-slate-400">Clientes mais frequentes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{estatisticas.clientes.total}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                    <Crown className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">{estatisticas.clientes.vips} VIPs</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-900/50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">#</th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Visitas</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fast Lane</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">VIP</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">No-Shows</th>
                    <th className="text-center py-4 px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {estatisticas.clientes.topClientes.slice(0, 10).map((cliente, index) => (
                    <tr 
                      key={cliente.id} 
                      className="border-t border-slate-700/30 hover:bg-slate-700/20 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {cliente.nomeCompleto?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover:text-orange-400 transition-colors">
                              {cliente.nomeCompleto}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Phone className="w-3 h-3" />
                              {cliente.telefone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="text-lg font-bold text-white">{cliente.totalVisitas}</span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-500/10 text-orange-400 rounded-lg text-sm font-medium">
                          <Zap className="w-3 h-3" />
                          {cliente.totalFastLane}
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/10 text-purple-400 rounded-lg text-sm font-medium">
                          <Crown className="w-3 h-3" />
                          {cliente.totalVip || 0}
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                          cliente.totalNoShows > 0 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-slate-700/50 text-slate-500'
                        }`}>
                          {cliente.totalNoShows}
                        </span>
                      </td>
                      <td className="text-center py-4 px-6">
                        {cliente.isVip ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-bold rounded-full border border-purple-500/30">
                            <Crown className="w-3 h-3" />
                            VIP
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Regular</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {estatisticas?.geradoEm && (
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" />
              Dados atualizados em {formatarDataCompleta(estatisticas.geradoEm)}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
