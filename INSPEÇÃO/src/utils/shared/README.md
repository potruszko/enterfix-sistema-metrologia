# 🎨 Identidade Visual - PDFs Enterfix

## 📋 Visão Geral

**Um único arquivo de estilos** para TODOS os PDFs do sistema:
- ✅ Contratos
- ✅ Relatórios
- ✅ Certificados
- ✅ Ordens de Serviço
- ✅ Documentos futuros

**Localização:** `src/utils/shared/estilosPDF.js`

## 🎯 Por que Padronizar?

| Antes (Duplicado) ❌ | Depois (Único) ✅ |
|---------------------|------------------|
| Estilos em 3+ arquivos | 1 arquivo central |
| Cores diferentes por PDF | Cores consistentes |
| Difícil manter identidade | Identidade automática |
| Mudar logo = editar 5 arquivos | Mudar logo = editar 1 arquivo |

## 📂 Estrutura

```
src/utils/shared/
└── estilosPDF.js          ← ÚNICO arquivo de estilos
    ├── LOGO_ENTERFIX      ← Logo com proporção correta (marca registrada)
    ├── CORES              ← Paleta completa Enterfix
    ├── TIPOGRAFIA         ← Fontes e tamanhos
    ├── LAYOUT             ← Margens e espaçamentos
    ├── ESTILOS_TABELA     ← Configuração de tabelas
    └── PRESETS            ← Configurações prontas
```

## 🎨 Paleta de Cores Enterfix

### Cores Principais
```javascript
import { CORES } from '@/utils/shared/estilosPDF';

CORES.primaria       // [0, 51, 102]     - Azul escuro #003366
CORES.secundaria     // [41, 128, 185]   - Azul claro #2980B9
```

### Cores de Status
```javascript
CORES.sucesso        // [22, 101, 52]    - Verde escuro
CORES.sucessoClaro   // [220, 255, 220]  - Verde claro (fundo)
CORES.alerta         // [202, 138, 4]    - Amarelo/laranja
CORES.erro           // [153, 27, 27]    - Vermelho escuro
CORES.erroClaro      // [255, 220, 220]  - Vermelho claro (fundo)
```

### Cores de Texto
```javascript
CORES.texto          // [0, 0, 0]        - Preto
CORES.textoSecundario // [128, 128, 128] - Cinza médio
CORES.textoClaro     // [200, 200, 200]  - Cinza claro
```

## 🖼️ Logo Enterfix (Marca Registrada)

```javascript
import { LOGO_ENTERFIX } from '@/utils/shared/estilosPDF';

// Usar logo no PDF
doc.addImage(
    LOGO_ENTERFIX.path,     // '/assets/images/LOGO_ENTERFIX_LIGHT.png'
    'PNG',
    LOGO_ENTERFIX.posicaoX, // 20mm
    LOGO_ENTERFIX.posicaoY, // 10mm
    LOGO_ENTERFIX.largura,  // 40mm
    LOGO_ENTERFIX.altura    // 19.5mm (proporção 2.05:1)
);
```

⚠️ **IMPORTANTE:** Não alterar proporção - marca registrada protegida!

## 📐 Layout e Espaçamento

```javascript
import { LAYOUT, getLarguraUtil, getCentro } from '@/utils/shared/estilosPDF';

// Margens padrão
LAYOUT.margens.esquerda  // 20mm
LAYOUT.margens.direita   // 20mm
LAYOUT.margens.superior  // 20mm
LAYOUT.margens.inferior  // 20mm

// Funções úteis
const larguraUtil = getLarguraUtil();  // 170mm (210 - 20 - 20)
const centro = getCentro();             // 105mm (210 / 2)
```

## 🔤 Tipografia

```javascript
import { TIPOGRAFIA } from '@/utils/shared/estilosPDF';

// Fontes
TIPOGRAFIA.fontePrincipal    // 'helvetica' (moderna)
TIPOGRAFIA.fonteSecundaria   // 'times' (formal, contratos)
TIPOGRAFIA.fonteMono         // 'courier' (código/dados)

// Tamanhos
TIPOGRAFIA.tamanhos.h1       // 18pt (título principal)
TIPOGRAFIA.tamanhos.h2       // 14pt (subtítulo)
TIPOGRAFIA.tamanhos.corpo    // 10pt (texto padrão)
TIPOGRAFIA.tamanhos.pequeno  // 8pt (rodapé)

// Pesos
doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.negrito);
```

## 📊 Tabelas (jsPDF AutoTable)

```javascript
import { ESTILOS_TABELA, CORES } from '@/utils/shared/estilosPDF';

doc.autoTable({
    head: [['Coluna 1', 'Coluna 2', 'Coluna 3']],
    body: dados,
    headStyles: ESTILOS_TABELA.cabecalho,  // Cabeçalho azul Enterfix
    bodyStyles: ESTILOS_TABELA.corpo,       // Corpo padrão
    alternateRowStyles: ESTILOS_TABELA.alternado,  // Linhas zebradas
});
```

## 🎭 Presets Prontos

### Contrato (Formal)
```javascript
import { PRESET_CONTRATO } from '@/utils/shared/estilosPDF';

doc.setFont(PRESET_CONTRATO.fonte);  // Times (formal)
doc.setTextColor(...PRESET_CONTRATO.corPrimaria);
```

