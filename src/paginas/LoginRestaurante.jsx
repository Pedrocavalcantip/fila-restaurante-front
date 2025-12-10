import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Lock, Store, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginRestaurante() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const response = await authService.login({ 
        email, 
        senha, 
        restauranteSlug: slug 
      });
      const { token, usuario } = response;
      
      localStorage.removeItem('filaAtivaId');
      localStorage.removeItem('userRole');
      localStorage.removeItem('restauranteId');
      
      localStorage.setItem('token', token);
      localStorage.setItem('operadorLogado', JSON.stringify(usuario));
      localStorage.setItem('restauranteSlug', slug);
      
      if (usuario.restauranteId) {
        localStorage.setItem('restauranteId', usuario.restauranteId);
      }
      
      if (usuario.restaurante?.filaAtiva?.id) {
        localStorage.setItem('filaAtivaId', usuario.restaurante.filaAtiva.id);
      }

      const role = (usuario.role || usuario.papel)?.toUpperCase();
      localStorage.setItem('userRole', role);
      
      if (role === 'ADMIN') {
        navigate('/restaurante/painel');
      } else {
        navigate('/restaurante/painel-operador');
      }
    } catch (error) {
      logger.error('Erro ao fazer login:', error);
      let mensagem = 'Credenciais inválidas ou restaurante não encontrado.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data.message) {
          mensagem = data.message;
        } else if (data.erro) {
          mensagem = data.erro;
        }
      }
      
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Botão Voltar */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Voltar ao início</span>
        </Link>

        {/* Card de Login */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Área do Restaurante
            </h1>
            <p className="text-slate-400 text-sm">
              Acesse o painel de gestão
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-300 mb-2">
                Slug do Restaurante
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="slug"
                  type="text"
                  placeholder="meu-restaurante"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Ex: trattoria-bella-vista</p>
            </div>

            {/* Campo Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Link Recuperar Senha */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Esqueceu a senha? Entre em contato com o administrador
          </p>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-slate-800/50 text-slate-500 uppercase tracking-wider">Novo por aqui?</span>
            </div>
          </div>

          {/* Link Cadastro */}
          <Link 
            to="/restaurante/cadastro"
            className="block w-full text-center py-3 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 rounded-xl font-medium transition-all"
          >
            Cadastrar meu restaurante
          </Link>
        </div>
      </div>
    </div>
  );
}
