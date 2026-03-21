# 🚀 SCRAPER CHOTEST - CONVERSOR PARA HTML ENTERFIX

Script Python senior para extrair e converter produtos do site **chotest.com** para formato HTML padrão Enterfix com tradução automática.

---

## 📋 REQUISITOS

- Python 3.8+
- Bibliotecas listadas em `requirements.txt`

### Instalação de Dependências

```powershell
pip install -r requirements.txt
```

Ou manualmente:

```powershell
pip install requests beautifulsoup4 deep-translator pyperclip
```

---

## 🎯 MODOS DE USO

### Modo 1: Direto no Script (Rápido)

1. Abra `scraper_chotest.py`
2. Localize a linha:
   ```python
   URL_PRODUTO = "https://chotest.com/product/example"  # <-- EDITE AQUI
   ```
3. Cole a URL do produto
4. Execute:
   ```powershell
   python scraper_chotest.py
   ```
5. O HTML será exibido no terminal e salvo automaticamente

---

### Modo 2: Interface Interativa (Recomendado)

Não precisa editar código. Simplesmente execute:

```powershell
python scraper_interativo.py
```

Depois cole a URL quando solicitado. O script gera HTML, salva arquivo e oferece opção de copiar para clipboard.

---

## 🔄 FLUXO DE FUNCIONAMENTO

```
┌─────────────────────────────────┐
│ URL do Produto Chotest          │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ 1. FETCH - Download da página   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ 2. PARSING - Extração de dados:             │
│    • Título (H1)                            │
│    • Imagem Principal                       │
│    • Descrição/Features (<ul>, <p>)         │
│    • Tabelas de Especificações (<table>)    │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ 3. TRADUÇÃO - Google Translate              │
│    English → Português (PT-BR)              │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ 4. GLOSSÁRIO - Find & Replace Mandatório:   │
│    • Probe → Apalpador                      │
│    • Stylus → Ponta de Contato              │
│    • Runout → Batimento                     │
│    • Accuracy → Exatidão                    │
│    • Repeatability → Repetibilidade         │
│    • Workpiece → Peça                       │
│    • Spindle → Spindle (mantém)             │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ 5. TEMPLATE - Formato HTML Enterfix         │
│    <div class="probe-product-wrapper">      │
│    • Título traduzido                       │
│    • Imagem responsive                      │
│    • Features formatadas                    │
│    • Tabela HTML traduzida                  │
│    • CTA com botão de download              │
└────────────┬────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────┐
│ 6. SAÍDA - Arquivo HTML + Terminal Output   │
│    Nome: produto_TITULO_TIMESTAMP.html      │
└─────────────────────────────────────────────┘
```

---

## 📊 O QUE O SCRIPT EXTRAI

### ✅ Título do Produto
- Busca em `<h1>`, `h1.product-title`, `[data-product-title]`
- Traduzido para PT-BR

### ✅ Imagem Principal
- Procura por `img.featured-image`, `img.main-image`
- Converte para URL absoluta se necessário
- Inserida com classe `probe-img-responsive`

### ✅ Descrição
- Extrai de divs `.product-description`, `.short-description`
- Fallback para primeiros `<p>` da página
- Limitada a 300 caracteres
- Traduzida com glossário aplicado

### ✅ Características Principais
- Busca `<ul>` com 3+ itens
- Limita a 8 features principais
- Cada uma traduzida individualmente

### ✅ Tabela de Especificações
- Extrai primeira `<table>` encontrada
- Traduz todas as células (`<td>`, `<th>`)
- Aplica glossário nos valores técnicos

---

## 🔤 GLOSSÁRIO MANDATÓRIO

Após tradução automática, o script aplica estas substituições obrigatórias:

| Original | Substituir Por | Notas |
|----------|--------------|-------|
| Probe | Apalpador | NUNCA usar 'Sonda' |
| Stylus | Ponta de Contato | Ou 'Haste' se contexto apropriado |
| Spindle | Spindle | Mantém original (termo técnico) |
| Runout | Batimento | Metrologia |
| Accuracy | Exatidão | Qualidade/Precisão |
| Repeatability | Repetibilidade | Confiabilidade |
| Workpiece | Peça | Manufatura |

---

## 📁 ESTRUTURA DE SAÍDA

Os arquivos HTML gerados seguem este padrão:

```html
<div class="probe-product-wrapper">
    <div class="probe-grid-2">
        <div class="probe-text-col">
            <h2>TITULO TRADUZIDO</h2>
            <h3>Solução de Medição Industrial</h3>
            <p>DESCRICAO TRADUZIDA</p>
        </div>
        <div class="probe-img-col">
            <img class="probe-img-responsive" src="URL_IMAGEM" alt="TITULO" />
        </div>
    </div>

    <div class="probe-features-box">
        <h3>Características Principais</h3>
        <ul class="probe-features-list">
            <li>Feature 1 traduzida</li>
            <li>Feature 2 traduzida</li>
            ...
        </ul>
    </div>

    <div class="probe-specs-container">
        <h3>Especificações Técnicas</h3>
        <table>...</table>
    </div>

    <div class="probe-cta-box">
        <a class="probe-btn" href="#" target="_blank" download>
            📥 Baixar Catálogo Técnico
        </a>
        <p>Suporte técnico Enterfix.</p>
    </div>
</div>
```