### Relatório (Moderno)
```javascript
import { PRESET_RELATORIO } from '@/utils/shared/estilosPDF';

doc.setFont(PRESET_RELATORIO.fonte);  // Helvetica (moderna)
doc.setTextColor(...PRESET_RELATORIO.corDestaque);
```

### Certificado (Destacado)
```javascript
import { PRESET_CERTIFICADO } from '@/utils/shared/estilosPDF';

doc.setFont(PRESET_CERTIFICADO.fonte);
// Margens maiores (25mm)
```

## 🔧 Como Usar em Novos PDFs

### Exemplo: Criar novo tipo de documento

```javascript
import jsPDF from 'jspdf';
import { 
    LOGO_ENTERFIX, 
    CORES, 
    TIPOGRAFIA, 
    LAYOUT,
    getLarguraUtil,
    getCentro 
} from '../shared/estilosPDF';

export function gerarMeuDocumento(dados) {
    const doc = new jsPDF();
    
    // Logo
    doc.addImage(
        LOGO_ENTERFIX.path, 
        'PNG', 
        LOGO_ENTERFIX.posicaoX, 
        LOGO_ENTERFIX.posicaoY,
        LOGO_ENTERFIX.largura, 
        LOGO_ENTERFIX.altura
    );
    
    // Título
    doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.negrito);
    doc.setFontSize(TIPOGRAFIA.tamanhos.h1);
    doc.setTextColor(...CORES.primaria);
    doc.text('MEU DOCUMENTO', getCentro(), 50, { align: 'center' });
    
    // Conteúdo
    doc.setFont(TIPOGRAFIA.fontePrincipal, TIPOGRAFIA.pesos.normal);
    doc.setFontSize(TIPOGRAFIA.tamanhos.corpo);
    doc.setTextColor(...CORES.texto);
    doc.text('Conteúdo aqui...', LAYOUT.margens.esquerda, 70);
    
    return doc;
}
```

## 📝 Sobre Normas ABNT

### ❓ Contratos precisam seguir ABNT?

**NÃO.** Normas ABNT de formatação (NBR 14724, 10520, etc) são para:
- ✅ Trabalhos acadêmicos (TCC, dissertações, teses)
- ✅ Artigos científicos
- ✅ Relatórios de pesquisa acadêmica

### ✅ Contratos comerciais devem:
- Seguir identidade visual da empresa (Enterfix)
- Priorizar legibilidade e clareza
- Ter estrutura lógica e organizada
- Atender requisitos legais do Código Civil

### 📋 O que importa em contratos:
1. **Clareza jurídica** - Linguagem precisa
2. **Legibilidade** - Fácil de ler e entender
3. **Estrutura** - Cláusulas organizadas
4. **Identidade** - Marca da empresa visível
5. **Rastreabilidade** - Numeração de cláusulas

## 🔄 Migração de Código Antigo

### Antes (cada arquivo duplicado):
```javascript
// contratosPDF.js
const ESTILOS = {
    corPrimaria: [0, 51, 102],
    margemEsquerda: 20,
    // ...
};

// pdfGenerator.js
const primaryColor = [0, 51, 102];
const leftMargin = 20;
// ...
```

### Depois (importa do único arquivo):
```javascript
// Qualquer arquivo de PDF
import { CORES, LAYOUT } from '../shared/estilosPDF';

doc.setTextColor(...CORES.primaria);
doc.text('Texto', LAYOUT.margens.esquerda, 50);
```

## 🎯 Checklist para Novos PDFs

Ao criar novo tipo de documento:

- [ ] Importar de `shared/estilosPDF.js`
- [ ] Usar `LOGO_ENTERFIX` (com proporção correta)
- [ ] Usar `CORES.primaria` e `CORES.secundaria`
- [ ] Usar `TIPOGRAFIA` para fontes e tamanhos
- [ ] Usar `LAYOUT.margens` para margens
- [ ] Usar `ESTILOS_TABELA` para tabelas
- [ ] Testar consistência visual com outros PDFs

## 💡 Dicas

### Mudar cor principal de TODOS os PDFs:
```javascript
// Editar apenas em estilosPDF.js
export const CORES = {
    primaria: [0, 51, 102],  // ← Mudar aqui
    // ...
};
```
Todos os PDFs atualizam automaticamente! ✅

### Mudar margens padrão:
```javascript
// Editar apenas em estilosPDF.js
export const LAYOUT = {
    margens: {
        esquerda: 25,  // ← Aumentar para 25mm
        // ...
    },
};
```

### Adicionar nova cor:
```javascript
export const CORES = {
    // ... cores existentes
    minhaCorNova: [100, 150, 200],  // ← Adicionar aqui
};
```

## 🚀 Benefícios

✅ **Consistência** - Todos os PDFs com mesma identidade  
✅ **Manutenibilidade** - Mudar em 1 lugar = atualiza tudo  
✅ **Escalabilidade** - Fácil adicionar novos documentos  
✅ **Marca protegida** - Logo sempre com proporção correta  
✅ **Produtividade** - Presets prontos, não reinventar roda  

---

**Última atualização:** 26/02/2026  
**Responsável:** Equipe Enterfix Dev  
**Versão:** 1.0.0 (Padronização Global)
