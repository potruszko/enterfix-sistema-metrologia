# 🚀 SCRAPER BULK - CHOTEST AUTOMÁTICO

Script avançado que faz **levantamento automático de TODOS os produtos** do site Chotest, organizando-os por categorias automaticamente.

---

## 📊 O QUE FAZ

✅ **Descobre automaticamente** todas as categorias do site  
✅ **Extrai lista de produtos** de cada categoria  
✅ **Raspa dados completos** de cada produto (título, imagem, descrição, specs)  
✅ **Traduz para PT-BR** automaticamente  
✅ **Organiza em pastas** por categoria  
✅ **Gera índices JSON** para referência rápida  
✅ **Produz relatório** de resultados  

---

## 🚀 USO RÁPIDO

### Modo Automático (Recomendado)

```powershell
python executar_scraper_bulk.py
```

Isso vai:
1. ✓ Descobrir categorias
2. ✓ Extrair todos os produtos
3. ✓ Processar e traduzir
4. ✓ Salvar em `chotest_produtos/`

---

## 📁 ESTRUTURA DE SAÍDA

```
chotest_produtos/
├── indice_geral.json                    # Índice geral de tudo
│
├── Scanners Portateis/
│   ├── 001_MSCAN_L15.html
│   ├── 002_AXE_B.html
│   └── indice.json
│
├── Metrologia 3D/
│   ├── 001_M_Track.html
│   ├── 002_NimbleTrack_C.html
│   └── indice.json
│
├── Fotogrametria/
│   ├── 001_Sistema_Fotogrametria.html
│   └── indice.json
│
├── Softwares 3D/
│   ├── 001_DefiniSight.html
│   ├── 002_ScanViewer.html
│   └── indice.json
│
└── ... mais categorias
```

---

## 📋 ARQUIVOS CRIADOS

### 1. **scraper_bulk.py** - Motor Principal
```python
ChoTestBulkScraper(url)
  ├── descobrir_categorias()        # Encontra categorias automaticamente
  ├── extrair_produtos_categoria()  # Extrai lista de produtos
  ├── extrair_todas_categorias()    # Processa todas as categorias
  ├── processar_todos_produtos()    # Detalha cada produto (paralelo)
  ├── traduzir_produto()            # Traduz para PT-BR
  ├── gerar_html_produto()          # Cria HTML template
  ├── salvar_estrutura()            # Salva em diretórios
  └── gerar_relatorio()             # Cria sumário
```

### 2. **executar_scraper_bulk.py** - Interface Simples
- Execução com 1 comando
- Progresso visual
- Trata erros graciosamente

---

## 🔍 DESCOBERTA AUTOMÁTICA DE CATEGORIAS

O script tenta 3 estratégias:

**Estratégia 1**: Varre todo HTML procurando links com "category", "product", "shop"  
**Estratégia 2**: Procura menu de navegação (`<nav>`)  
**Estratégia 3**: Fallback com categorias conhecidas (conforme seu workspace)

Se nenhuma funcionar, usa fallback com categorias típicas do Chotest:
- Scanners Portateis
- Fotogrametria
- Metrologia 3D
- Softwares 3D
- Sistemas Automatizados
- Scanners Industriais
- Rastreamento 6D

---

## ⚙️ RECURSOS AVANÇADOS

### Processamento Paralelo

```python
scraper.processar_todos_produtos(max_workers=3)
```

Processa múltiplos produtos simultaneamente (3 threads por padrão).

### Tradução Inteligente

Cada campo é traduzido:
- ✓ Nome do produto
- ✓ Descrição
- ✓ Features/Características
- ✓ Glossário Enterfix aplicado

### Índices JSON

Cada categoria gera `indice.json`:
```json
{
  "categoria": "Scanners Portateis",
  "total_produtos": 12,
  "produtos": [
    {
      "nome": "MSCAN L15",
      "arquivo": "001_MSCAN_L15.html",
      "url_original": "https://chotest.com/product/mscan-l15"
    }
  ]
}
```

---

## 📊 EXEMPLO DE SAÍDA

