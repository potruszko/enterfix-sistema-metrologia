/**
 * CONTRATOS - ENTERFIX METROLOGIA
 * 
 * Módulo centralizado para geração de contratos em PDF.
 * Arquitetura organizada e escalável.
 * 
 * Estrutura:
 * - shared/: Componentes compartilhados (estilos, helpers, cabeçalho/rodapé)
 * - clausulas/: Cláusulas por tipo de contrato (gerais + específicas)
 * - geradores/: Lógica de geração de PDF
 * 
 * Para adicionar novo tipo de contrato:
 * 1. Criar arquivo em clausulas/ (ex: comodato.js)
 * 2. Adicionar import no CLAUSULAS_SPECIFICICAS_MAP abaixo
 * 3. Adicionar título em TITULOS_CONTRATOS
 */

// ============= SHARED =============
export { ESTILOS, getLarguraUtil, getAlturaUtil, getCentroX } from './shared/estilos.js';
export {
    dataExtenso,
    adicionarParagrafo,
    adicionarTituloSecao,
    adicionarLinhaSeparadora,
    temEspacoNaPagina,
    adicionarEspaco,
    formatarValorBRL,
    formatarCPF,
    formatarCNPJ
} from './shared/helpers.js';
export {
    adicionarCabecalho,
    adicionarRodape,
    aplicarCabecalhoRodapeEmTodasPaginas
} from './shared/cabecalhoRodape.js';

// ============= CLÁUSULAS GERAIS =============
export { CLAUSULAS_GERAIS, FORO_COMPETENTE, TITULOS_CONTRATOS } from './clausulas/gerais.js';

// ============= CLÁUSULAS ESPECÍFICAS =============
import { CLAUSULAS_PRESTACAO_SERVICO } from './clausulas/prestacaoServico.js';

// TODO: Criar arquivos para os demais tipos
// import { CLAUSULAS_COMODATO } from './clausulas/comodato.js';
// import { CLAUSULAS_MANUTENCAO } from './clausulas/manutencao.js';
// import { CLAUSULAS_SLA } from './clausulas/sla.js';
// import { CLAUSULAS_CONSULTORIA } from './clausulas/consultoria.js';
// import { CLAUSULAS_GESTAO_PARQUE } from './clausulas/gestaoParque.js';
// import { CLAUSULAS_SUPORTE } from './clausulas/suporte.js';
// import { CLAUSULAS_VALIDACAO } from './clausulas/validacao.js';
// import { CLAUSULAS_NDA } from './clausulas/nda.js';

/**
 * Mapa de cláusulas específicas por tipo de contrato
 * Facilita a busca dinâmica por tipo
 */
export const CLAUSULAS_ESPECIFICAS_MAP = {
    prestacao_servico: CLAUSULAS_PRESTACAO_SERVICO,
    // comodato: CLAUSULAS_COMODATO,
    // manutencao: CLAUSULAS_MANUTENCAO,
    // sla: CLAUSULAS_SLA,
    // consultoria: CLAUSULAS_CONSULTORIA,
    // gestao_parque: CLAUSULAS_GESTAO_PARQUE,
    // suporte: CLAUSULAS_SUPORTE,
    // validacao: CLAUSULAS_VALIDACAO,
    // nda: CLAUSULAS_NDA,
};

/**
 * Retorna cláusulas específicas para um tipo de contrato
 * @param {string} tipoContrato - Tipo do contrato
 * @returns {Object|null} Cláusulas específicas ou null se não encontradas
 */
export function getClausulasEspecificas(tipoContrato) {
    return CLAUSULAS_ESPECIFICAS_MAP[tipoContrato] || null;
}

/**
 * Verifica se um tipo de contrato possui cláusulas específicas implementadas
 * @param {string} tipoContrato - Tipo do contrato
 * @returns {boolean} True se implementado
 */
export function tipoContratoImplementado(tipoContrato) {
    return tipoContrato in CLAUSULAS_ESPECIFICAS_MAP;
}

/**
 * Lista todos os tipos de contrato implementados
 * @returns {string[]} Array com tipos implementados
 */
export function getTiposImplementados() {
    return Object.keys(CLAUSULAS_ESPECIFICAS_MAP);
}

/**
 * Retorna título amigável do tipo de contrato
 * @param {string} tipoContrato - Tipo do contrato
 * @returns {string} Título formatado
 */
export function getTituloContrato(tipoContrato) {
    const { TITULOS_CONTRATOS } = require('./clausulas/gerais.js');
    return TITULOS_CONTRATOS[tipoContrato] || 'CONTRATO DE SERVIÇOS';
}
