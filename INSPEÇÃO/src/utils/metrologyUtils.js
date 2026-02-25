/**
 * Formata um número para o padrão metrológico (4 casas decimais)
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado com 4 casas decimais
 */
export const formatMetrologicalValue = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '';
    return num.toFixed(4);
};

/**
 * Calcula o status (OK/NOK) baseado em tolerância
 * @param {number} nominal - Valor nominal
 * @param {number} toleranciaPos - Tolerância superior
 * @param {number} toleranciaNeg - Tolerância inferior
 * @param {number} medido - Valor medido
 * @returns {string} - 'OK' ou 'NOK'
 */
export const calculateStatus = (nominal, toleranciaPos, toleranciaNeg, medido) => {
    if (!nominal || medido === null || medido === undefined || medido === '') return '';

    const nominalNum = parseFloat(nominal);
    const toleranciaPosNum = parseFloat(toleranciaPos) || 0;
    const toleranciaNegNum = parseFloat(toleranciaNeg) || 0;
    const medidoNum = parseFloat(medido);

    if (isNaN(nominalNum) || isNaN(medidoNum)) return '';

    const maxValue = nominalNum + Math.abs(toleranciaPosNum);
    const minValue = nominalNum - Math.abs(toleranciaNegNum);

    return medidoNum >= minValue && medidoNum <= maxValue ? 'OK' : 'NOK';
};

/**
 * Gera um número único para relatório
 * @returns {string} - Número de relatório no formato REL-YYYYMMDD-XXX
 */
export const generateReportNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `REL-${year}${month}${day}-${random}`;
};

/**
 * Formata data para padrão brasileiro
 * @param {Date|string} date - Data a ser formatada
 * @returns {string} - Data formatada (DD/MM/YYYY)
 */
export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Calcula estatísticas de um relatório
 * @param {Array} medicoes - Array de medições
 * @returns {Object} - Objeto com total, aprovados e reprovados
 */
export const calculateStatistics = (medicoes) => {
    if (!medicoes || !Array.isArray(medicoes)) {
        return {
            total: 0,
            aprovados: 0,
            reprovados: 0
        };
    }

    const total = medicoes.length;
    const aprovados = medicoes.filter(m => m.status === 'OK').length;
    const reprovados = medicoes.filter(m => m.status === 'NOK').length;

    return {
        total,
        aprovados,
        reprovados
    };
};