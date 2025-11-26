import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import { restauranteService } from '../services/api';

export default function CadastroRestaurante() {
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    emailAdmin: '',
    senhaAdmin: '',
    precoFastlane: 15,
    maxReentradasPorDia: 3,
    cnpj: '',
    telefone: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: 'SP'
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-gerar slug a partir do nome
    if (name === 'nome') {
      const slugGerado = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      setFormData(prev => ({
        ...prev,
        nome: value,
        slug: slugGerado
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatTelefone = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const formatCEP = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 9);
  };

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value);
    setFormData(prev => ({ ...prev, cnpj: formatted }));
  };

  const handleTelefoneChange = (e) => {
    const formatted = formatTelefone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleCEPChange = (e) => {
    const formatted = formatCEP(e.target.value);
    setFormData(prev => ({ ...prev, cep: formatted }));
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nome.trim()) {
        setErro('Nome do restaurante é obrigatório');
        setLoading(false);
        return;
      }
      if (!formData.emailAdmin.trim()) {
        setErro('Email do administrador é obrigatório');
        setLoading(false);
        return;
      }
      if (!formData.senhaAdmin || formData.senhaAdmin.length < 8) {
        setErro('Senha deve ter no mínimo 8 caracteres');
        setLoading(false);
        return;
      }
      if (!formData.cidade.trim() || !formData.estado) {
        setErro('Cidade e estado são obrigatórios');
        setLoading(false);
        return;
      }

      // Preparar payload para o backend
      const payload = {
        nome: formData.nome.trim(),
        slug: formData.slug.trim(),
        emailAdmin: formData.emailAdmin.trim(),
        senhaAdmin: formData.senhaAdmin,
        precoFastlane: Number(formData.precoFastlane),
        precoVip: Number(formData.precoFastlane), // Usar mesmo valor do FastLane
        maxReentradasPorDia: Number(formData.maxReentradasPorDia),
        telefone: formData.telefone.replace(/\D/g, ''),
        cidade: formData.cidade.trim(),
        estado: formData.estado
      };

      console.log('➡️ Payload COMPLETO de cadastro:', JSON.stringify(payload, null, 2));
      console.log('📋 Validações DETALHADAS:');
      console.log('  - Nome:', payload.nome);
      console.log('  - Slug:', payload.slug);
      console.log('  - Email Admin:', payload.emailAdmin);
      console.log('  - Senha Admin:', payload.senhaAdmin ? '***' : 'VAZIO');
      console.log('  - Preço Fastlane (formData):', formData.precoFastlane, '(tipo:', typeof formData.precoFastlane + ')');
      console.log('  - Preço Fastlane (payload):', payload.precoFastlane, '(tipo:', typeof payload.precoFastlane + ')');
      console.log('  - Preço VIP (payload):', payload.precoVip, '(tipo:', typeof payload.precoVip + ')');
      console.log('  - Max Reentradas (formData):', formData.maxReentradasPorDia, '(tipo:', typeof formData.maxReentradasPorDia + ')');
      console.log('  - Max Reentradas (payload):', payload.maxReentradasPorDia, '(tipo:', typeof payload.maxReentradasPorDia + ')');
      console.log('  - Telefone (limpo):', payload.telefone);
      console.log('  - Cidade/Estado:', payload.cidade, '/', payload.estado);

      // Chamar API
      const response = await restauranteService.cadastrar(payload);
      
      console.log('✅ Restaurante cadastrado com sucesso!');
      console.log('📦 Response do backend:', JSON.stringify(response, null, 2));
      console.log('🔍 Verificar campos salvos:');
      if (response.restaurante) {
        console.log('  - maxReentradasPorDia salvo:', response.restaurante.maxReentradasPorDia);
        console.log('  - precoFastlane salvo:', response.restaurante.precoFastlane);
        console.log('  - precoVip salvo:', response.restaurante.precoVip);
        console.log('  - cidade salva:', response.restaurante.cidade);
        console.log('  - estado salvo:', response.restaurante.estado);
      }
      console.log('⚠️ NOTA: Se algum campo aparecer como "undefined", o backend salvou mas não retornou na resposta.');
      console.log('   O valor FOI SALVO no banco de dados, apenas não está sendo retornado aqui.');
      
      setSucesso(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        navigate('/restaurante/login');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Erro ao cadastrar restaurante:', error);
      console.error('❌ Response completo:', error.response);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Data:', error.response?.data);
      console.error('❌ Headers:', error.response?.headers);
      
      // Extrair mensagem de erro do backend
      let mensagem = 'Erro ao cadastrar restaurante. Tente novamente.';
      
      if (error.response?.data) {
        const data = error.response.data;
        console.log('📋 Tipo de erro:', typeof data);
        console.log('📋 Conteúdo do erro:', data);
        
        if (typeof data === 'string') {
          mensagem = data;
        } else if (data.message) {
          mensagem = data.message;
        } else if (data.erro) {
          mensagem = data.erro;
        } else if (data.error) {
          mensagem = data.error;
        } else if (data.errors) {
          // Se houver array de erros, mostrar todos
          mensagem = Array.isArray(data.errors) 
            ? data.errors.join(', ') 
            : JSON.stringify(data.errors);
        }
      }
      
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-2xl">
        {/* Botão Voltar */}
        <Link 
          to="/restaurante/login" 
          className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900 mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {/* Ícone de Restaurante */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Building2 size={32} className="text-orange-600" strokeWidth={2} />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            Cadastrar Restaurante
          </h1>
          <p className="text-center text-gray-500 text-sm mb-6">
            Preencha os dados abaixo para começar a gerenciar suas filas
          </p>

          {/* Mensagem de Sucesso */}
          {sucesso && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600 text-center font-medium">
                Restaurante cadastrado com sucesso! Redirecionando...
              </p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {erro && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{erro}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleCadastro} className="space-y-6">
            {/* DADOS DA EMPRESA */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Dados da Empresa
              </h2>
              
              <div className="space-y-4">
                {/* Nome do Restaurante */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Restaurante *
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Ex: Trattoria Bella Vista"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Slug (Auto-gerado) */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Identificador (Slug) *
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    placeholder="trattoria-bella-vista"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-700 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gerado automaticamente. Use apenas letras minúsculas, números e hífens.
                  </p>
                </div>

                {/* CNPJ e Telefone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ *
                    </label>
                    <input
                      id="cnpj"
                      name="cnpj"
                      type="text"
                      placeholder="00.000.000/0000-00"
                      value={formData.cnpj}
                      onChange={handleCNPJChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone Comercial *
                    </label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="text"
                      placeholder="(11) 98765-4321"
                      value={formData.telefone}
                      onChange={handleTelefoneChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CONFIGURAÇÕES DE FILA */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Configurações de Fila
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="precoFastlane" className="block text-sm font-medium text-gray-700 mb-1">
                      Preço Fast Lane (R$) *
                    </label>
                    <input
                      id="precoFastlane"
                      name="precoFastlane"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precoFastlane}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="maxReentradasPorDia" className="block text-sm font-medium text-gray-700 mb-1">
                      Max. Reentradas/Dia *
                    </label>
                    <input
                      id="maxReentradasPorDia"
                      name="maxReentradasPorDia"
                      type="number"
                      min="1"
                      value={formData.maxReentradasPorDia}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Defina os preços para as filas prioritárias e o limite de reentradas diárias por cliente.
                </p>
              </div>
            </div>

            {/* ENDEREÇO */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Endereço
              </h2>
              
              <div className="space-y-4">
                {/* CEP */}
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP *
                  </label>
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={handleCEPChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Rua e Número */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      id="rua"
                      name="rua"
                      type="text"
                      placeholder="Av. Paulista"
                      value={formData.rua}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      id="numero"
                      name="numero"
                      type="text"
                      placeholder="1000"
                      value={formData.numero}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Bairro */}
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro *
                  </label>
                  <input
                    id="bairro"
                    name="bairro"
                    type="text"
                    placeholder="Bela Vista"
                    value={formData.bairro}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* Cidade e Estado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
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
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* DADOS DO ADMINISTRADOR */}
            <div>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Dados do Administrador
              </h2>
              
              <div className="space-y-4">
                {/* Email de Acesso */}
                <div>
                  <label htmlFor="emailAdmin" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail do Administrador *
                  </label>
                  <input
                    id="emailAdmin"
                    name="emailAdmin"
                    type="email"
                    placeholder="admin@restaurante.com"
                    value={formData.emailAdmin}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este será o login do administrador principal
                  </p>
                </div>

                {/* Senha */}
                <div>
                  <label htmlFor="senhaAdmin" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha do Administrador *
                  </label>
                  <input
                    id="senhaAdmin"
                    name="senhaAdmin"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.senhaAdmin}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Use pelo menos 8 caracteres com letras e números
                  </p>
                </div>
              </div>
            </div>

            {/* Box de Benefícios */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-orange-600" />
                O que você terá acesso:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Painel completo para gerenciar filas em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sistema Fast-Lane para gerar receita adicional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Gestão de equipe e permissões</span>
                </li>
              </ul>
            </div>

            {/* Botão Criar Restaurante */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Criando...' : 'Criar Restaurante'}
            </button>
          </form>

          {/* Link para Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link 
              to="/restaurante/login" 
              className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
