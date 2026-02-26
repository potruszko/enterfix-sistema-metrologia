# 📁 Estrutura de Contratos - Refatoração

## 🎯 Objetivo

Organizar o código de geração de contratos em arquivos menores, independentes e fáceis de manter.

## 📂 Estrutura

```
src/utils/contratos/
├── shared/                          # Componentes compartilhados
│   ├── estilos.js                  # Estilos visuais (cores, fontes, logo)
│   ├── helpers.js                  # Utilitários (datas, formatação, etc)
│   └── cabecalhoRodape.js          # Cabeçalho e rodapé padronizados
│
├── clausulas/                       # Cláusulas por tipo
│   ├── gerais.js                   # 10 cláusulas gerais (todos os contratos)
│   ├── prestacaoServico.js         # 9 cláusulas específicas (calibração)
│   ├── comodato.js                 # TODO: Implementar
│   ├── manutencao.js               # TODO: Implementar
│   ├── sla.js                      # TODO: Implementar
│   ├── consultoria.js              # TODO: Implementar
│   ├── gestaoParque.js             # TODO: Implementar
│   ├── suporte.js                  # TODO: Implementar
│   ├── validacao.js                # TODO: Implementar
│   └── nda.js                      # TODO: Implementar
│
├── index.js                         # Exportações centralizadas
└── README.md                        # Este arquivo
```

## ✅ Benefícios

| Antes | Depois |
|-------|--------|
| 1 arquivo de 764 linhas | Múltiplos arquivos de ~200 linhas cada |
| Difícil encontrar cláusulas | Busca direta por tipo |
| Alto risco de conflitos git | Cada tipo em arquivo separado |
| Teste tudo junto | Teste isolado por tipo |
| Adicionar tipo = risco de quebrar | Adicionar arquivo = zero impacto |

## 🚀 Como Adicionar Novo Tipo de Contrato

### Passo 1: Criar arquivo de cláusulas

Criar `src/utils/contratos/clausulas/comodato.js`:

```javascript
/**
 * CLÁUSULAS ESPECÍFICAS - Comodato de Equipamentos
 */

export const CLAUSULAS_COMODATO = {
    responsabilidade: () => `
CLÁUSULA ESPECÍFICA 1 - DA RESPONSABILIDADE PELO EQUIPAMENTO
1.1. O COMODATÁRIO recebe o equipamento em perfeito estado de funcionamento...
    `,

    prazoComodato: () => `
CLÁUSULA ESPECÍFICA 2 - DO PRAZO DO COMODATO
2.1. O equipamento será cedido pelo prazo de...
    `,

    // ... demais cláusulas
};
```

### Passo 2: Adicionar import no index.js

```javascript
// Em src/utils/contratos/index.js
import { CLAUSULAS_COMODATO } from './clausulas/comodato.js';

export const CLAUSULAS_ESPECIFICAS_MAP = {
    prestacao_servico: CLAUSULAS_PRESTACAO_SERVICO,
    comodato: CLAUSULAS_COMODATO, // <- ADICIONAR AQUI
    // ...
};
```

### Passo 3: Adicionar título

```javascript
// Em src/utils/contratos/clausulas/gerais.js
export const TITULOS_CONTRATOS = {
    prestacao_servico: 'PRESTAÇÃO DE SERVIÇOS DE CALIBRAÇÃO',
    comodato: 'COMODATO DE EQUIPAMENTOS', // <- ADICIONAR AQUI
    // ...
};
```

### Passo 4: Testar

```javascript
import { getClausulasEspecificas, tipoContratoImplementado } from './contratos';

// Verificar se implementado
tipoContratoImplementado('comodato'); // true

// Buscar cláusulas
const clausulas = getClausulasEspecificas('comodato');
console.log(clausulas.responsabilidade());
```

## 📋 Template de Cláusula

