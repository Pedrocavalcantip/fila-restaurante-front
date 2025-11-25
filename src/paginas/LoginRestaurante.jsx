import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
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
      console.log('➡️ Payload de login:', { email, senha, restauranteSlug: slug });
      // Integração com backend
      const response = await authService.login({ 
        email, 
        senha, 
        restauranteSlug: slug 
      });
      const { token, usuario } = response;
      
      // Salvar token e dados do usuário (usa 'token' unificado)
      localStorage.setItem('token', token);
      localStorage.setItem('operadorLogado', JSON.stringify(usuario));
      localStorage.setItem('restauranteSlug', slug);
      
      // CRÍTICO: Salvar filaId para o PainelOperador funcionar
      if (usuario.restaurante?.filaAtiva?.id) {
        localStorage.setItem('filaAtivaId', usuario.restaurante.filaAtiva.id);
        console.log('✅ FilaId salvo:', usuario.restaurante.filaAtiva.id);
      } else {
        console.warn('⚠️ AVISO: filaAtiva.id não encontrado na resposta do backend');
      }

      console.log('✅ Login realizado com sucesso:', usuario);
      console.log('📌 Role:', usuario.role);
      console.log('📌 Papel:', usuario.papel);
      console.log('📌 Usuario completo:', JSON.stringify(usuario, null, 2));

      // Redirecionar baseado no role/papel (backend usa 'papel', normaliza para maiúsculo)
      const role = (usuario.role || usuario.papel)?.toUpperCase();
      
      // Salvar role no localStorage para uso futuro
      localStorage.setItem('userRole', role);
      
      if (role === 'ADMIN') {
        console.log('🔀 Redirecionando para: /restaurante/painel (Admin)');
        navigate('/restaurante/painel'); // Painel Administrativo
      } else if (role === 'OPERADOR') {
        console.log('🔀 Redirecionando para: /restaurante/painel-operador (Operador)');
        navigate('/restaurante/painel-operador'); // Painel do Operador
      } else {
        console.warn('⚠️ Role desconhecido:', role, '- Redirecionando para painel operador');
        navigate('/restaurante/painel-operador'); // Fallback
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      // Extrair mensagem de erro do backend (sempre string)
      let mensagem = 'Credenciais inválidas ou restaurante não encontrado.';
      
      if (error.response?.data) {
        const data = error.response.data;
        // Tenta extrair a mensagem de diferentes formatos
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data.message) {
          mensagem = data.message;
        } else if (data.erro) {
          mensagem = data.erro;
        } else if (data.error) {
          mensagem = data.error;
        }
      }
      
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900 mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>

        {/* Card de Login */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Ícone de Restaurante */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Building2 size={32} className="text-orange-600" strokeWidth={2} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Entrar no Sistema
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Acesse o painel do seu restaurante
          </p>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Campo Slug do Restaurante */}
            <div>
              <label 
                htmlFor="slug" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Slug do Restaurante
              </label>
              <input
                id="slug"
                type="text"
                placeholder="meu-restaurante"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ex: trattoria-bella-vista
              </p>
            </div>

            {/* Campo Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label 
                htmlFor="senha" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Link para Recuperar Senha */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Esqueceu a senha? Entre em contato com o administrador
          </p>

          {/* Separador */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 mb-3">
              NOVO POR AQUI?
            </p>
            <Link 
              to="/restaurante/cadastro"
              className="block text-center text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Quer cadastrar seu restaurante? Clique aqui
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
