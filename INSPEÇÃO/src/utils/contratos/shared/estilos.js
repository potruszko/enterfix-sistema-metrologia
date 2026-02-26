/**
 * RE-EXPORTAÇÕES - Compatibilidade com código de contratos
 * 
 * Este arquivo mantém compatibilidade com código existente.
 * Os estilos reais estão em: src/utils/shared/estilosPDF.js
 * 
 * @deprecated Importe diretamente de '../../shared/estilosPDF.js'
 */

// Re-exportar tudo do arquivo global
export {
    // Elementos principais
    LOGO_ENTERFIX,
    CORES,
    TIPOGRAFIA,
    LAYOUT,
    ESTILOS_TABELA,
    
    // Funções utilitárias
    getLarguraUtil,
    getAlturaUtil,
    getCentroX,
    getCentro,
    getMargemDireita,
    getLimiteInferior,
    temEspacoNaPagina,
    
    // Presets
    PRESET_CONTRATO,
    PRESET_RELATORIO,
    PRESET_CERTIFICADO,
    
    // Compatibilidade legada
    ESTILOS,
} from '../../shared/estilosPDF.js';

// Alias para compatibilidade
export { LOGO_ENTERFIX as logo } from '../../shared/estilosPDF.js';
