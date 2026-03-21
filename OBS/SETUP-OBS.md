# 🎬 ENTERFIX - Setup Completo OBS Studio

## 📁 Estrutura dos Arquivos
```
OBS/
├── index.html          # Página principal
├── style.css          # Estilos (cor petróleo aplicada)
├── script.js          # Sistema de cenas + timing automático
├── assets/            # Pasta para logos e imagens
│   ├── logo-enterfix.png    # Logo completo (140x60px)
│   └── symbol-enterfix.png  # Símbolo apenas (24x24px)
└── SETUP-OBS.md       # Este arquivo
```

## 🎨 **Melhorias Implementadas v2.0:**

✅ **Cor Petróleo:** Substituído #1F1659 (roxo) por **#14263C** (petróleo)
✅ **Timing Automático:** Elementos ficam 12 segundos e somem sozinhos
✅ **Sistema de Cenas:** 6 cenas mapeadas para seu roteiro
✅ **Logo Separado:** Símbolo no Lower Third + Logo completo no canto
✅ **Sem Botões:** Sistema profissional sem controles na tela

## 🎯 **Sistema de 6 Cenas**

### **Cena 1: Abertura & Encerramento**
- **Ativa:** `enterfix.scene(1)`
- **Mostra:** Logo + Lower Third "Paulo Silva - CEO Enterfix"
- **Uso:** "Olá pessoal", fechamento, Q&A

### **Cena 2: Apresentação (Slides)**  
- **Ativa:** `enterfix.scene(2)`
- **Mostra:** Logo + Ticker de notícias
- **Uso:** PowerPoint, explicação de slides

### **Cena 3: Cabine de Comando (Split Screen)**
- **Ativa:** `enterfix.scene(3)`  
- **Mostra:** Logo + Moldura verde dividindo tela
- **Uso:** Software + Você + Máquina em multiview

### **Cena 4: Foco no Software (Treinamento)**
- **Ativa:** `enterfix.scene(4)`
- **Mostra:** Painel lateral com especificações técnicas
- **Uso:** Tela cheia do PC da máquina

### **Cena 5: A Máquina (Visão Geral)**  
- **Ativa:** `enterfix.scene(5)`
- **Mostra:** Logo + Lower Third "PEAK 400 - Solução Manaus"
- **Uso:** Mostrar máquina completa

### **Cena 6: O Detalhe (Gimbal)**
- **Ativa:** `enterfix.scene(6)`
- **Mostra:** Apenas logo (minimalista)
- **Uso:** Close-up nas peças, detalhes

## 🚀 **Configuração no OBS:**

### 1. **Adicionar Source Browser**
```
Tipo: Browser Source
URL: file:///C:/Users/paulo/OneDrive/Documentos/CODIGUINHO/OBS/index.html
Width: 1920
Height: 1080
```

### 2. **Propriedades Importantes**
- ✅ Shutdown source when not visible
- ✅ Refresh browser when scene becomes active  
- ❌ Control audio via OBS (deixar desmarcado)

### 3. **Hotkeys Recomendadas**
```
F1 = Cena 1 (Abertura)
F2 = Cena 2 (Slides) 
F3 = Cena 3 (Split)
F4 = Cena 4 (Software)
F5 = Cena 5 (Máquina)
F6 = Cena 6 (Detalhe)
```

## 🎮 **Controle via Console do Navegador:**

Abra DevTools (F12) e use:

### **Mudança de Cenas:**
```javascript
enterfix.scene(1)  // Abertura
enterfix.scene(2)  // Slides
enterfix.scene(3)  // Split
enterfix.scene(4)  // Software
enterfix.scene(5)  // Máquina
enterfix.scene(6)  // Detalhe
```

### **Controles Manuais (se precisar):**
```javascript
// Desabilitar auto-hide
enterfix.lowerThird.show('Nome', 'Cargo', false)

// Mudar tempo de auto-hide (padrão 12s)
enterfixAPI.setAutoHideDelay(15000) // 15 segundos
```

## 📸 **Preparar Logos:**

1. **logo-enterfix.png** (140x60px)
   - Logo completo da ENTERFIX
   - Fundo transparente
   - Coloque em: `assets/logo-enterfix.png`

2. **symbol-enterfix.png** (24x24px) 
   - Apenas o símbolo/ícone
   - Fundo transparente
   - Coloque em: `assets/symbol-enterfix.png`

## 🎪 **Demonstrações:**

### **Teste Rápido Todas Cenas:**
```javascript
demo.allScenes()  // Roda automaticamente 1-6
```

### **Fluxo de Apresentação Completo:**
```javascript
demo.presentation()  // Simula apresentação real
```

## 🔧 **Personalizar Conteúdos:**

Edite o arquivo `script.js` na seção `scenes:` para alterar textos padrão:

```javascript
'scene-1': {
    defaultLowerThird: { name: 'Seu Nome', title: 'Seu Cargo' }
},
'scene-2': {
    defaultTicker: 'Sua mensagem de ticker aqui'
}
```

---

## ⚡ **Quick Start:**

1. Coloque os logos na pasta `assets/`
2. Adicione Browser Source no OBS apontando para `index.html`
3. Configure hotkeys F1-F6 
4. Use `enterfix.scene(1)` no console para testar
5. Durante transmissão: pressione F1-F6 conforme o roteiro

**Sistema está pronto para produção! 🎬**