---

## 🎓 EXEMPLOS

### Exemplo 1: Executar com URL específica

**scraper_chotest.py:**
```python
URL_PRODUTO = "https://chotest.com/product/traclabs-axe"
```

```powershell
python scraper_chotest.py
```

**Output:**
```
[*] Acessando: https://chotest.com/product/traclabs-axe
[✓] Página carregada com sucesso
[✓] Título encontrado: AXE-B Portable CMM
[✓] Imagem encontrada: ...
[✓] Descrição encontrada: ...
[✓] Encontradas 6 features
[✓] Tabela de especificações encontrada

[*] Traduzindo conteúdo...
[✓] Tradução concluída

[✓] Arquivo salvo: C:\Users\paulo\...\produto_AXE-B_Portable_CMM_20250101_120000.html
```

### Exemplo 2: Modo interativo

```powershell
python scraper_interativo.py

╔══════════════════════════════════════════════════════════╗
║      SCRAPER CHOTEST - CONVERSOR PARA HTML ENTERFIX      ║
╚══════════════════════════════════════════════════════════╝

[OPÇÕES]
1. Colar URL de produto
2. Sair

Escolha uma opção (1-2): 1

[Cole a URL do produto Chotest]: https://chotest.com/product/m-track

[*] Acessando: https://chotest.com/product/m-track
...
[✓] Arquivo salvo em:
   C:\...\produto_M-Track_20250101_120530.html

Deseja copiar HTML para a área de transferência? (s/n): s
[✓] HTML copiado para clipboard!
```

---

## 🛠️ PERSONALIZAÇÕES

### Alterar Glossário

Edite a variável `GLOSSARIO_ENTERFIX` em `scraper_chotest.py`:

```python
GLOSSARIO_ENTERFIX = {
    r'\bProbe\b': 'Seu Termo Aqui',
    r'\bNovoTermoIngles\b': 'Novo Termo PT',
    # ... adicionar mais conforme necessário
}
```

### Mudar Idioma de Tradução

Na classe `ChoTestScraper.__init__()`, altere:

```python
self.translator = GoogleTranslator(
    source_language='en',      # Origem
    target_language='pt'       # Destino: pt=Português, es=Espanhol, etc
)
```

### Ajustar Seletores CSS

Se o site Chotest alterar estrutura HTML, edite os seletores em:
- `extract_titulo()` - linhas 105-118
- `extract_imagem()` - linhas 138-160
- `extract_descricao()` - linhas 177-207
- `extract_features()` - linhas 223-249

---

## ⚠️ TRATAMENTO DE ERROS

O script é resiliente:

- ❌ Página não acessível → Mensagem de erro, para execução
- ❌ Elemento não encontrado → Mensagem informativa, continua com fallbacks
- ❌ Tradução falha → Mantém texto original
- ❌ Tabela não existe → Exibe mensagem "Especificações não disponíveis"

---

## 📊 LOGS E DEBUGGING

Todos os passos são exibidos no terminal:

```
[*] = Etapa em andamento
[✓] = Sucesso
[✗] = Erro
[!] = Aviso/Info
```

Para mais detalhes, você pode adicionar `print()` nas funções específicas de interesse.

---

## 🔐 SEGURANÇA

- ✅ User-Agent realista para evitar bloqueios
- ✅ Timeout de 10s para requisições
- ✅ Sanitização de nomes de arquivo
- ✅ Sem storage de credenciais
- ✅ Respeita robots.txt (implicitamente, sem rate limiting agressivo)

---

## 📝 NOTAS IMPORTANTES

1. **Velocidade**: Primeira execução pode levar 5-10s (tradução Google Translate)
2. **Conexão**: Requer internet ativa para tradução e acesso ao Chotest
3. **Limites**: Google Translate tem limite de requisições/dia (raramente atingido em uso normal)
4. **Formato**: HTML gerado é compatível com template Enterfix padrão
5. **Arquivo**: Salvo sempre no diretório onde o script é executado

---

## 🚀 PRÓXIMOS PASSOS

1. Instale dependências: `pip install -r requirements.txt`
2. Use Modo Interativo: `python scraper_interativo.py`
3. Cole URLs do Chotest conforme necessário
4. HTML fica pronto para publicação na Unimetro/Enterfix

---

**Versão**: 1.0  
**Data**: 29/12/2024  
**Desenvolvedor**: Python Sênior - Especialista Web Scraping + Metrologia Industrial
