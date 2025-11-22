import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, Phone, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PainelOperador() {
  const navigate = useNavigate();
  const [fila, setFila] = useState([]);
  const [loading, setLoading] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  // Simular dados da fila
  useEffect(() => {
    carregarFila();
  }, []);

  const carregarFila = async () => {
    setLoading(true);
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const filaMock = [
        {
          id: 1,
          cliente: 'João Silva',
          telefone: '(11) 98765-4321',
          tipo: 'NORMAL',
          posicao: 1,
          tempoEspera: '5 min',
          horarioEntrada: '19:30',
          status: 'AGUARDANDO'
        },
        {
          id: 2,
          cliente: 'Maria Santos',
          telefone: '(11) 98765-1234',
          tipo: 'FAST_LANE',
          posicao: 2,
          tempoEspera: '3 min',
          horarioEntrada: '19:35',
          status: 'AGUARDANDO'
        },
        {
          id: 3,
          cliente: 'Carlos Oliveira',
          telefone: '(11) 98765-5678',
          tipo: 'NORMAL',
          posicao: 3,
          tempoEspera: '12 min',
          horarioEntrada: '19:32',
          status: 'AGUARDANDO'
        },
        {
          id: 4,
          cliente: 'Ana Paula',
          telefone: '(11) 98765-9999',
          tipo: 'NORMAL',
          posicao: 4,
          tempoEspera: '18 min',
          horarioEntrada: '19:28',
          status: 'AGUARDANDO'
        }
      ];
      
      setFila(filaMock);
    } catch (error) {
      console.error('Erro ao carregar fila:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarFila = async () => {
    setAtualizando(true);
    await carregarFila();
    setAtualizando(false);
  };

  const chamarCliente = (clienteId) => {
    // Lógica para chamar o próximo cliente
    console.log('Chamando cliente:', clienteId);
    // Aqui você pode adicionar notificação, SMS, etc.
  };

  const atenderCliente = (clienteId) => {
    setFila(fila.filter(item => item.id !== clienteId));
    console.log('Cliente atendido:', clienteId);
  };

  const removerCliente = (clienteId) => {
    setFila(fila.filter(item => item.id !== clienteId));
    console.log('Cliente removido:', clienteId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/restaurante/painel')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fila ao Vivo</h1>
                <p className="text-sm text-gray-600">Gerencie os clientes em tempo real</p>
              </div>
            </div>
            <button
              onClick={atualizarFila}
              disabled={atualizando}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${atualizando ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total na Fila</p>
                <p className="text-3xl font-bold text-gray-900">{fila.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tempo Médio</p>
                <p className="text-3xl font-bold text-gray-900">8 min</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Atendidos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista da Fila */}
        <div className="bg-white rounded-xl shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Clientes Aguardando</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Carregando fila...</p>
            </div>
          ) : fila.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum cliente na fila no momento</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {fila.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Posição */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-orange-600">{item.posicao}</span>
                        </div>
                      </div>

                      {/* Informações do Cliente */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{item.cliente}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.tipo === 'FAST_LANE' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {item.tipo === 'FAST_LANE' ? 'Fast Lane' : 'Normal'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{item.telefone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Entrou às {item.horarioEntrada}</span>
                          </div>
                          <span className="font-medium text-orange-600">
                            Aguardando {item.tempoEspera}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => chamarCliente(item.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Chamar
                      </button>
                      <button
                        onClick={() => atenderCliente(item.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Atender
                      </button>
                      <button
                        onClick={() => removerCliente(item.id)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PainelOperador;
