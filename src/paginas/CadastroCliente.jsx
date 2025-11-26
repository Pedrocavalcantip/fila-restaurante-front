import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { clienteService } from '../services/api';

export default function CadastroCliente() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    cpf: '',
    cidade: '',
    estado: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setLoading(true);

    try {
      // Validações no frontend
      if (formData.senha.length < 8) {
        setErro('Senha deve ter no mínimo 8 caracteres');
        setLoading(false);
        return;
      }

      // Integração com backend
      const payload = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        cpf: formData.cpf,
        cidade: formData.cidade,
        estado: formData.estado
      };
      
      console.log('➡️ Payload de cadastro cliente:', payload);
      console.log('📋 Validações:');
      console.log('  - Nome:', payload.nome);
      console.log('  - Email:', payload.email);
      console.log('  - Senha (tamanho):', payload.senha.length, 'caracteres');
      console.log('  - CPF:', payload.cpf);
      console.log('  - Telefone:', payload.telefone);
      console.log('  - Cidade/Estado:', payload.cidade, '/', payload.estado);
      
      const response = await clienteService.cadastrar(payload);
      const { token, cliente } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('clienteLogado', JSON.stringify(cliente));
      console.log('✅ Cliente cadastrado e logado:', cliente);
      setSucesso(true);
      setTimeout(() => navigate('/cliente/restaurantes'), 1500);
      
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error);
      console.error('❌ Response:', error.response?.data);
      
      // Extrair mensagem de erro
      let mensagem = 'Erro ao criar conta. Verifique os dados e tente novamente.';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data.message) {
          mensagem = data.message;
        } else if (data.errors && Array.isArray(data.errors)) {
          mensagem = data.errors.map(e => e.message).join(', ');
        }
      }
      
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Botão Voltar */}
        <Link 
          to="/cliente/login" 
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900 mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Ícone de Usuários */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Users size={32} className="text-orange-600" strokeWidth={2} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Criar Conta
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Crie sua conta para encontrar restaurantes
          </p>

          {/* Mensagem de Sucesso */}
          {sucesso && (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600 text-center">
                Conta criada com sucesso! Entrando...
              </p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleCadastro} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label 
                htmlFor="nome" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="João Silva"
                value={formData.nome}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Telefone */}
            <div>
              <label 
                htmlFor="telefone" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                placeholder="(11) 98765-4321"
                value={formData.telefone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* CPF */}
            <div>
              <label 
                htmlFor="cpf" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CPF
              </label>
              <input
                id="cpf"
                name="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
                required
                maxLength={14}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Senha */}
            <div>
              <label 
                htmlFor="senha" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>

            {/* Cidade */}
            <div>
              <label 
                htmlFor="cidade" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cidade
              </label>
              <input
                id="cidade"
                name="cidade"
                type="text"
                placeholder="São Paulo"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Estado */}
            <div>
              <label 
                htmlFor="estado" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
              >
                <option value="">Selecione o estado</option>
                <option value="AC">Acre</option>
                <option value="AL">Alagoas</option>
                <option value="AP">Amapá</option>
                <option value="AM">Amazonas</option>
                <option value="BA">Bahia</option>
                <option value="CE">Ceará</option>
                <option value="DF">Distrito Federal</option>
                <option value="ES">Espírito Santo</option>
                <option value="GO">Goiás</option>
                <option value="MA">Maranhão</option>
                <option value="MT">Mato Grosso</option>
                <option value="MS">Mato Grosso do Sul</option>
                <option value="MG">Minas Gerais</option>
                <option value="PA">Pará</option>
                <option value="PB">Paraíba</option>
                <option value="PR">Paraná</option>
                <option value="PE">Pernambuco</option>
                <option value="PI">Piauí</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="RN">Rio Grande do Norte</option>
                <option value="RS">Rio Grande do Sul</option>
                <option value="RO">Rondônia</option>
                <option value="RR">Roraima</option>
                <option value="SC">Santa Catarina</option>
                <option value="SP">São Paulo</option>
                <option value="SE">Sergipe</option>
                <option value="TO">Tocantins</option>
              </select>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={loading || sucesso}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 text-sm"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Link Já tem conta */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link 
              to="/cliente/login" 
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
