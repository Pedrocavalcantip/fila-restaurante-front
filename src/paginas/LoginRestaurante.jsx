import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { authService } from '../services/api';

export default function LoginRestaurante() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [restauranteSlug, setRestauranteSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // TODO: Integrar com API POST /auth/login
      // Body: { email, senha, restauranteSlug }
      // Response: { token, usuario: { id, nome, email, role, restaurante } }
      
      // Credenciais de teste
      const usuariosTest = {
        'admin@trattoria.com': {
          senha: 'admin123',
          role: 'ADMIN',
          nome: 'Administrador Principal'
        },
        'operador@trattoria.com': {
          senha: 'operador123',
          role: 'OPERADOR',
          nome: 'Operador de Filas'
        }
      };

      const usuarioTest = usuariosTest[email.toLowerCase()];
      
      if (!usuarioTest || usuarioTest.senha !== senha || restauranteSlug !== 'trattoria-bella-vista') {
        throw new Error('Credenciais inválidas');
      }

      const mockToken = 'mock-token-' + Date.now();
      const mockUsuario = {
        id: 'user-' + Date.now(),
        nome: usuarioTest.nome,
        email: email,
        role: usuarioTest.role,
        restaurante: {
          id: 'rest-123',
          nome: 'Trattoria Bella Vista',
          slug: restauranteSlug
        }
      };

      localStorage.setItem('token', mockToken);
      localStorage.setItem('usuario', JSON.stringify(mockUsuario));

      // Redirecionar baseado no role
      if (mockUsuario.role === 'ADMIN') {
        navigate('/restaurante/painel');
      } else {
        navigate('/restaurante/painel-operador');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErro('Credenciais inválidas. Verifique seus dados e tente novamente.');
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

          {/* Box de Credenciais de Teste */}
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs font-semibold text-blue-900 mb-2">🧪 Credenciais de Teste:</p>
            <div className="space-y-2 text-xs text-blue-800">
              <div className="bg-white bg-opacity-60 rounded p-2">
                <p className="font-medium">ADMIN:</p>
                <p>Email: admin@trattoria.com</p>
                <p>Senha: admin123</p>
              </div>
              <div className="bg-white bg-opacity-60 rounded p-2">
                <p className="font-medium">OPERADOR:</p>
                <p>Email: operador@trattoria.com</p>
                <p>Senha: operador123</p>
              </div>
              <p className="text-center mt-2">Slug: <code className="bg-blue-100 px-1 rounded">trattoria-bella-vista</code></p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="funcionario@restaurante.com"
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

            {/* Campo Slug do Restaurante */}
            <div>
              <label 
                htmlFor="restauranteSlug" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Identificador do Restaurante
              </label>
              <input
                id="restauranteSlug"
                type="text"
                placeholder="trattoria-bella-vista"
                value={restauranteSlug}
                onChange={(e) => setRestauranteSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Slug único do seu restaurante (fornecido no cadastro)
              </p>
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
