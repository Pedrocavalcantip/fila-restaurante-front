import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { X, AlertCircle, Flame } from 'lucide-react';
import { clienteService } from '../services/api';

export default function EntrarNaFila() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const restaurante = location.state?.restaurante;
  const prioridadeInicial = location.state?.prioridade || 'NORMAL';

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
      const payload = {
        quantidadePessoas: quantidadePessoas,
        prioridade: prioridadeInicial,
        observacoes: observacoes || undefined // Enviar apenas se preenchido
      };

      logger.log('📤 Entrando na fila:', { slug, payload });
      
      const response = await clienteService.entrarNaFila(slug, payload);
      
      logger.log('✅ Ticket criado:', response);
      
      // Redirecionar para acompanhar fila
      navigate('/cliente/meu-ticket');
    } catch (error) {
      logger.error('❌ Erro ao entrar na fila:', error);
      const mensagem = error.response?.data?.message || 'Erro ao entrar na fila. Tente novamente.';
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  if (!restaurante) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 max-w-md w-full text-center">
          <p className="text-gray-400 mb-4">Restaurante não encontrado</p>
          <button
            onClick={() => navigate('/cliente/restaurantes')}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Voltar para restaurantes
          </button>
        </div>
      </div>
    );
  }

  const isFastLane = prioridadeInicial === 'FAST_LANE';
  const valorFastLane = restaurante?.precoFastlane || 15.00;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800/50">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-800/50">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              {isFastLane ? (
                <>
                  <Flame size={24} className="text-orange-400" />
                  Entrada Fast Lane
                </>
              ) : (
                'Entrar na Fila Normal'
              )}
            </h2>
            <p className="text-sm text-gray-400 mt-1">{restaurante.nome}</p>
          </div>
          <button
            onClick={handleCancelar}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-5">
          {/* Quantidade de Pessoas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Quantidade de Pessoas <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantidadePessoas}
              onChange={(e) => setQuantidadePessoas(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo de 1 pessoa</p>
          </div>

          {/* Observações */}
          <div>
            <label htmlFor="observacoes" className="block text-sm font-medium text-gray-300 mb-2">
              Observações <span className="text-gray-500">(Opcional)</span>
            </label>
            <textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Cadeira de bebê, aniversário, etc."
              rows={3}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm text-white placeholder:text-gray-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Adicione informações relevantes para o restaurante
            </p>
          </div>

          {/* Box de Valor Fast Lane */}
          {isFastLane && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-300">Valor Fast Lane</p>
                <p className="text-lg font-bold text-orange-400">
                  R$ {valorFastLane.toFixed(2)}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                Pagamento processado após confirmação
              </p>
            </div>
          )}

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{erro}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancelar}
              disabled={loading}
              className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/25"
            >
              {loading ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
