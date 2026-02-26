# 🎨 PADRONIZAÇÃO DE ESTILOS - ENTERFIX METROLOGIA

## ✅ IMPLEMENTADO COM SUCESSO

**Data:** 2024  
**Status:** ✅ COMPLETO - Build validado

---

## 📋 RESUMO

Todos os PDFs da Enterfix agora usam **UM ÚNICO ARQUIVO** de estilos (`src/utils/shared/estilosPDF.js`).

**Analogia:** Funciona como um arquivo CSS para site web - você muda a cor azul em UM lugar, e TODOS os PDFs atualizam automaticamente.

---

## 🎯 PROBLEMA RESOLVIDO

### ❌ ANTES (Problema):
```
📁 contratosPDF.js     → Define azul [0, 51, 102]
📁 pdfGenerator.js     → Define azul [0, 51, 102]
📁 contratos/estilos.js → Define azul [0, 51, 102]

❌ 3 lugares diferentes com MESMA cor
❌ Para mudar o azul, precisa editar 3 arquivos
❌ Risco de usar azuis diferentes por engano
❌ Difícil garantir identidade visual consistente
```

### ✅ AGORA (Solução):
```
📁 shared/estilosPDF.js → Define azul [0, 51, 102] UMA VEZ
📁 contratosPDF.js      → IMPORTA de shared
📁 pdfGenerator.js      → IMPORTA de shared
📁 contratos/estilos.js → IMPORTA de shared

✅ UM único lugar com a definição
✅ Para mudar o azul, edita 1 arquivo
✅ Impossível ter azuis diferentes
✅ Identidade visual garantida
```

---

## 📂 ESTRUTURA CRIADA

```
src/utils/
├── shared/                          ← NOVO: Padrão global
│   ├── estilosPDF.js               ← ⭐ ARQUIVO PRINCIPAL (400+ linhas)
│   ├── README.md                    ← Guia completo de uso
│   └── exemplosUso.js              ← Exemplos práticos
│
├── contratos/
│   └── shared/
│       └── estilos.js              ← Agora re-exporta do global ✅
│
├── contratosPDF.js                  ← Migrado ✅
└── pdfGenerator.js                  ← Migrado ✅
```

---

## 📦 CONTEÚDO DO ARQUIVO GLOBAL

### `src/utils/shared/estilosPDF.js`

#### 1️⃣ **LOGO_ENTERFIX** (proporção de marca registrada)
```javascript
export const LOGO_ENTERFIX = {
    path: '/assets/images/LOGO_ENTERFIX_LIGHT.png',
    largura: 40,    // mm
    altura: 19.5,   // mm (proporção 2.05:1 - MARCA REGISTRADA)
    posicaoX: 20,
    posicaoY: 10,
};
```

⚠️ **IMPORTANTE:** Proporção 2.05:1 é OBRIGATÓRIA (marca registrada).

---

#### 2️⃣ **CORES** (paleta completa Enterfix)
```javascript
export const CORES = {
    // Cores principais
    primaria: [0, 51, 102],         // #003366 - Azul escuro Enterfix
    secundaria: [41, 128, 185],     // #2980B9 - Azul claro
    
    // Status
    sucesso: [22, 101, 52],         // #166534 - Verde (APROVADO)
    alerta: [202, 138, 4],          // #CA8A04 - Amarelo (ATENÇÃO)
    erro: [153, 27, 27],            // #991B1B - Vermelho (REPROVADO)
    
    // Fundos (versões claras)
    fundoAzul: [230, 242, 255],
    fundoCinza: [245, 245, 245],
    sucessoClaro: [220, 255, 220],
    alertaClaro: [255, 248, 220],
    erroClaro: [255, 220, 220],
    
    // Básicas
    texto: [0, 0, 0],
    textoSecundario: [128, 128, 128],
    branco: [255, 255, 255],
    linha: [200, 200, 200],
};
```

---

