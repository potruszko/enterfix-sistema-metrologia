#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path

def corrigir_tabelas_scanology():
    """Corrige todas as tabelas Scanology para usar class='table-enterfix'"""
    
    # Diretório raiz do projeto Scanology
    pasta_scanology = Path(r"c:\Users\paulo\OneDrive\Documentos\CODIGUINHO\PRODUTOS\scanology")
    
    arquivos_corrigidos = 0
    total_tabelas_corrigidas = 0
    
    print("🔧 Iniciando correção das tabelas Scanology...")
    print(f"📁 Pasta: {pasta_scanology}")
    print("-" * 60)
    
    # Buscar todos os arquivos .txt recursivamente
    for arquivo_path in pasta_scanology.rglob("*.txt"):
        try:
            with open(arquivo_path, 'r', encoding='utf-8') as f:
                conteudo = f.read()
            
            # Verificar se há tabelas com table-scanology
            if 'table-scanology' in conteudo:
                print(f"📝 Corrigindo: {arquivo_path.name}")
                
                # Corrigir class="table-scanology" para class="table-enterfix"
                conteudo_corrigido = conteudo.replace('table-scanology', 'table-enterfix')
                
                # Contar quantas tabelas foram corrigidas neste arquivo
                tabelas_neste_arquivo = conteudo.count('table-scanology')
                total_tabelas_corrigidas += tabelas_neste_arquivo
                
                # Salvar arquivo corrigido
                with open(arquivo_path, 'w', encoding='utf-8') as f:
                    f.write(conteudo_corrigido)
                
                arquivos_corrigidos += 1
                print(f"   ✅ {tabelas_neste_arquivo} tabela(s) corrigida(s)")
            
        except Exception as e:
            print(f"❌ Erro ao processar {arquivo_path.name}: {e}")
    
    print("-" * 60)
    print(f"✅ Correção concluída!")
    print(f"📊 Arquivos corrigidos: {arquivos_corrigidos}")
    print(f"📊 Total de tabelas corrigidas: {total_tabelas_corrigidas}")
    print(f"🎯 Todas as tabelas Scanology agora usam class='table-enterfix'")

def verificar_resultado():
    """Verifica se a correção foi bem-sucedida"""
    
    pasta_scanology = Path(r"c:\Users\paulo\OneDrive\Documentos\CODIGUINHO\PRODUTOS\scanology")
    
    tabelas_enterfix = 0
    tabelas_scanology = 0
    
    for arquivo_path in pasta_scanology.rglob("*.txt"):
        try:
            with open(arquivo_path, 'r', encoding='utf-8') as f:
                conteudo = f.read()
            
            tabelas_enterfix += conteudo.count('table-enterfix')
            tabelas_scanology += conteudo.count('table-scanology')
            
        except Exception as e:
            print(f"❌ Erro ao verificar {arquivo_path.name}: {e}")
    
    print("\n🔍 VERIFICAÇÃO FINAL:")
    print(f"✅ Tabelas com 'table-enterfix': {tabelas_enterfix}")
    print(f"❌ Tabelas com 'table-scanology' restantes: {tabelas_scanology}")
    
    if tabelas_scanology == 0:
        print("🎉 SUCESSO! Todas as tabelas foram corrigidas para o padrão correto!")
    else:
        print("⚠️  Ainda há tabelas com o padrão incorreto.")

if __name__ == "__main__":
    corrigir_tabelas_scanology()
    verificar_resultado()