import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { publicoService } from '../services/api';
import { logger } from '../utils/logger';

// ==========================================
// 📡 CONFIGURAÇÃO DO WEBSOCKET
// ==========================================
// VITE_WS_URL: URL do servidor WebSocket (mesmo servidor do backend)
// Em desenvolvimento: http://localhost:3000
// Em produção: https://seu-backend.up.railway.app

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

/**
 * Hook para gerenciar conexão WebSocket com o backend
 * @param {Object} options - Opções de configuração
 * @param {string} options.restauranteSlug - Slug do restaurante (DEPRECADO - usar restauranteId)
 * @param {string} options.restauranteId - ID do restaurante (UUID)
 * @param {string} [options.apiUrl] - URL base do backend (usa VITE_WS_URL por padrão)
 * @param {boolean} [options.autoConnect] - Conectar automaticamente (padrão: true)
 * @returns {Object} { socket, isConnected, error, on, off, emit }
 */
export const useWebSocket = ({
  restauranteSlug,
  restauranteId,
  apiUrl = WS_URL,
  autoConnect = true
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!autoConnect) return;

    // Priorizar restauranteId passado como prop ou do localStorage
    let finalRestauranteId = restauranteId || localStorage.getItem('restauranteId');
    
    if (!finalRestauranteId && !restauranteSlug) {
      logger.warn('⚠️ useWebSocket: Nem restauranteId nem restauranteSlug foram fornecidos');
      return;
    }

    let socket = null;

    // Função assíncrona para buscar o restauranteId e conectar
    const conectarWebSocket = async () => {
      try {
        // Se não tem restauranteId, buscar pelo slug (fallback)
        if (!finalRestauranteId && restauranteSlug) {
          logger.log(`🔍 Buscando restaurante por slug: ${restauranteSlug}`);
          const response = await publicoService.buscarRestaurantePorSlug(restauranteSlug);
          finalRestauranteId = response.restaurante.id;
          logger.log(`✅ RestauranteId obtido via slug: ${finalRestauranteId}`);
        } else {
          logger.log(`✅ Usando RestauranteId: ${finalRestauranteId}`);
        }
        
        // 2. Namespace correto: /restaurante/{UUID}
        const namespace = `/restaurante/${finalRestauranteId}`;
        
        logger.log(`🔌 Conectando WebSocket: ${apiUrl}${namespace}`);
        
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
          logger.log('✅ WebSocket conectado:', socket.id);
          setIsConnected(true);
          setError(null);
        });

        socket.on('disconnect', (reason) => {
          logger.warn('❌ WebSocket desconectado:', reason);
          setIsConnected(false);
          
          if (reason === 'io server disconnect') {
            socket.connect();
          }
        });

        socket.on('connect_error', (err) => {
          logger.error('🔴 Erro de conexão WebSocket:', err.message);
          setError(err);
          setIsConnected(false);
        });

        socket.on('reconnect', (attemptNumber) => {
          logger.log(`🔄 Reconectado após ${attemptNumber} tentativa(s)`);
          setError(null);
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
          logger.log(`🔄 Tentando reconectar... (${attemptNumber}/5)`);
        });

        socket.on('reconnect_failed', () => {
          logger.error('❌ Falha ao reconectar após 5 tentativas');
          setError(new Error('Não foi possível reconectar ao servidor'));
        });

        socketRef.current = socket;
        
      } catch (err) {
        logger.error('❌ Erro ao buscar restauranteId:', err);
        setError(err);
      }
    };

    conectarWebSocket();

    // Cleanup ao desmontar componente
    return () => {
      if (socketRef.current) {
        logger.log('🔌 Desconectando WebSocket...');
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
      logger.warn('⚠️ Socket não inicializado. Não foi possível registrar evento:', event);
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
      logger.warn('⚠️ Socket não conectado. Não foi possível emitir evento:', event);
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

