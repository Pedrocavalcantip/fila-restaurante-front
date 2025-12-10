// ==========================================
// 📝 LOGGER - Logs apenas em desenvolvimento
// ==========================================
// Em produção (deploy), os logs não aparecem no console

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) console.log(...args);
  },
  
  warn: (...args) => {
    if (isDevelopment) console.warn(...args);
  },
  
  error: (...args) => {
    if (isDevelopment) console.error(...args);
  },
  
  info: (...args) => {
    if (isDevelopment) console.info(...args);
  }
};
