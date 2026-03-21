import csv
import os

# Mapeamento de SKUs para arquivos WPBakery
wpbakery_files = {
    "BASIC-200": "serie_basic/basic200_wpbakery_description.txt",
    "BASIC-300": "serie_basic/basic300_wpbakery_description.txt", 
    "BASIC-400": "serie_basic/basic400_wpbakery_description.txt",
    "BASIC-500": "serie_basic/basic500_wpbakery_description.txt",
    "EXTRA-200": "serie_extra/extra200_wpbakery_description.txt",
    "EXTRA-300": "serie_extra/extra300_wpbakery_description.txt",
    "EXTRA-400": "serie_extra/extra400_wpbakery_description.txt",
    "EXTRA-500": "serie_extra/extra500_wpbakery_description.txt",
    "PEAK-300": "serie_peak/peak300_wpbakery_description.txt",
    "PEAK-400": "serie_peak/peak400_wpbakery_description.txt",
    "ULTRA-200": "serie_ultra/ultra200_wpbakery_description.txt",
    "ULTRA-300": "serie_ultra/ultra300_wpbakery_description.txt",
    "ULTRA-400": "serie_ultra/ultra400_wpbakery_description.txt",
    "ULTRA-500": "serie_ultra/ultra500_wpbakery_description.txt",
    "ULTRA-600": "serie_ultra/ultra600_wpbakery_description.txt",
    "RANGER-200": "serie_ranger/ranger200_wpbakery_description.txt",
    "RANGER-600": "serie_ranger/ranger600_wpbakery_description.txt",
    "AVANT-100": "serie_avant/avant100_wpbakery_description.txt",
    "AVANT-190": "serie_avant/avant190_wpbakery_description.txt",
    "CMM-STANDARD": "serie_cmm/cmm_standard_wpbakery_description.txt",
    "GANTRY-HP": "serie_gantry/gantry_hp_series_wpbakery_description.txt",
    "E-FIX": "sistemas_fixacao/efix_wpbakery_description.txt",
    "OPTIFIX": "sistemas_fixacao/optifix_wpbakery_description.txt"
}

def ler_arquivo_wpbakery(file_path):
    """Lê o conteúdo de um arquivo WPBakery"""
    full_path = os.path.join("..", file_path)
    try:
        with open(full_path, 'r', encoding='utf-8') as file:
            return file.read().strip()
    except FileNotFoundError:
        print(f"Arquivo não encontrado: {full_path}")
        return None

def atualizar_csv_com_wpbakery():
    """Atualiza o CSV com as descrições WPBakery"""
    
    # Ler o CSV atual
    with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
        lines = file.readlines()
    
    atualizacoes = 0
    
    # Processar cada linha
    for i, line in enumerate(lines):
        if i == 0:  # Pular cabeçalho
            continue
            
        # Dividir a linha em campos (cuidado com vírgulas dentro de aspas)
        try:
            # Usar csv.reader para lidar com vírgulas dentro de aspas
            reader = csv.reader([line])
            row = next(reader)
            
            if len(row) >= 9:  # Verificar se tem colunas suficientes
                sku = row[2]  # SKU está na coluna 2
                
                if sku in wpbakery_files:
                    # Ler descrição WPBakery
                    wpbakery_content = ler_arquivo_wpbakery(wpbakery_files[sku])
                    
                    if wpbakery_content:
                        # Substituir a descrição (coluna 8 - índice 8)
                        row[8] = wpbakery_content
                        
                        # Reconstruir a linha
                        writer_output = []
                        writer = csv.writer(writer_output)
                        writer.writerow(row)
                        lines[i] = writer_output[0] + '\n'
                        
                        atualizacoes += 1
                        print(f"Atualizado {sku} com WPBakery")
                    else:
                        print(f"Erro ao ler arquivo WPBakery para {sku}")
        except Exception as e:
            print(f"Erro ao processar linha {i}: {e}")
            continue
    
    # Salvar arquivo atualizado
    with open('woocommerce_import_completo.csv', 'w', encoding='utf-8', newline='') as file:
        file.writelines(lines)
    
    print(f"\nTotal de atualizações: {atualizacoes}")
    print("CSV atualizado com descrições WPBakery!")

if __name__ == "__main__":
    atualizar_csv_com_wpbakery()