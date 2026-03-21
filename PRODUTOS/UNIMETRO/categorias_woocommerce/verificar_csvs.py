import os

def verificar_arquivo_csv(nome_arquivo):
    """Verifica quantos produtos tem um arquivo CSV"""
    try:
        with open(nome_arquivo, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Contar produtos (linhas com ,simple,)
        produtos = content.count(',simple,')
        print(f"{nome_arquivo}: {produtos} produtos")
        
        # Verificar se tem WPBakery
        wpbakery = content.count('[vc_row')
        print(f"  - Código WPBakery: {wpbakery > 0}")
        
        # Verificar se tem placeholders
        placeholders = content.count('[Inserir descrição WPBakery completa aqui]')
        print(f"  - Placeholders: {placeholders}")
        
        return produtos, wpbakery, placeholders
        
    except Exception as e:
        print(f"Erro ao ler {nome_arquivo}: {e}")
        return 0, 0, 0

print("Verificando arquivos CSV disponíveis:")
print("-" * 50)

verificar_arquivo_csv('woocommerce_import_completo.csv')
verificar_arquivo_csv('woocommerce_import_backup.csv') 
verificar_arquivo_csv('woocommerce_import_detalhado.csv')

# Procurar outros arquivos CSV no diretório pai
pasta_pai = '../'
arquivos_csv = []
for arquivo in os.listdir(pasta_pai):
    if arquivo.endswith('.csv'):
        arquivos_csv.append(arquivo)

if arquivos_csv:
    print(f"\nOutros CSVs encontrados no diretório pai:")
    for arquivo in arquivos_csv:
        verificar_arquivo_csv(f'../{arquivo}')