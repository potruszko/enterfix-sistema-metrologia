import os
import re
import glob

def atualizar_tabelas_css():
    """Atualiza todas as tabelas nos arquivos WPBakery para usar class='table-enterfix'"""
    
    # Buscar todos os arquivos WPBakery
    arquivos_wpbakery = []
    
    # Padrões de busca para diferentes diretórios
    padroes = [
        "serie_*/*wpbakery_description.txt",
        "sistemas_fixacao/*wpbakery_description.txt"
    ]
    
    for padrao in padroes:
        arquivos_wpbakery.extend(glob.glob(padrao))
    
    print(f"Encontrados {len(arquivos_wpbakery)} arquivos WPBakery para atualizar")
    
    atualizacoes = 0
    
    for arquivo in arquivos_wpbakery:
        print(f"\nProcessando: {arquivo}")
        
        try:
            # Ler arquivo
            with open(arquivo, 'r', encoding='utf-8') as f:
                conteudo = f.read()
            
            # Padrão regex para encontrar e substituir tabelas
            # Procura por <table style="..." ...> até </table>
            padrao_tabela = r'<table[^>]*style="[^"]*"[^>]*cellspacing="[^"]*"[^>]*cellpadding="[^"]*"[^>]*>(.*?)</table>'
            
            def substituir_tabela(match):
                conteudo_tabela = match.group(1)
                
                # Remover todos os atributos style das tags internas
                # Substituir th e td com style
                conteudo_limpo = re.sub(r'<(th|td)\s+style="[^"]*"([^>]*)>', r'<\1\2>', conteudo_tabela)
                conteudo_limpo = re.sub(r'<tr\s+style="[^"]*"([^>]*)>', r'<tr\1>', conteudo_limpo)
                
                # Ajustar símbolos × e espaçamentos
                conteudo_limpo = re.sub(r'(\d+)\s*x\s*(\d+)\s*x\s*(\d+)', r'\1 × \2 × \3', conteudo_limpo)
                conteudo_limpo = re.sub(r'(\d+)\s*x\s*(\d+)', r'\1 × \2', conteudo_limpo)
                conteudo_limpo = re.sub(r'(L\*W\*H)', 'L × W × H', conteudo_limpo)
                conteudo_limpo = re.sub(r'(X\*Y\*Z)', 'X × Y × Z', conteudo_limpo)
                conteudo_limpo = re.sub(r'Items', 'Itens', conteudo_limpo)
                conteudo_limpo = re.sub(r'Campo de Visão', 'FOV', conteudo_limpo)
                conteudo_limpo = re.sub(r'1,3M pixels', '1,3 M pixels', conteudo_limpo)
                conteudo_limpo = re.sub(r'(\d+)–(\d+)X', r'\\1–\\2 X', conteudo_limpo)
                conteudo_limpo = re.sub(r'câmera\+lente', 'câmera + lente', conteudo_limpo)
                
                return f'<table class="table-enterfix">{conteudo_limpo}</table>'
            
            # Aplicar substituição
            conteudo_novo = re.sub(padrao_tabela, substituir_tabela, conteudo, flags=re.DOTALL)
            
            # Verificar se houve mudanças
            if conteudo_novo != conteudo:
                # Salvar arquivo atualizado
                with open(arquivo, 'w', encoding='utf-8') as f:
                    f.write(conteudo_novo)
                
                atualizacoes += 1
                print(f"✅ Tabela atualizada em {arquivo}")
            else:
                print(f"ℹ️  Nenhuma tabela encontrada em {arquivo}")
                
        except Exception as e:
            print(f"❌ Erro ao processar {arquivo}: {e}")
    
    print(f"\n🎉 Processo concluído!")
    print(f"📊 {atualizacoes} arquivos atualizados com nova estrutura CSS")
    print(f"🎯 Todas as tabelas agora usam class='table-enterfix'")

if __name__ == "__main__":
    # Mudar para o diretório pai para acessar as pastas das séries
    os.chdir('..')
    atualizar_tabelas_css()