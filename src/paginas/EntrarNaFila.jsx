import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';

export default function EntrarNaFila() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const restaurante = location.state?.restaurante;
  const tipoFilaInicial = location.state?.tipoFila || 'NORMAL';

  const [quantidadePessoas, setQuantidadePessoas] = useState(1);
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleCancelar = () => {
    navigate('/cliente/restaurantes');
  };

  const handleConfirmar = async () => {
    setErro('');
    setLoading(true);

    try {
      // Simular entrada na fila
      const ticketMock = {
        id: 'ticket-' + Date.now(),
        numero: Math.floor(Math.random() * 9000) + 1000,
        status: 'AGUARDANDO',
        tipoFila: tipoFilaInicial,
        posicaoAtual: tipoFilaInicial === 'FAST_LANE' ? 2 : 8,
        quantidadePessoas: quantidadePessoas,
        tempoEstimadoMinutos: tipoFilaInicial === 'FAST_LANE' ? 10 : 25,
        observacoes: observacoes,
        restaurante: restaurante || {
          nome: 'Restaurante',
          slug: slug
        }
      };

      // Salvar no localStorage para simular
      localStorage.setItem('ticketAtivo', JSON.stringify(ticketMock));

      // Redirecionar para acompanhar fila
      navigate('/cliente/meu-ticket');
    } catch (error) {
      console.error('Erro ao entrar na fila:', error);
      setErro('Erro ao entrar na fila. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!restaurante) {
    return (
      <div className="min-h-screen bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <p className="text-gray-600 mb-4">Restaurante não encontrado</p>
          <button
            onClick={() => navigate('/cliente/restaurantes')}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Voltar para restaurantes
          </button>
        </div>
      </div>
    );
  }

  const isFastLane = tipoFilaInicial === 'FAST_LANE';
  const valorFastLane = 15.00;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isFastLane ? 'Entrada VIP / Fast Lane' : 'Entrar na Fila Normal'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{restaurante.nome}</p>
          </div>
          <button
            onClick={handleCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Quantidade de Pessoas */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantidade de Pessoas <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantidadePessoas}
              onChange={(e) => setQuantidadePessoas(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo de 1 pessoa</p>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-900 mb-2">
              Observações <span className="text-gray-400">(Opcional)</span>
            </label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Cadeira de bebê, aniversário, etc."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-sm text-gray-900 placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adicione informações relevantes para o restaurante
            </p>
          </div>

          {/* Box de Valor Fast Lane */}
          {isFastLane && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-900">Valor Fast Lane</p>
                <p className="text-lg font-bold text-orange-600">
                  R$ {valorFastLane.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-600">
                Pagamento processado após confirmação
              </p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{erro}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancelar}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium text-sm transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md font-medium text-sm transition-colors disabled:opacity-50"
            >
              {loading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
