/**
 * Componente que exibe o status da conexão WebSocket
 * @param {Object} props
 * @param {boolean} props.isConnected - Status da conexão
 * @param {Error|null} props.error - Erro de conexão (se houver)
 */
export default function WebSocketStatus({ isConnected, error }) {
  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-medium">Tempo Real Ativo</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <span className="font-medium">Sem conexão em tempo real</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-yellow-600">
      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
      <span className="font-medium">Conectando...</span>
    </div>
  );
}
