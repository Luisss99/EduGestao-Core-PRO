/**
 * Configuração central de APIs do EduGestão Core PRO
 * Carrega variáveis de ambiente do Vite (import.meta.env)
 */

export const apiConfig = {
  cloudflare: {
    accountId: import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || '',
    bucketName: import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME || 'edugestao-media',
    publicUrl: import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL || '',
  },
  viacep: {
    baseUrl: import.meta.env.VITE_VIACEP_API_URL || 'https://viacep.com.br/ws',
  },
  whatsapp: {
    apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || '',
  },
  resend: {
    apiKey: import.meta.env.VITE_RESEND_API_KEY || '',
  },
  asaas: {
    apiKey: import.meta.env.VITE_ASAAS_API_KEY || '',
    environment: import.meta.env.VITE_ASAAS_ENVIRONMENT || 'sandbox',
  },
  ai: {
    openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  }
};

export default apiConfig;
