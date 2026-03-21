import os
import re

# Padronização dos nomes das séries
padronizacao = {
    # Série BASIC - Máquina de Medição Manual
    'BASIC 200 - Máquina de Medição Manual': 'BASIC 200 - Máquina de Medição Manual',
    'BASIC 300 - Máquina de Medição Manual': 'BASIC 300 - Máquina de Medição Manual', 
    'BASIC 400 - Máquina de Medição Manual': 'BASIC 400 - Máquina de Medição Manual',
    'BASIC 500 - Máquina de Medição Manual': 'BASIC 500 - Máquina de Medição Manual',
    
    # Série EXTRA - Máquina Semi-Automática
    'EXTRA 200 - Máquina Semi-Automática': 'EXTRA 200 - Máquina Semi-Automática',
    'EXTRA 300 - Máquina Semi-Automática': 'EXTRA 300 - Máquina Semi-Automática',
    'EXTRA 400 - Máquina Semi-Automática': 'EXTRA 400 - Máquina Semi-Automática', 
    'EXTRA 500 - Máquina Semi-Automática': 'EXTRA 500 - Máquina Semi-Automática',
    
    # Série PEAK - Máquina CNC Compacta
    'PEAK 300 - Máquina CNC Compacta': 'PEAK 300 - Máquina CNC Compacta',
    'PEAK 400 - Máquina CNC Compacta': 'PEAK 400 - Máquina CNC Compacta',
    
    # Série ULTRA - Máquina de Medição Avançada
    'ULTRA 200 - Máquina de Medição Avançada': 'ULTRA 200 - Máquina de Medição Avançada',
    'ULTRA 300 - Máquina de Medição Avançada': 'ULTRA 300 - Máquina de Medição Avançada',
    'ULTRA 400 - Máquina de Medição Avançada': 'ULTRA 400 - Máquina de Medição Avançada',
    'ULTRA 500 - Máquina de Medição Avançada': 'ULTRA 500 - Máquina de Medição Avançada',
    'ULTRA 600 - Máquina de Medição Avançada': 'ULTRA 600 - Máquina de Medição Avançada',
}

def atualizar_nomes_produtos():
    """Atualiza os nomes dos produtos nos arquivos WPBakery para seguir a padronização"""
    
    # Dicionário com mapeamento de arquivos e seus novos nomes
    arquivos_produtos = {
        '../serie_basic/basic200_wpbakery_description.txt': 'BASIC 200 - Máquina de Medição Manual',
        '../serie_basic/basic300_wpbakery_description.txt': 'BASIC 300 - Máquina de Medição Manual',
        '../serie_basic/basic400_wpbakery_description.txt': 'BASIC 400 - Máquina de Medição Manual',
        '../serie_basic/basic500_wpbakery_description.txt': 'BASIC 500 - Máquina de Medição Manual',
        
        '../serie_extra/extra200_wpbakery_description.txt': 'EXTRA 200 - Máquina Semi-Automática',
        '../serie_extra/extra300_wpbakery_description.txt': 'EXTRA 300 - Máquina Semi-Automática',
        '../serie_extra/extra400_wpbakery_description.txt': 'EXTRA 400 - Máquina Semi-Automática',
        '../serie_extra/extra500_wpbakery_description.txt': 'EXTRA 500 - Máquina Semi-Automática',
        
        '../serie_peak/peak300_wpbakery_description.txt': 'PEAK 300 - Máquina CNC Compacta',
        '../serie_peak/peak400_wpbakery_description.txt': 'PEAK 400 - Máquina CNC Compacta',
        
        '../serie_ultra/ultra200_wpbakery_description.txt': 'ULTRA 200 - Máquina de Medição Avançada',
        '../serie_ultra/ultra300_wpbakery_description.txt': 'ULTRA 300 - Máquina de Medição Avançada',
        '../serie_ultra/ultra400_wpbakery_description.txt': 'ULTRA 400 - Máquina de Medição Avançada',
        '../serie_ultra/ultra500_wpbakery_description.txt': 'ULTRA 500 - Máquina de Medição Avançada',
        '../serie_ultra/ultra600_wpbakery_description.txt': 'ULTRA 600 - Máquina de Medição Avançada',
    }
    
    atualizados = 0
    
    for arquivo, novo_nome in arquivos_produtos.items():
        if os.path.exists(arquivo):
            try:
                # Ler arquivo
                with open(arquivo, 'r', encoding='utf-8') as f:
                    conteudo = f.read()
                
                # Procurar padrões de nome antigos e substituir
                # Procurar por padrões como "Download do Catálogo...ENTERFIX BASIC 200"
                padrao_catalogo = r'(ENTERFIX\s+)([A-Z]+\s+\d+)'
                
                def substituir_nome(match):
                    prefix = match.group(1)  # "ENTERFIX "
                    produto_antigo = match.group(2)  # ex: "BASIC 200"
                    
                    # Mapear para o nome padronizado
                    for nome_padrao in arquivos_produtos.values():
                        if produto_antigo in nome_padrao:
                            return prefix + nome_padrao
                    
                    return match.group(0)  # Se não encontrar, manter original
                
                conteudo_novo = re.sub(padrao_catalogo, substituir_nome, conteudo)
                
                # Procurar outros padrões de título nos shortcodes
                padrao_titulo = r'(heading=")[^"]*(' + re.escape(novo_nome.split(' - ')[0]) + r')[^"]*(")'
                
                # Se houve mudança, salvar
                if conteudo_novo != conteudo:
                    with open(arquivo, 'w', encoding='utf-8') as f:
                        f.write(conteudo_novo)
                    atualizados += 1
                    print(f"✅ Atualizado: {arquivo}")
                else:
                    print(f"ℹ️ Sem mudanças: {arquivo}")
                    
            except Exception as e:
                print(f"❌ Erro ao processar {arquivo}: {e}")
        else:
            print(f"❌ Arquivo não encontrado: {arquivo}")
    
    print(f"\nTotal de arquivos atualizados: {atualizados}")