#### 3️⃣ **TIPOGRAFIA** (fontes e tamanhos)
```javascript
export const TIPOGRAFIA = {
    // Fontes
    fontePrincipal: 'helvetica',    // Moderna, relatórios
    fonteSecundaria: 'times',       // Formal, contratos
    fonteMono: 'courier',           // Dados técnicos
    
    // Tamanhos (pontos)
    tamanhos: {
        h1: 18,
        h2: 14,
        h3: 12,
        corpo: 10,
        pequeno: 8,
        rodape: 7,
    },
    
    // Pesos
    pesos: {
        normal: 'normal',
        negrito: 'bold',
        italico: 'italic',
    },
};
```

---

#### 4️⃣ **LAYOUT** (margens e espaçamentos)
```javascript
export const LAYOUT = {
    // Página A4
    pagina: {
        largura: 210,  // mm
        altura: 297,   // mm
    },
    
    // Margens
    margens: {
        esquerda: 20,   // mm
        direita: 20,
        superior: 20,
        inferior: 20,
    },
    
    // Espaçamentos
    espacamentos: {
        entreLinhas: 5,        // mm
        entreParagrafos: 8,
        entreSecoes: 12,
    },
    
    // Elementos
    elementos: {
        espessuraLinha: 0.5,
        espessuraLinhaGrossa: 1.0,
        bordaArredondada: 2,
    },
};
```

---

#### 5️⃣ **ESTILOS_TABELA** (configurações de tabelas)
```javascript
export const ESTILOS_TABELA = {
    // Cabeçalho da tabela
    cabecalho: {
        fillColor: [245, 245, 245],  // Cinza claro
        textColor: [0, 0, 0],        // Preto
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'center',
        cellPadding: 4,
    },
    
    // Corpo da tabela
    corpo: {
        fontSize: 8,
        textColor: [0, 0, 0],
        cellPadding: 3,
    },
    
    // Linhas alternadas
    alternado: {
        fillColor: [250, 250, 250],  // Cinza muito claro
    },
};
```

---

#### 6️⃣ **PRESETS** (configurações prontas)

##### 📄 Contratos (formal)
```javascript
export const PRESET_CONTRATO = {
    fonte: 'times',                 // Formal
    corPrimaria: CORES.primaria,
    margens: LAYOUT.margens,
    tamanhoTexto: 10,
    espacamentoLinha: 5,
};
```

##### 📊 Relatórios (moderno)
```javascript
export const PRESET_RELATORIO = {
    fonte: 'helvetica',             // Moderna
    corPrimaria: CORES.primaria,
    margens: LAYOUT.margens,
    tamanhoTexto: 10,
    espacamentoLinha: 5,
};
```

##### 🏆 Certificados (destacado)
```javascript
export const PRESET_CERTIFICADO = {
    fonte: 'times',
    corPrimaria: CORES.secundaria,  // Azul claro
    margens: {
        esquerda: 25,               // Margens maiores
        direita: 25,
        superior: 30,
        inferior: 30,
    },
    tamanhoTexto: 11,               // Texto maior
    espacamentoLinha: 6,
};
```

---

#### 7️⃣ **FUNÇÕES UTILITÁRIAS**

```javascript
// Largura útil (descontando margens)
export function getLarguraUtil() {
    return LAYOUT.pagina.largura - LAYOUT.margens.esquerda - LAYOUT.margens.direita;
}

// Centro horizontal da página
export function getCentro() {
    return LAYOUT.pagina.largura / 2;
}

// Limite inferior (antes do rodapé)
export function getLimiteInferior() {
    return LAYOUT.pagina.altura - LAYOUT.margens.inferior - 15;
}

// Verificar se há espaço na página
export function temEspacoNaPagina(yAtual, espacoNecessario) {
    return (yAtual + espacoNecessario) < getLimiteInferior();
}
```

---

## 💻 COMO USAR

### Exemplo 1: Novo relatório com estilos padrão

