import os
import csv

def recriar_csv_com_wpbakery_atualizado():
    """Recria o CSV com todos os códigos WPBakery atualizados"""
    
    # Mapeamento SKU -> arquivo WPBakery atualizado
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
    
    def ler_wpbakery_atualizado(arquivo):
        """Lê o arquivo WPBakery atualizado"""
        try:
            with open(arquivo, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                # Remove quebras de linha para manter em uma linha do CSV
                content = content.replace('\\n', ' ').replace('\\r', '')
                return content
        except Exception as e:
            print(f"Erro ao ler {arquivo}: {e}")
            return None
    
    # Ler CSV atual
    print("Lendo CSV atual...")
    with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        linhas = list(reader)
    
    print(f"CSV tem {len(linhas)} linhas")
    
    atualizacoes = 0
    
    # Processar cada linha
    for i, linha in enumerate(linhas):
        if i == 0:  # Pular cabeçalho
            continue
            
        if len(linha) >= 9:  # Verificar se tem colunas suficientes
            sku = linha[2]  # SKU está na coluna 2
            
            if sku in mapeamento:
                print(f"Atualizando {sku}...")
                
                # Ler descrição WPBakery atualizada
                wpbakery_content = ler_wpbakery_atualizado(mapeamento[sku])
                
                if wpbakery_content:
                    # Substituir a descrição (coluna 8)
                    linha[8] = wpbakery_content
                    atualizacoes += 1
                    print(f"✅ {sku} atualizado com nova estrutura CSS")
                else:
                    print(f"❌ Erro ao ler WPBakery para {sku}")
    
    # Salvar CSV atualizado
    print("\\nSalvando CSV atualizado...")
    with open('woocommerce_import_completo.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(linhas)
    
    print(f"\\n🎉 CSV atualizado com sucesso!")
    print(f"📊 {atualizacoes} produtos atualizados")
    print(f"🎯 Todas as tabelas agora usam class='table-enterfix'")

if __name__ == "__main__":
    recriar_csv_com_wpbakery_atualizado()