def atualizar_csv_com_nomes_padronizados():
    """Atualiza o CSV com os nomes padronizados"""
    
    try:
        with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as f:
            conteudo = f.read()
        
        # Substituições no CSV
        substituicoes = {
            # Série EXTRA
            'EXTRA 200 - Medição Semi-Automática': 'EXTRA 200 - Máquina Semi-Automática',
            'EXTRA 300 - Medição Semi-Automática': 'EXTRA 300 - Máquina Semi-Automática',
            'EXTRA 400 - Medição Semi-Automática': 'EXTRA 400 - Máquina Semi-Automática',
            'EXTRA 500 - Medição Semi-Automática': 'EXTRA 500 - Máquina Semi-Automática',
            
            # Série PEAK
            'PEAK 300 - Máquina CNC Automática': 'PEAK 300 - Máquina CNC Compacta',
            'PEAK 400 - Máquina CNC Automática': 'PEAK 400 - Máquina CNC Compacta',
            
            # Série ULTRA
            'ULTRA 200 - Máquina CNC Óptica': 'ULTRA 200 - Máquina de Medição Avançada',
            'ULTRA 300 - Máquina CNC Óptica': 'ULTRA 300 - Máquina de Medição Avançada',
            'ULTRA 400 - Máquina CNC Óptica': 'ULTRA 400 - Máquina de Medição Avançada',
            'ULTRA 500 - Máquina CNC Óptica': 'ULTRA 500 - Máquina de Medição Avançada',
            'ULTRA 600 - Máquina CNC Óptica': 'ULTRA 600 - Máquina de Medição Avançada',
        }
        
        mudancas = 0
        for antigo, novo in substituicoes.items():
            if antigo in conteudo:
                conteudo = conteudo.replace(antigo, novo)
                mudancas += 1
                print(f"✅ Substituído: {antigo} → {novo}")
        
        # Salvar se houve mudanças
        if mudancas > 0:
            with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as f:
                f.write(conteudo)
            print(f"\nCSV atualizado com {mudancas} substituições!")
        else:
            print("Nenhuma substituição necessária no CSV.")
            
    except Exception as e:
        print(f"Erro ao atualizar CSV: {e}")

if __name__ == "__main__":
    print("=== PADRONIZAÇÃO DOS NOMES DOS PRODUTOS ===")
    print("\nAtualizando arquivos WPBakery...")
    atualizar_nomes_produtos()
    
    print("\nAtualizando CSV...")
    atualizar_csv_com_nomes_padronizados()
    
    print("\n✅ Padronização concluída!")