```javascript
import jsPDF from 'jspdf';
import {
    LOGO_ENTERFIX,
    CORES,
    TIPOGRAFIA,
    LAYOUT,
    PRESET_RELATORIO,
    getCentro,
} from '../shared/estilosPDF.js';

function gerarRelatorio() {
    const doc = new jsPDF();
    
    // Logo (sempre com proporção correta)
    doc.addImage(
        LOGO_ENTERFIX.path,
        'PNG',
        LOGO_ENTERFIX.posicaoX,
        LOGO_ENTERFIX.posicaoY,
        LOGO_ENTERFIX.largura,
        LOGO_ENTERFIX.altura
    );
    
    // Título (cor Enterfix)
    doc.setFont(PRESET_RELATORIO.fonte, 'bold');
    doc.setFontSize(TIPOGRAFIA.tamanhos.h1);
    doc.setTextColor(...CORES.primaria);
    doc.text('RELATÓRIO TÉCNICO', getCentro(), 40, { align: 'center' });
    
    // Status aprovado (verde Enterfix)
    doc.setTextColor(...CORES.sucesso);
    doc.text('APROVADO', 20, 60);
    
    return doc;
}
```

---

### Exemplo 2: Tabela com estilos Enterfix

```javascript
import 'jspdf-autotable';
import { ESTILOS_TABELA, CORES } from '../shared/estilosPDF.js';

doc.autoTable({
    head: [['Item', 'Descrição', 'Status']],
    body: [
        ['1', 'Calibração', 'APROVADO'],
        ['2', 'Ensaio', 'REPROVADO'],
    ],
    // Usar estilos padronizados
    headStyles: ESTILOS_TABELA.cabecalho,
    bodyStyles: ESTILOS_TABELA.corpo,
    alternateRowStyles: ESTILOS_TABELA.alternado,
    // Colorir status
    didDrawCell: (data) => {
        if (data.column.index === 2 && data.section === 'body') {
            if (data.cell.raw === 'APROVADO') {
                data.cell.styles.textColor = CORES.sucesso;
            } else {
                data.cell.styles.textColor = CORES.erro;
            }
        }
    },
});
```

---

### Exemplo 3: Caixa de alerta

```javascript
import { CORES, LAYOUT, getLarguraUtil } from '../shared/estilosPDF.js';

function adicionarAlerta(doc, texto, y) {
    // Fundo amarelo Enterfix
    doc.setFillColor(...CORES.alertaClaro);
    doc.rect(LAYOUT.margens.esquerda, y, getLarguraUtil(), 15, 'F');
    
    // Borda amarela
    doc.setDrawColor(...CORES.alerta);
    doc.setLineWidth(LAYOUT.elementos.espessuraLinha);
    doc.rect(LAYOUT.margens.esquerda, y, getLarguraUtil(), 15);
    
    // Texto amarelo
    doc.setTextColor(...CORES.alerta);
    doc.text(texto, LAYOUT.margens.esquerda + 5, y + 8);
}
```

---

## 🔧 ARQUIVOS MIGRADOS

### ✅ `contratosPDF.js`
- **Antes:** 18 linhas de definições locais (const ESTILOS = {...})
- **Depois:** 1 linha de import
- **Mudanças:**
  - Logo usa `LOGO_ENTERFIX` (proporção correta garantida)
  - Cores importadas de `CORES.*`
  - Layout importado de `LAYOUT.*`

### ✅ `pdfGenerator.js`
- **Antes:** ~25 lugares com cores hardcoded
- **Depois:** Importa de `CORES.*`
- **Mudanças:**
  - Tabelas usam `ESTILOS_TABELA.*`
  - Aprovado/Reprovado usam `CORES.sucesso` / `CORES.erro`
  - Fundos coloridos usam `CORES.*Claro`

### ✅ `contratos/shared/estilos.js`
- **Antes:** 68 linhas de definições
- **Depois:** 35 linhas de re-exportações
- **Status:** Mantém compatibilidade backward (código antigo funciona)

---

## 🎨 BENEFÍCIOS

### 1️⃣ **Manutenção Simplificada**
- Mudar cor azul: editar 1 linha → atualiza TODOS os PDFs
- Mudar logo: editar 1 lugar → atualiza contratos, relatórios, certificados
- Mudar margem: editar 1 valor → todos PDFs padronizados

### 2️⃣ **Identidade Visual Garantida**
- **Impossível** ter cores diferentes por engano
- **Impossível** distorcer proporção do logo
- **Todos** os PDFs usam mesma paleta Enterfix

