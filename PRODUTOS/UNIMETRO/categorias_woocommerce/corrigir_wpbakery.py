import os
import re

def ler_arquivo_wpbakery_limpo(arquivo):
    """Lê o conteúdo de um arquivo WPBakery, remove quebras de linha e escapa aspas para CSV"""
    try:
        with open(arquivo, 'r', encoding='utf-8') as file:
            content = file.read().strip()
            # Remove quebras de linha e substitui por espaços
            content = content.replace('\n', ' ').replace('\r', ' ')
            # Remove espaços múltiplos
            content = re.sub(r'\s+', ' ', content)
            # Escapa aspas duplas para CSV
            content = content.replace('"', '""')
            return content
    except Exception as e:
        print(f"Erro ao ler {arquivo}: {e}")
        return None

def restaurar_csv_backup():
    """Restaura o CSV do backup se existir"""
    backup_file = 'woocommerce_import_backup.csv'
    if os.path.exists(backup_file):
        with open(backup_file, 'r', encoding='utf-8') as backup:
            content = backup.read()
        with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as main:
            main.write(content)
        print("CSV restaurado do backup")
        return True
    return False

def criar_backup():
    """Cria backup do CSV atual"""
    with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as main:
        content = main.read()
    with open('woocommerce_import_backup.csv', 'w', encoding='utf-8') as backup:
        backup.write(content)
    print("Backup criado")

def substituir_descricoes_wpbakery_corrigido():
    """Substitui todas as descrições no CSV pelas versões WPBakery limpas"""
    
    # Criar backup primeiro
    criar_backup()
    
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
    
    # Se o arquivo está corrompido, tentar restaurar backup
    if not restaurar_csv_backup():
        print("Nenhum backup encontrado, continuando com arquivo atual")
    
    # Ler arquivo CSV
    with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
        linhas = file.readlines()
    
    substituicoes = 0
    
    for sku, arquivo_wpbakery in mapeamento.items():
        print(f"Processando {sku}...")
        
        # Ler conteúdo WPBakery limpo
        wpbakery_content = ler_arquivo_wpbakery_limpo(arquivo_wpbakery)
        
        if wpbakery_content:
            # Procurar e substituir a linha do produto
            for i, linha in enumerate(linhas):
                if f',{sku},' in linha and ',simple,' in linha:
                    # Dividir a linha em partes
                    partes = linha.split(',')
                    if len(partes) >= 9:
                        # Substituir apenas a descrição (índice 8)
                        partes[8] = f'"{wpbakery_content}"'
                        # Reconstruir a linha
                        linhas[i] = ','.join(partes)
                        substituicoes += 1
                        print(f"✅ {sku} atualizado com WPBakery")
                        break
            else:
                print(f"❌ {sku} não encontrado no CSV")
        else:
            print(f"❌ Erro ao ler arquivo WPBakery para {sku}")
    
    # Salvar arquivo atualizado
    with open('woocommerce_import_completo.csv', 'w', encoding='utf-8', newline='') as file:
        file.writelines(linhas)
    
    print(f"\nTotal de substituições: {substituicoes}")
    print("Processo concluído!")

if __name__ == "__main__":
    substituir_descricoes_wpbakery_corrigido()