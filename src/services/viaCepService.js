import apiConfig from '../config/apiConfig';

/**
 * Serviço de integração com a API gratuita ViaCEP
 * @param {string} cep - CEP formatado ou contendo apenas números
 * @returns {Promise<{
 *   cep: string,
 *   street: string,
 *   neighborhood: string,
 *   city: string,
 *   state: string,
 *   fullAddress: string,
 *   error?: string
 * }>}
 */
export async function fetchAddressByCEP(cep) {
  const cleanCep = (cep || '').replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return { error: 'CEP deve conter exatamente 8 dígitos.' };
  }

  try {
    const response = await fetch(`${apiConfig.viacep.baseUrl}/${cleanCep}/json/`);
    
    if (!response.ok) {
      throw new Error(`Erro na busca do CEP (${response.status})`);
    }

    const data = await response.json();

    if (data.erro) {
      return { error: 'CEP não encontrado. Verifique o número digitado.' };
    }

    return {
      cep: data.cep,
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      fullAddress: `${data.logradouro || ''}${data.bairro ? ', ' + data.bairro : ''}${data.localidade ? ' - ' + data.localidade : ''}${data.uf ? '/' + data.uf : ''}`.trim()
    };
  } catch (err) {
    console.error('ViaCEP Fetch Error:', err);
    return { error: 'Não foi possível consultar o CEP no momento. Verifique sua conexão.' };
  }
}