### 3️⃣ **Novos PDFs Fáceis**
```javascript
// Criar novo tipo de PDF com identidade Enterfix
import { CORES, LOGO_ENTERFIX, PRESET_RELATORIO } from '../shared/estilosPDF.js';

// Pronto! Já tem todas as cores, logo, fontes corretas
```

### 4️⃣ **Conformidade com Marca Registrada**
- Logo sempre com proporção 2.05:1 (obrigatório por lei)
- Definido em UM lugar, usado por TODOS

---

## 📚 DOCUMENTAÇÃO

### Arquivos criados:
1. **`src/utils/shared/estilosPDF.js`**
   - Arquivo principal (400+ linhas)
   - Todas as definições de estilo

2. **`src/utils/shared/README.md`**
   - Guia completo de uso
   - Exemplos de código
   - Paleta de cores com hex
   - Esclarecimentos sobre ABNT

3. **`src/utils/shared/exemplosUso.js`**
   - Exemplos práticos de relatórios
   - Exemplos de certificados
   - Exemplos de contratos
   - Funções auxiliares

4. **`docs/PADRONIZACAO_ESTILOS.md`** (este arquivo)
   - Resumo executivo
   - Before/After
   - Benefícios

---

## ⚠️ IMPORTANTE: ABNT

**Contratos NÃO precisam seguir ABNT.**

- ✅ **ABNT NBR 14724** → Para trabalhos acadêmicos (TCC, dissertações, teses)
- ❌ **Contratos comerciais** → Livres para definir formatação própria
- ✅ **Enterfix** → Pode usar identidade visual própria em contratos

---

## 🚀 PRÓXIMOS PASSOS

### Para adicionar novo tipo de PDF:

1. **Importar estilos globais:**
```javascript
import {
    LOGO_ENTERFIX,
    CORES,
    TIPOGRAFIA,
    LAYOUT,
    PRESET_RELATORIO, // ou PRESET_CONTRATO, PRESET_CERTIFICADO
    getCentro,
    getLarguraUtil,
} from './shared/estilosPDF.js';
```

2. **Usar constantes (NÃO hardcodar):**
```javascript
// ❌ ERRADO:
doc.setTextColor(0, 51, 102);

// ✅ CERTO:
doc.setTextColor(...CORES.primaria);
```

3. **Pronto!** Seu PDF tem identidade Enterfix automaticamente.

---

## 🎯 CHECKLIST PARA NOVOS PDFs

Sempre que criar novo PDF, verificar:

- [ ] Importou de `shared/estilosPDF.js`?
- [ ] Logo usa `LOGO_ENTERFIX` (não hardcoded)?
- [ ] Cores usam `CORES.*` (não arrays RGB diretos)?
- [ ] Tabelas usam `ESTILOS_TABELA.*`?
- [ ] Margens usam `LAYOUT.margens.*`?
- [ ] Está usando preset adequado (CONTRATO/RELATORIO/CERTIFICADO)?

---

## ✅ VALIDAÇÃO

**Build:** ✅ Passou (5.30s)  
**Erros:** 0  
**Warnings:** 1 (chunk size - não crítico)

```bash
npm run build
✓ 1896 modules transformed.
✓ built in 5.30s
```

---

## 📞 SUPORTE

**Localização dos arquivos:**
- Principal: `src/utils/shared/estilosPDF.js`
- Documentação: `src/utils/shared/README.md`
- Exemplos: `src/utils/shared/exemplosUso.js`

**Para dúvidas:**
1. Ler `src/utils/shared/README.md` (guia completo)
2. Ver exemplos em `exemplosUso.js`
3. Procurar no código por `import.*estilosPDF`

---

## 🏆 RESULTADO FINAL

### Era isso que você pediu:
> "padronizar é o ideal... manter a mesma comunicação sempre. independente do pdf que gerarmos"

### ✅ Entregue:
- UM arquivo de estilos para TODOS os PDFs
- Identidade visual Enterfix consistente
- Logo com proporção protegida
- Fácil manutenção (mudar 1 vez = atualiza tudo)
- Documentação completa
- Exemplos práticos
- Build validado

🎨 **Sua "CSS" para PDFs está pronta!**

---

*Enterfix Metrologia Industrial - Sistema de Gestão Metrológica*  
*Padronização de Estilos - Versão 1.0*