```
╔════════════════════════════════════════════════════════════════════╗
║        🚀 SCRAPER BULK - CHOTEST.COM                              ║
║        Extrator Automático de TODOS os Produtos por Categoria     ║
╚════════════════════════════════════════════════════════════════════╝

[1️⃣] Inicializando scraper...

[2️⃣] Descobrindo categorias do site...

✓ Encontradas 7 categorias:
   1. Scanners Portateis
   2. Fotogrametria
   3. Metrologia 3D
   4. Softwares 3D
   5. Sistemas Automatizados
   6. Scanners Industriais
   7. Rastreamento 6D

[3️⃣] Extraindo produtos de cada categoria...

✓ Total de produtos encontrados: 45

   • Scanners Portateis: 8 produtos
   • Fotogrametria: 3 produtos
   • Metrologia 3D: 6 produtos
   • Softwares 3D: 4 produtos
   • Sistemas Automatizados: 5 produtos
   • Scanners Industriais: 10 produtos
   • Rastreamento 6D: 9 produtos

[4️⃣] Salvando estrutura de diretórios...

✓ Estrutura completa salva em: C:\...\chotest_produtos

[5️⃣] Gerando relatório final...

======================================================================
RELATÓRIO DE SCRAPING - CHOTEST.COM
======================================================================

Data de Geração: 29/12/2025 14:30:45

RESUMO EXECUTIVO:
  • Total de Categorias: 7
  • Total de Produtos: 45

DETALHAMENTO POR CATEGORIA:
  [Scanners Portateis]
    Produtos: 8
    • MSCAN L15
    • AXE-B
    • TrackScan-Sharp
    ... e mais 5 produtos

  [Metrologia 3D]
    Produtos: 6
    • M-Track
    • NimbleTrack-C
    • TrackProbe
    ... e mais 3 produtos

======================================================================

✅ SCRAPING CONCLUÍDO COM SUCESSO!

📁 Pasta de saída: chotest_produtos/
📊 Verifique a estrutura para ver todos os produtos por categoria
```

---

## 🚦 PROGRESSO E LOGS

Durante a execução:

```
2025-12-29 14:25:10 - INFO - Descobrindo categorias do site...
2025-12-29 14:25:12 - INFO - ✓ Encontradas 7 categorias
2025-12-29 14:25:12 - INFO - Extraindo produtos de: Scanners Portateis
2025-12-29 14:25:13 - INFO -   ✓ 8 produtos encontrados em Scanners Portateis
2025-12-29 14:25:14 - INFO - Extraindo produtos de: Metrologia 3D
2025-12-29 14:25:15 - INFO -   ✓ 6 produtos encontrados em Metrologia 3D
...
```

**Logs completos salvos em**: `scraper_bulk.log`

---

## 🎯 CASOS DE USO

### 1️⃣ Primeira Execução - Fazer Levantamento Completo
```powershell
python executar_scraper_bulk.py
```
Resultado: Pasta `chotest_produtos/` com todos os produtos

### 2️⃣ Atualizar Apenas Uma Categoria
```python
scraper = ChoTestBulkScraper("https://chotest.com")
categoria_url = "https://chotest.com/product-category/scanners-portateis/"
produtos = scraper.extrair_produtos_categoria("Scanners Portateis", categoria_url)
```

### 3️⃣ Exportar para CSV/Excel
```python
import json
with open('chotest_produtos/indice_geral.json') as f:
    dados = json.load(f)
# Processa dados conforme necessário
```

---

## ⚠️ CONSIDERAÇÕES

- ⏱️ **Tempo**: Primeira execução pode levar 10-30 minutos (depende do tamanho)
- 🌐 **Internet**: Requer conexão ativa durante todo o processo
- 🔄 **Rate Limiting**: Usa delays automáticos para não sobrecarregar servidor
- 💾 **Espaço**: ~50-100MB dependendo de quantidade de imagens
- 📊 **Atualizações**: Re-execute para atualizar com novos produtos

---

## 🔧 PERSONALIZAÇÃO

### Customizar Diretório de Saída
```python
scraper.salvar_estrutura("meu_diretorio_customizado")
```

### Mudar Threads Paralelas
```python
scraper.processar_todos_produtos(max_workers=5)  # Mais rápido
scraper.processar_todos_produtos(max_workers=1)  # Mais seguro
```

### Adicionar Categorias Manualmente
```python
scraper.categorias = {
    "Minha Categoria": "https://chotest.com/category/minha",
    ...
}
```

---

## 📝 NEXT STEPS

1. Execute o scraper: `python executar_scraper_bulk.py`
2. Aguarde conclusão
3. Acesse pasta `chotest_produtos/`
4. Cada categoria terá seus HTMLs
5. Abra `indice_geral.json` para ver sumário

**Tudo organizado, categorizado e pronto para publicação!** 🎉

---

**Versão**: 2.0 (Bulk)  
**Data**: 29/12/2024  
**Especialização**: Web Scraping Avançado + Metrologia Industrial
