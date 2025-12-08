import { Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function EscolhaPerfil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Fila ao Vivo</h1>
          <p className="text-xl text-gray-600">Escolha como deseja acessar a plataforma</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card Cliente */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow h-full">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sou Cliente</h2>
              <p className="text-gray-600 mb-8 flex-grow">
                Quero encontrar restaurantes e acompanhar minha fila
              </p>
              <button
                onClick={() => navigate('/cliente/login')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Acessar Área do Cliente
              </button>
            </div>
          </div>

          {/* Card Restaurante */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow h-full">
            <div className="flex flex-col items-center text-center h-full">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-10 h-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Sou Restaurante</h2>
              <p className="text-gray-600 mb-8 flex-grow">
                Quero gerenciar filas, equipe e ver analytics
              </p>
              <button
                onClick={() => navigate('/restaurante/login')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
              >
                Acessar Área do Restaurante
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EscolhaPerfil;
