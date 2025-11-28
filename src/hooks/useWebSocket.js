import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { publicoService } from '../services/api';

/**
 * Hook para gerenciar conexão WebSocket com o backend
 * @param {Object} options - Opções de configuração
 * @param {string} options.restauranteSlug - Slug do restaurante para buscar o ID
 * @param {string} [options.apiUrl] - URL base do backend (padrão: http://localhost:3000)
 * @param {boolean} [options.autoConnect] - Conectar automaticamente (padrão: true)
 * @returns {Object} { socket, isConnected, error, on, off, emit }
 */
export const useWebSocket = ({
  restauranteSlug,
  apiUrl = 'http://localhost:3000',
  autoConnect = true
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!autoConnect || !restauranteSlug) return;

    let socket = null;

    // Função assíncrona para buscar o restauranteId e conectar
    const conectarWebSocket = async () => {
      try {
        // 1. Buscar restaurante por slug para obter o ID
        console.log(`🔍 Buscando restaurante por slug: ${restauranteSlug}`);
        const response = await publicoService.buscarRestaurantePorSlug(restauranteSlug);
        const restauranteId = response.restaurante.id;
        
        console.log(`✅ RestauranteId obtido: ${restauranteId}`);
        
        // 2. Namespace correto: /restaurante/{UUID}
        const namespace = `/restaurante/${restauranteId}`;
        
        console.log(`🔌 Conectando WebSocket: ${apiUrl}${namespace}`);
        
        socket = io(`${apiUrl}${namespace}`, {
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          transports: ['websocket', 'polling'],
        });

        // ==========================================
        // EVENTOS DE CONEXÃO
        // ==========================================
        
        socket.on('connect', () => {
          console.log('✅ WebSocket conectado:', socket.id);
          setIsConnected(true);
          setError(null);
        });

        socket.on('disconnect', (reason) => {
          console.warn('❌ WebSocket desconectado:', reason);
          setIsConnected(false);
          
          if (reason === 'io server disconnect') {
            socket.connect();
          }
        });

        socket.on('connect_error', (err) => {
          console.error('🔴 Erro de conexão WebSocket:', err.message);
          setError(err);
          setIsConnected(false);
        });

        socket.on('reconnect', (attemptNumber) => {
          console.log(`🔄 Reconectado após ${attemptNumber} tentativa(s)`);
          setError(null);
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
          console.log(`🔄 Tentando reconectar... (${attemptNumber}/5)`);
        });

        socket.on('reconnect_failed', () => {
          console.error('❌ Falha ao reconectar após 5 tentativas');
          setError(new Error('Não foi possível reconectar ao servidor'));
        });

        socketRef.current = socket;
        
      } catch (err) {
        console.error('❌ Erro ao buscar restauranteId:', err);
        setError(err);
      }
    };

    conectarWebSocket();

    // Cleanup ao desmontar componente
    return () => {
      if (socketRef.current) {
        console.log('🔌 Desconectando WebSocket...');
        socketRef.current.disconnect();
      }
    };
  }, [restauranteSlug, apiUrl, autoConnect]);

  // ==========================================
  // MÉTODOS PÚBLICOS
  // ==========================================

  /**
   * Registra um listener para um evento
   * @param {string} event - Nome do evento
   * @param {Function} callback - Função callback
   */
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    } else {
      console.warn('⚠️ Socket não inicializado. Não foi possível registrar evento:', event);
    }
  };

  /**
   * Remove um listener de evento
   * @param {string} event - Nome do evento
   * @param {Function} [callback] - Função callback específica (opcional)
   */
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  /**
   * Emite um evento para o servidor
   * @param {string} event - Nome do evento
   * @param {*} data - Dados a enviar
   */
  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Socket não conectado. Não foi possível emitir evento:', event);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    on,
    off,
    emit,
  };
};
