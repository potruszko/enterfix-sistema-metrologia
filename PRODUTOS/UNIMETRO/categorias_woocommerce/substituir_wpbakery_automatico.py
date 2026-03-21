import os
import re

def ler_arquivo_wpbakery(arquivo):
    """Lê o conteúdo de um arquivo WPBakery e escapa as aspas duplas para CSV"""
    try:
        with open(arquivo, 'r', encoding='utf-8') as file:
            content = file.read().strip()
            # Escapa aspas duplas para CSV
            content = content.replace('"', '""')
            return content
    except Exception as e:
        print(f"Erro ao ler {arquivo}: {e}")
        return None

def substituir_descricoes_wpbakery():
    """Substitui todas as descrições no CSV pelas versões WPBakery"""
    
    # Mapeamento SKU -> arquivo WPBakery
    mapeamento = {
        'BASIC-200': '../serie_basic/basic200_wpbakery_description.txt',
        'BASIC-300': '../serie_basic/basic300_wpbakery_description.txt',
        'BASIC-400': '../serie_basic/basic400_wpbakery_description.txt',
        'BASIC-500': '../serie_basic/basic500_wpbakery_description.txt',
        'EXTRA-200': '../serie_extra/extra200_wpbakery_description.txt',
        'EXTRA-300': '../serie_extra/extra300_wpbakery_description.txt',
        'EXTRA-400': '../serie_extra/extra400_wpbakery_description.txt',
        'EXTRA-500': '../serie_extra/extra500_wpbakery_description.txt',
        'PEAK-300': '../serie_peak/peak300_wpbakery_description.txt',
        'PEAK-400': '../serie_peak/peak400_wpbakery_description.txt',
        'ULTRA-200': '../serie_ultra/ultra200_wpbakery_description.txt',
        'ULTRA-300': '../serie_ultra/ultra300_wpbakery_description.txt',
        'ULTRA-400': '../serie_ultra/ultra400_wpbakery_description.txt',
        'ULTRA-500': '../serie_ultra/ultra500_wpbakery_description.txt',
        'ULTRA-600': '../serie_ultra/ultra600_wpbakery_description.txt',
        'RANGER-200': '../serie_ranger/ranger200_wpbakery_description.txt',
        'RANGER-600': '../serie_ranger/ranger600_wpbakery_description.txt',
        'AVANT-100': '../serie_avant/avant100_wpbakery_description.txt',
        'AVANT-190': '../serie_avant/avant190_wpbakery_description.txt',
        'CMM-STANDARD': '../serie_cmm/cmm_standard_wpbakery_description.txt',
        'GANTRY-HP': '../serie_gantry/gantry_hp_series_wpbakery_description.txt',
        'E-FIX': '../sistemas_fixacao/efix_wpbakery_description.txt',
        'OPTIFIX': '../sistemas_fixacao/optifix_wpbakery_description.txt'
    }
    
    # Ler arquivo CSV
    with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
        conteudo = file.read()
    
    substituicoes = 0
    
    for sku, arquivo_wpbakery in mapeamento.items():
        print(f"Processando {sku}...")
        
        # Ler conteúdo WPBakery
        wpbakery_content = ler_arquivo_wpbakery(arquivo_wpbakery)
        
        if wpbakery_content:
            # Procurar a linha do produto no CSV usando regex mais específico
            # Padrão: procura pela linha que contém o SKU e captura toda a descrição até a próxima linha
            pattern = f'(,simple,{re.escape(sku)},[^"]*,"[^"]*",")([^"]*)"([^\\n]*)'
            
            def substituir_descricao(match):
                inicio = match.group(1)  # Parte antes da descrição
                final = match.group(3)   # Parte depois da descrição
                return f'{inicio}{wpbakery_content}"{final}'
            
            conteudo_novo = re.sub(pattern, substituir_descricao, conteudo)
            
            if conteudo_novo != conteudo:
                conteudo = conteudo_novo
                substituicoes += 1
                print(f"✅ {sku} atualizado com WPBakery")
            else:
                print(f"❌ {sku} não encontrado ou já atualizado")
        else:
            print(f"❌ Erro ao ler arquivo WPBakery para {sku}")
    
    # Salvar arquivo atualizado
    with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as file:
        file.write(conteudo)
    
    print(f"\nTotal de substituições: {substituicoes}")
    print("Processo concluído!")

if __name__ == "__main__":
    substituir_descricoes_wpbakery()