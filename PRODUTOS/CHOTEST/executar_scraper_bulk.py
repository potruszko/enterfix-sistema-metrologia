#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Executor Simplificado - Scraper Bulk
Executa o scraping em modo automático com progresso visual
"""

import sys
import os
from pathlib import Path

# Força UTF-8 no Windows
if sys.platform == 'win32':
    os.environ['PYTHONIOENCODING'] = 'utf-8'
    
from scraper_bulk import ChoTestBulkScraper
import logging

# Configurar logging mais visual
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s',
    encoding='utf-8'
)


def exibir_banner():
    """Exibe banner inicial"""
    print("""
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║        SCRAPER BULK - CHOTEST.COM                                 ║
║        Extrator Automatico de TODOS os Produtos por Categoria     ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
    """)


def main():
    """Execução simplificada"""
    
    exibir_banner()
    
    print("[1] Inicializando scraper...")
    scraper = ChoTestBulkScraper("https://en.chotest.com")
    
    print("\n[2] Descobrindo categorias do site...")
    categorias = scraper.descobrir_categorias()
    
    print(f"\n[OK] Encontradas {len(categorias)} categorias:")
    for i, cat in enumerate(categorias.keys(), 1):
        print(f"   {i}. {cat}")
    
    print("\n[3] Extraindo produtos de cada categoria...")
    print("    (Isso pode levar alguns minutos dependendo do tamanho do site)\n")
    
    produtos = scraper.extrair_todas_categorias()
    
    total_produtos = sum(len(p) for p in produtos.values())
    print(f"\n[OK] Total de produtos encontrados: {total_produtos}")
    
    for categoria, prods in produtos.items():
        print(f"   * {categoria}: {len(prods)} produtos")
    
    print("\n[4] Salvando estrutura de diretórios...")
    scraper.salvar_estrutura("chotest_produtos")
    
    print("\n[5] Gerando relatorio final...")
    print(scraper.gerar_relatorio())
    
    print("COMPLETO - SCRAPING FINALIZADO COM SUCESSO!")
    print(f"\nPasta de saida: chotest_produtos/")
    print(f"Verifique a estrutura para ver todos os produtos por categoria")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrompido pelo usuario")
        sys.exit(1)
    except Exception as e:
        print(f"\nErro fatal: {e}")
        sys.exit(1)
