#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script para aplicar layout padrão WPBakery aos produtos Scanology
Aplica o layout completo seguindo o padrão definido
"""

import os
import re
from pathlib import Path

# Produtos que já foram atualizados com layout completo
PRODUTOS_ATUALIZADOS = {
    "SIMSCAN-E_scanology.txt",
    "KSCAN-Magic_scanology.txt"
}

# Template do cabeçalho de vídeo
VIDEO_HEADER_TEMPLATE = '''<!-- Video Header Section -->
[vc_row full_width="stretch_row" css=".vc_custom_1508859733758{background-image: url([ID_VIDEO_BACKGROUND]) !important;background-position: center !important;background-repeat: no-repeat !important;background-size: cover !important;}" el_class="video-header-scanology"][vc_column][vc_video link="[URL_VIDEO_DEMONSTRACAO]" align="center"][/vc_column][/vc_row]

<!-- Main Product Section -->'''

# Template da seção de descrição com gradiente
def criar_secao_gradiente(nome_produto, descricao_breve, descricao_completa, stats):
    return f'''<!-- Description Section with Gradient Background -->
[vc_row full_width="stretch_row" css=".vc_custom_1508859733758{{background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;padding-top: 60px !important;padding-bottom: 60px !important;}}" el_class="gradient-description-section"][vc_column][vc_column_text css=".vc_custom_1508859733758{{color: #ffffff !important;}}"]
<div style="text-align: center; color: white;">
<h2 style="color: white; margin-bottom: 30px;">{nome_produto} - Tecnologia Avançada de Digitalização 3D</h2>
<p style="font-size: 18px; line-height: 1.6; margin-bottom: 25px;">{descricao_completa}</p>

<div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 40px;">
{stats}
</div>
</div>
[/vc_column_text][/vc_column][/vc_row]

<!-- Image Carousel Section -->
[vc_row][vc_column][vc_images_carousel images="[ID_CAROUSEL_IMAGES]" img_size="full" speed="3000" autoplay="yes" wrap="yes"][/vc_column][/vc_row]

<!-- Video Demonstration Section -->
[vc_row css=".vc_custom_1508859733758{{background-color: #f8f9fa !important;padding-top: 50px !important;padding-bottom: 50px !important;}}"][vc_column width="1/3"][vc_column_text]
<h3>Demonstração Técnica</h3>
<p>Veja o {nome_produto.split(' - ')[0]} em ação demonstrando suas capacidades avançadas de digitalização 3D.</p>

<ul style="list-style-type: disc; margin-left: 20px;">
<li>Tecnologia de digitalização avançada</li>
<li>Captura de alta precisão</li>
<li>Processamento otimizado</li>
<li>Interface intuitiva</li>
</ul>
[/vc_column_text][/vc_column][vc_column width="2/3"][vc_video link="[URL_VIDEO_TECNICO]" align="center"][/vc_column][/vc_row]

<!-- Technical Specifications Table -->
[vc_row][vc_column][vc_column_text]
<h3 style="text-align: center; margin-bottom: 30px;">Especificações Técnicas</h3>'''

# Template dos cards de recursos
FEATURES_CARDS_TEMPLATE = '''<!-- Features Cards Section -->
[vc_row css=".vc_custom_1508859733758{background-color: #ffffff !important;padding-top: 60px !important;padding-bottom: 60px !important;}"][vc_column][vc_column_text]
<h3 style="text-align: center; margin-bottom: 40px;">Recursos e Benefícios Principais</h3>
[/vc_column_text][/vc_column][/vc_row]

[vc_row][vc_column width="1/4"][vc_column_text css=".vc_custom_1508859733758{text-align: center !important;padding: 30px !important;border: 1px solid #e0e0e0 !important;border-radius: 10px !important;background-color: #f8f9fa !important;}"]
<div style="text-align: center;">
<img src="[ICON_PRECISION]" alt="Precisão" style="width: 64px; height: 64px; margin-bottom: 20px;">
<h4 style="color: #2c3e50; margin-bottom: 15px;">Alta Precisão</h4>
<p style="font-size: 14px; line-height: 1.5;">Precisão excepcional para aplicações industriais críticas de controle de qualidade.</p>
</div>
[/vc_column_text][/vc_column][vc_column width="1/4"][vc_column_text css=".vc_custom_1508859733758{text-align: center !important;padding: 30px !important;border: 1px solid #e0e0e0 !important;border-radius: 10px !important;background-color: #f8f9fa !important;}"]
<div style="text-align: center;">
<img src="[ICON_SPEED]" alt="Velocidade" style="width: 64px; height: 64px; margin-bottom: 20px;">
<h4 style="color: #2c3e50; margin-bottom: 15px;">Alta Velocidade</h4>
<p style="font-size: 14px; line-height: 1.5;">Taxa de medição otimizada para máxima produtividade operacional.</p>
</div>
[/vc_column_text][/vc_column][vc_column width="1/4"][vc_column_text css=".vc_custom_1508859733758{text-align: center !important;padding: 30px !important;border: 1px solid #e0e0e0 !important;border-radius: 10px !important;background-color: #f8f9fa !important;}"]
<div style="text-align: center;">
<img src="[ICON_VERSATILITY]" alt="Versatilidade" style="width: 64px; height: 64px; margin-bottom: 20px;">
<h4 style="color: #2c3e50; margin-bottom: 15px;">Versatilidade</h4>
<p style="font-size: 14px; line-height: 1.5;">Adaptação inteligente para diferentes tipos de superfícies e aplicações.</p>
</div>
[/vc_column_text][/vc_column][vc_column width="1/4"][vc_column_text css=".vc_custom_1508859733758{text-align: center !important;padding: 30px !important;border: 1px solid #e0e0e0 !important;border-radius: 10px !important;background-color: #f8f9fa !important;}"]
<div style="text-align: center;">
<img src="[ICON_PORTABILITY]" alt="Portabilidade" style="width: 64px; height: 64px; margin-bottom: 20px;">
<h4 style="color: #2c3e50; margin-bottom: 15px;">Facilidade de Uso</h4>
<p style="font-size: 14px; line-height: 1.5;">Interface intuitiva e operação simplificada para máxima eficiência.</p>
</div>
[/vc_column_text][/vc_column][/vc_row]'''

# Template da seção de compatibilidade de software
SOFTWARE_COMPATIBILITY_TEMPLATE = '''<!-- Software Compatibility Section -->
[vc_row css=".vc_custom_1508859733758{background-color: #2c3e50 !important;padding-top: 60px !important;padding-bottom: 60px !important;}"][vc_column][vc_column_text css=".vc_custom_1508859733758{color: #ffffff !important;}"]
<div style="text-align: center; color: white;">
<h3 style="color: white; margin-bottom: 30px;">Software de Digitalização Profissional</h3>
<p style="font-size: 18px; line-height: 1.6; margin-bottom: 40px;">Soluções de software abrangentes para processamento avançado de dados 3D</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-bottom: 40px;">
    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px;">
        <h4 style="color: #ffd700; margin-bottom: 15px;">🔧 Recursos Profissionais</h4>
        <ul style="text-align: left; line-height: 1.6;">
            <li>Interface otimizada para fluxo industrial</li>
            <li>Processamento automático de dados</li>
            <li>Ferramentas de análise avançada</li>
            <li>Exportação CAD/CAM integrada</li>
        </ul>
    </div>
    <div style="background: rgba(255,255,255,0.1); padding: 25px; border-radius: 10px;">
        <h4 style="color: #ffd700; margin-bottom: 15px;">📊 Compatibilidade Ampla</h4>
        <ul style="text-align: left; line-height: 1.6;">
            <li>Softwares de metrologia</li>
            <li>Sistemas CAD/CAM</li>
            <li>Formatos industriais padrão</li>
            <li>Relatórios automáticos</li>
        </ul>
    </div>
</div>
</div>
[/vc_column_text][/vc_column][/vc_row]'''

# Template da seção CTA de download
DOWNLOAD_CTA_TEMPLATE = '''<!-- Download CTA Section -->
[vc_row full_width="stretch_row" css=".vc_custom_1508859733758{background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;padding-top: 80px !important;padding-bottom: 80px !important;}" el_class="cta-download-section"][vc_column][vc_column_text css=".vc_custom_1508859733758{text-align: center !important;color: #ffffff !important;}"]
<div style="text-align: center; color: white;">
<h3 style="color: white; font-size: 2.2em; margin-bottom: 20px;">Transforme seus Processos de Digitalização 3D</h3>
<p style="font-size: 1.3em; line-height: 1.6; margin-bottom: 40px; max-width: 800px; margin-left: auto; margin-right: auto;">Descubra como nossa tecnologia avançada pode revolucionar seus processos de digitalização com precisão e eficiência incomparáveis.</p>

<div style="margin-bottom: 40px;">
<a href="[LINK_ORCAMENTO]" style="display: inline-block; background-color: #ffd700; color: #2c3e50; padding: 18px 40px; font-size: 1.2em; font-weight: bold; text-decoration: none; border-radius: 50px; margin: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;">
📞 SOLICITAR ORÇAMENTO
</a>
<a href="[LINK_DEMONSTRACAO]" style="display: inline-block; background-color: transparent; color: white; padding: 18px 40px; font-size: 1.2em; font-weight: bold; text-decoration: none; border-radius: 50px; margin: 10px; border: 2px solid white; transition: all 0.3s ease;">
🎯 AGENDAR DEMONSTRAÇÃO
</a>
</div>

<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; gap: 40px; margin-top: 40px;">
<div style="text-align: center;">
    <div style="font-size: 2.5em; margin-bottom: 10px;">📧</div>
    <div style="font-size: 1.1em;">contato@enterfix.com.br</div>
</div>
<div style="text-align: center;">
    <div style="font-size: 2.5em; margin-bottom: 10px;">📱</div>
    <div style="font-size: 1.1em;">+55 11 5555-5555</div>
</div>
<div style="text-align: center;">
    <div style="font-size: 2.5em; margin-bottom: 10px;">⚡</div>
    <div style="font-size: 1.1em;">Atendimento Especializado</div>
</div>
</div>
</div>
[/vc_column_text][/vc_column][/vc_row]'''

def extrair_nome_produto(conteudo):
    """Extrai o nome do produto do título H1/H2"""
    match = re.search(r'<h[12]>(.*?)</h[12]>', conteudo)
    if match:
        return match.group(1).strip()
    return "Produto"

def criar_stats_personalizados(nome_arquivo):
    """Cria estatísticas personalizadas baseadas no produto"""
    stats_mapping = {
        'KSCAN-X': '''    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">0,015mm</h3>
        <p style="font-size: 16px;">Precisão Premium</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">3,2M</h3>
        <p style="font-size: 16px;">Pontos/Segundo</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">400mm</h3>
        <p style="font-size: 16px;">Área Máxima</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Premium</h3>
        <p style="font-size: 16px;">Categoria</p>
    </div>''',
        'SIMSCAN': '''    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">0,02mm</h3>
        <p style="font-size: 16px;">Precisão Industrial</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">2,0M</h3>
        <p style="font-size: 16px;">Pontos/Segundo</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Flexível</h3>
        <p style="font-size: 16px;">Área de Trabalho</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Série</h3>
        <p style="font-size: 16px;">Modelos Múltiplos</p>
    </div>'''
    }
    
    for key, stats in stats_mapping.items():
        if key in nome_arquivo.upper():
            return stats
    
    # Stats padrão
    return '''    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Alta</h3>
        <p style="font-size: 16px;">Precisão</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Rápido</h3>
        <p style="font-size: 16px;">Processamento</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Portátil</h3>
        <p style="font-size: 16px;">Design</p>
    </div>
    <div style="text-align: center; margin: 15px;">
        <h3 style="color: #ffd700; font-size: 24px; margin-bottom: 10px;">Pro</h3>
        <p style="font-size: 16px;">Categoria</p>
    </div>'''

def criar_tags_seo(nome_arquivo):
    """Cria tags SEO específicas do produto"""
    produto_base = nome_arquivo.replace('_scanology.txt', '').lower()
    
    tags_base = ["scanner 3d", "digitalização 3d", "metrologia 3d", "controle qualidade", 
                 "engenharia reversa", "scanology", "enterfix", "precisão industrial"]
    
    # Adiciona tags específicas baseadas no nome do produto
    if 'kscan' in produto_base:
        tags_base.extend(["kscan", "scanner composto", "híbrido"])
    if 'simscan' in produto_base:
        tags_base.extend(["simscan", "scanner industrial", "portátil"])
    if 'autoscan' in produto_base:
        tags_base.extend(["autoscan", "automatizado", "inspeção automática"])
    if 'track' in produto_base:
        tags_base.extend(["rastreamento", "tracking 3d", "posicionamento"])
    
    return f"<!-- Tags: {', '.join(tags_base)}, {produto_base} -->"

def aplicar_layout_padrao(arquivo_path):
    """Aplica o layout padrão completo ao arquivo"""
    try:
        with open(arquivo_path, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        
        nome_arquivo = os.path.basename(arquivo_path)
        
        # Se já foi atualizado, pular
        if nome_arquivo in PRODUTOS_ATUALIZADOS:
            return f"✅ {nome_arquivo} - Já atualizado"
        
        # Extrair informações do produto
        nome_produto = extrair_nome_produto(conteudo)
        
        # Identificar início do conteúdo atual (após primeira linha [vc_row])
        primeiro_vc_row = conteudo.find('[vc_row]')
        if primeiro_vc_row == -1:
            return f"❌ {nome_arquivo} - Formato inválido"
        
        # Adicionar cabeçalho de vídeo
        novo_conteudo = VIDEO_HEADER_TEMPLATE + '\n' + conteudo[primeiro_vc_row:]
        
        # Atualizar título para H1 e adicionar descrição breve
        novo_conteudo = re.sub(
            r'<h2>(.*?)</h2>',
            lambda m: f'<h1>{m.group(1)}</h1>\n\n<p class="produto-breve-descricao">Sistema avançado de digitalização 3D com tecnologia de ponta para aplicações industriais profissionais.</p>',
            novo_conteudo,
            count=1
        )
        
        # Encontrar onde inserir seção gradiente
        match_segunda_row = re.search(r'\[/vc_column\]\[/vc_row\]\s*\n\s*\[vc_row\]', novo_conteudo)
        if match_segunda_row:
            # Criar stats personalizados
            stats = criar_stats_personalizados(nome_arquivo)
            
            # Criar descrição personalizada
            descricao_completa = f"Sistema avançado de digitalização 3D projetado para aplicações industriais que exigem máxima precisão e eficiência operacional."
            
            # Inserir seção gradiente
            secao_gradiente = criar_secao_gradiente(nome_produto, "", descricao_completa, stats)
            
            novo_conteudo = (novo_conteudo[:match_segunda_row.start()] + 
                           '[/vc_column][/vc_row]\n\n' + 
                           secao_gradiente + '\n\n[vc_row]' + 
                           novo_conteudo[match_segunda_row.end()-8:])
        
        # Garantir que tabelas usem table-enterfix
        novo_conteudo = re.sub(r'class="table-scanology"', 'class="table-enterfix"', novo_conteudo)
        
        # Adicionar seção de features cards antes da seção de aplicações
        if 'Aplicações' in novo_conteudo or 'aplicações' in novo_conteudo:
            novo_conteudo = re.sub(
                r'(\[vc_row\]\[vc_column.*?\[vc_column_text\]\s*<h3>.*?Aplicações.*?</h3>)',
                FEATURES_CARDS_TEMPLATE + '\n\n<!-- Applications Section -->\n\\1',
                novo_conteudo,
                flags=re.IGNORECASE | re.DOTALL
            )
        
        # Adicionar seção de compatibilidade de software antes da última seção
        if '[vc_row][vc_column][vc_column_text]' in novo_conteudo and 'Suporte' in novo_conteudo:
            # Inserir antes da seção de suporte
            novo_conteudo = re.sub(
                r'(\[vc_row\]\[vc_column\]\[vc_column_text\]\s*<h3>.*?Suporte.*?)',
                SOFTWARE_COMPATIBILITY_TEMPLATE + '\n\n\\1',
                novo_conteudo,
                flags=re.IGNORECASE | re.DOTALL
            )
        
        # Adicionar seção CTA e tags SEO no final
        tags_seo = criar_tags_seo(nome_arquivo)
        
        if novo_conteudo.endswith('[/vc_row]'):
            novo_conteudo += '\n\n' + DOWNLOAD_CTA_TEMPLATE + '\n\n' + tags_seo
        else:
            # Inserir antes do último [/vc_row]
            ultimo_vc_row = novo_conteudo.rfind('[/vc_row]')
            if ultimo_vc_row != -1:
                novo_conteudo = (novo_conteudo[:ultimo_vc_row] + 
                               DOWNLOAD_CTA_TEMPLATE + '\n\n' + tags_seo + '\n\n' + 
                               novo_conteudo[ultimo_vc_row:])
        
        # Salvar arquivo atualizado
        with open(arquivo_path, 'w', encoding='utf-8') as f:
            f.write(novo_conteudo)
        
        return f"✅ {nome_arquivo} - Layout aplicado com sucesso"
        
    except Exception as e:
        return f"❌ {nome_arquivo} - Erro: {str(e)}"

def main():
    """Função principal para aplicar layout a todos os produtos"""
    base_dir = Path("c:/Users/paulo/OneDrive/Documentos/CODIGUINHO/PRODUTOS/scanology")
    
    # Encontrar todos os arquivos de produtos
    arquivos_produto = []
    for pasta in ["scanners_industriais", "sistemas_rastreamento", "sistemas_automatizados", "fotogrametria_softwares"]:
        pasta_path = base_dir / pasta
        if pasta_path.exists():
            arquivos_produto.extend(pasta_path.glob("*_scanology.txt"))
    
    print(f"Encontrados {len(arquivos_produto)} produtos para atualizar")
    print("=" * 60)
    
    resultados = []
    for arquivo in arquivos_produto:
        resultado = aplicar_layout_padrao(arquivo)
        resultados.append(resultado)
        print(resultado)
    
    print("=" * 60)
    print(f"Processamento concluído: {len(resultados)} produtos")
    
    # Resumo dos resultados
    sucesso = len([r for r in resultados if "✅" in r])
    erro = len([r for r in resultados if "❌" in r])
    
    print(f"✅ Sucessos: {sucesso}")
    print(f"❌ Erros: {erro}")

if __name__ == "__main__":
    main()