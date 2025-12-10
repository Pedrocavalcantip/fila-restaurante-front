import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Lock, Phone, User, MapPin, CreditCard, Loader2, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
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
      if (formData.senha.length < 8) {
        setErro('Senha deve ter no mínimo 8 caracteres');
        setLoading(false);
        return;
      }

      const payload = {
        nomeCompleto: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        senha: formData.senha,
        cpf: formData.cpf,
        cidade: formData.cidade,
        estado: formData.estado
      };
      
      const response = await clienteService.cadastrar(payload);
      const { token, cliente } = response;
      localStorage.setItem('token', token);
      localStorage.setItem('clienteLogado', JSON.stringify(cliente));
      setSucesso(true);
      setTimeout(() => navigate('/cliente/restaurantes'), 1500);
      
    } catch (error) {
      console.error('❌ Erro ao cadastrar:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="w-full max-w-lg relative z-10 py-8">
        {/* Botão Voltar */}
        <Link 
          to="/cliente/login" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Voltar ao login</span>
        </Link>

        {/* Card de Cadastro */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Criar Conta
            </h1>
            <p className="text-slate-400 text-sm">
              Crie sua conta para encontrar restaurantes
            </p>
          </div>

          {/* Mensagem de Sucesso */}
          {sucesso && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <p className="text-sm text-emerald-400">Conta criada com sucesso! Entrando...</p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleCadastro} className="space-y-4">
            {/* Nome Completo */}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Grid 2 colunas */}
            <div className="grid grid-cols-2 gap-4">
              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-slate-300 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    placeholder="Digite seu telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-slate-300 mb-2">
                  CPF
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="Digite seu CPF"
                    value={formData.cpf}
                    onChange={handleChange}
                    required
                    maxLength={14}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Mínimo de 8 caracteres</p>
            </div>

            {/* Grid Cidade/Estado */}
            <div className="grid grid-cols-3 gap-4">
              {/* Cidade */}
              <div className="col-span-2">
                <label htmlFor="cidade" className="block text-sm font-medium text-slate-300 mb-2">
                  Cidade
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    placeholder="Recife"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-slate-300 mb-2">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all text-white appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-800">UF</option>
                  <option value="AC" className="bg-slate-800">AC</option>
                  <option value="AL" className="bg-slate-800">AL</option>
                  <option value="AP" className="bg-slate-800">AP</option>
                  <option value="AM" className="bg-slate-800">AM</option>
                  <option value="BA" className="bg-slate-800">BA</option>
                  <option value="CE" className="bg-slate-800">CE</option>
                  <option value="DF" className="bg-slate-800">DF</option>
                  <option value="ES" className="bg-slate-800">ES</option>
                  <option value="GO" className="bg-slate-800">GO</option>
                  <option value="MA" className="bg-slate-800">MA</option>
                  <option value="MT" className="bg-slate-800">MT</option>
                  <option value="MS" className="bg-slate-800">MS</option>
                  <option value="MG" className="bg-slate-800">MG</option>
                  <option value="PA" className="bg-slate-800">PA</option>
                  <option value="PB" className="bg-slate-800">PB</option>
                  <option value="PR" className="bg-slate-800">PR</option>
                  <option value="PE" className="bg-slate-800">PE</option>
                  <option value="PI" className="bg-slate-800">PI</option>
                  <option value="RJ" className="bg-slate-800">RJ</option>
                  <option value="RN" className="bg-slate-800">RN</option>
                  <option value="RS" className="bg-slate-800">RS</option>
                  <option value="RO" className="bg-slate-800">RO</option>
                  <option value="RR" className="bg-slate-800">RR</option>
                  <option value="SC" className="bg-slate-800">SC</option>
                  <option value="SP" className="bg-slate-800">SP</option>
                  <option value="SE" className="bg-slate-800">SE</option>
                  <option value="TO" className="bg-slate-800">TO</option>
                </select>
              </div>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={loading || sucesso}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/50 text-slate-500">ou</span>
            </div>
          </div>

          {/* Link Já tem conta */}
          <p className="text-center text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link 
              to="/cliente/login" 
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
            >
              Entre aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