```javascript
/**
 * CLÁUSULAS ESPECÍFICAS - [NOME DO TIPO]
 * 
 * [Descrição breve]
 * Base normativa: [normas aplicáveis]
 */

export const CLAUSULAS_[TIPO] = {
    /**
     * [Nome da cláusula]
     */
    nomeFuncao: (parametro1, parametro2) => `
CLÁUSULA ESPECÍFICA X - [TÍTULO]
X.1. [Texto da cláusula]

X.2. [Subcláusula]
    a) [Item]
    b) [Item]
    `,

    // Adicionar 6-9 cláusulas específicas desse tipo
};
```

## 🎨 Estilos e Logo

### Logo com Proporção Correta

```javascript
// Em shared/estilos.js
export const ESTILOS = {
    logo: {
        path: '/assets/images/LOGO_ENTERFIX_LIGHT.png',
        largura: 40,    // mm
        altura: 19.5,   // mm (proporção 2.05:1 - MARCA REGISTRADA)
        posX: 20,
        posY: 10,
    },
};
```

⚠️ **IMPORTANTE**: Não alterar proporção do logo (marca registrada)!

### Cores Padrão

```javascript
corPrimaria: [0, 51, 102],      // Azul escuro Enterfix
corSecundaria: [128, 128, 128], // Cinza
corTexto: [0, 0, 0],            // Preto
```

## 🧪 Testes

### Testar tipo implementado

```bash
npm test contratos/clausulas/prestacaoServico.test.js
```

### Verificar todos os tipos

```javascript
import { getTiposImplementados } from './contratos';
console.log(getTiposImplementados()); 
// ['prestacao_servico']
```

## 📝 Checklist para Novo Tipo

- [ ] Criar arquivo em `clausulas/[tipo].js`
- [ ] Adicionar 6-9 cláusulas específicas
- [ ] Incluir import no `index.js`
- [ ] Adicionar ao `CLAUSULAS_ESPECIFICAS_MAP`
- [ ] Adicionar título em `TITULOS_CONTRATOS`
- [ ] Testar geração de PDF
- [ ] Validar com advogado (se necessário)
- [ ] Documentar peculiaridades no arquivo

## 🔄 Migração

### Código Antigo (clausulasContratuais.js)

```javascript
import { CLAUSULAS_GERAIS, CLAUSULAS_ESPECIFICAS } from './clausulasContratuais';
```

### Código Novo (modular)

```javascript
import { 
    CLAUSULAS_GERAIS, 
    getClausulasEspecificas 
} from './contratos';

const clausulasEspecificas = getClausulasEspecificas('prestacao_servico');
```

## 📚 Documentação

- **Estilos**: Ver `shared/estilos.js`
- **Helpers**: Ver `shared/helpers.js`
- **Cláusulas gerais**: Ver `clausulas/gerais.js`
- **Exemplo completo**: Ver `clausulas/prestacaoServico.js`

## 🐛 Debug

### Tipo não encontrado

```javascript
if (!tipoContratoImplementado('novo_tipo')) {
    console.error('Tipo ainda não implementado');
    // Usar cláusulas genéricas ou retornar erro
}
```

### Verificar tipos disponíveis

```javascript
console.table(getTiposImplementados());
```

## 🚧 Em Progresso (TODO)

- [ ] Implementar comodato.js
- [ ] Implementar manutencao.js
- [ ] Implementar sla.js
- [ ] Implementar consultoria.js
- [ ] Implementar gestaoParque.js
- [ ] Implementar suporte.js
- [ ] Implementar validacao.js
- [ ] Implementar nda.js
- [ ] Criar testes unitários
- [ ] Adicionar validação de parâmetros
- [ ] Sistema de versioning de cláusulas

## 💡 Sugestões Futuras

- Sistema de plugins (cada tipo como plugin independente)
- Editor visual de cláusulas
- Versionamento por tipo (v1, v2, etc)
- AI para sugerir cláusulas baseado em tipo

---

**Última atualização**: 26/02/2026  
**Responsável**: Equipe Enterfix Dev  
**Versão**: 1.0.0 (Refatoração Opção 1)
