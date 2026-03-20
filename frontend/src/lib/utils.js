/** Formata valor como moeda BRL */
export const brl = (v) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(v || 0)

/** Formata número com casas decimais */
export const num = (v, dec = 2) =>
    new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec
    }).format(v || 0)

/** Prefixo do produto pelo tipo */
export const TIPOS = [{
        value: 'PM',
        label: 'PM – Ponta de Medição'
    },
    {
        value: 'EM',
        label: 'EM – Extensão'
    },
    {
        value: 'AM',
        label: 'AM – Adaptador'
    },
    {
        value: 'SM',
        label: 'SM – Ponta Star'
    },
    {
        value: 'DM',
        label: 'DM – Ponta Disco'
    },
    {
        value: 'CM',
        label: 'CM – Ponta Cônica'
    },
    {
        value: 'BM',
        label: 'BM – Blank'
    },
]

export const ROSCAS = ['M1,4', 'M1,6', 'M2', 'M2,5', 'M3', 'M4', 'M5', 'M6', 'M8', 'M12']

export const MATERIAIS_HASTE = ['Inox', 'Metal Duro', 'Fibra de Carbono', 'Cerâmica', 'Titânio', 'Tungstênio']

export const MATERIAIS_ESFERA = ['Rubi', 'Cerâmica', 'Inox', 'Metal Duro', 'Nitreto de Silício']

export const DIAMETROS_ESFERA = [0.3, 0.5, 0.7, 0.8, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0]

/** Gera automaticamente o código da ponta com base nos atributos.
 *  Formato: [1ª letra do tipo][rosca]-[material][diâmetro]-[comprimento]
 *  Ex: PM + M2 + Rubi Ø2mm + 50mm → PM2-R20-50
 */
export function gerarCodigo({
    tipo,
    rosca,
    materialEsfera,
    diametroEsfera,
    comprimentoTotal
}) {
    if (!tipo || !rosca) return ''
    const prefixo = tipo[0] // PM→P, EM→E, AM→A, SM→S, DM→D, CM→C, BM→B
    const r = rosca.replace(',', '') // M2,5 → M25
    const mat = materialEsfera === 'Metal Duro' ? 'D' :
        materialEsfera === 'Cerâmica' ? 'C' :
        materialEsfera === 'Inox' ? 'I' :
        materialEsfera === 'Nitreto de Silício' ? 'N' :
        'R' // Rubi default
    const d = diametroEsfera ? String(diametroEsfera).replace('.', '') : ''
    const c = comprimentoTotal ? String(Math.round(comprimentoTotal)) : ''
    return `${prefixo}${r}-${mat}${d}-${c}`.replace(/-$/, '')
}

export const statusBadge = (status) => {
    if (status === 'sincronizado') return 'badge-green'
    return 'badge-yellow'
}

export const statusLabel = (status) => {
    if (status === 'sincronizado') return 'Sincronizado'
    return 'Rascunho'
}