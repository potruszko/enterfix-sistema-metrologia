#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from pathlib import Path

def criar_layout_padrao_scanology():
    """Cria script para atualizar todos os produtos Scanology com o layout padrão"""
    
    # Template base para produtos Scanology
    template_base = '''[vc_row full_width="stretch_row" bg_type="video" video_url="https://enterfix.com.br/wp-content/uploads/2025/04/f34ca26801b756a7b4c31606f94d1549.mp4" video_opts="muted" bg_override="browser_size"][vc_column][vc_empty_space][/vc_column][/vc_row][vc_row bg_type="grad" bg_override="full" css=".vc_custom_1748609639608{padding-top: 80px !important;padding-bottom: 100px !important;background-position: center !important;background-repeat: no-repeat !important;background-size: contain !important;}" bg_grad="background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #E3E3E3));background: -moz-linear-gradient(top,#E3E3E3 0%);background: -webkit-linear-gradient(top,#E3E3E3 0%);background: -o-linear-gradient(top,#E3E3E3 0%);background: -ms-linear-gradient(top,#E3E3E3 0%);background: linear-gradient(top,#E3E3E3 0%);"][vc_column][ind_custom_heading heading="{TITULO_DESTAQUE}" position="center"][vc_column_text css_animation="none" css=".vc_custom_1748607762970{margin-top: 60px !important;margin-bottom: 60px !important;margin-left: 0px !important;padding-top: 32px !important;padding-right: 32px !important;padding-bottom: 32px !important;padding-left: 32px !important;}"]
<p class="" data-start="84" data-end="418">{DESCRICAO_PRINCIPAL}</p>
<p class="" data-start="420" data-end="827">{DESCRICAO_SECUNDARIA}</p>
[/vc_column_text][/vc_column][/vc_row][vc_row full_width="stretch_row" css=".vc_custom_1742770225154{background-image: url(https://enterfix.com.br/wp-content/uploads/2024/08/bg_031.jpg?id=4728) !important;}"][vc_column][vc_single_image image="5437" img_size="full" alignment="center" style="vc_box_rounded" css_animation="none" css=".vc_custom_1748607776571{padding-top: 32px !important;padding-bottom: 32px !important;border-radius: 20px !important;}"][ultimate_carousel][vc_single_image image="5580" css=""][/ultimate_carousel][/vc_column][/vc_row][vc_row full_width="stretch_row" bg_type="image" css=".vc_custom_1742774265064{padding-top: 32px !important;background-image: url(https://enterfix.com.br/wp-content/uploads/2024/08/bg_041.jpg?id=4732) !important;}"][vc_column][ind_custom_heading heading="VÍDEO {PRODUTO_NOME}" heading_color="#FFFFFF" position="center"][vc_column_text css=""]
<p style="text-align: center;"><span style="color: #ffffff;">{DESCRICAO_VIDEO}</span></p>
[/vc_column_text][ultimate_video u_video_url="https://www.youtube.com/watch?v=6X6wg9Kkjw0&amp;t=97s" yt_autoplay="" yt_sugg_video="" yt_play_control="" yt_mute_control="" yt_modest_branding="" yt_privacy_mode="" thumbnail="custom" custom_thumb="id^5435|url^https://enterfix.com.br/wp-content/uploads/2025/03/SIMSCAN-E.png|caption^null|alt^null|title^SIMSCAN-E|description^null" play_source="image" play_image="id^5159|url^https://enterfix.com.br/wp-content/uploads/2025/03/Enterfix-Symbol.png|caption^null|alt^null|title^Enterfix-Symbol|description^null" play_size="75" enable_sub_bar="" overlay_color="#1E73BE33"][/vc_column][/vc_row][vc_row full_width="stretch_row" bg_type="image" bg_override="full" css=".vc_custom_1742774273231{padding-top: 32px !important;background-image: url(https://enterfix.com.br/wp-content/uploads/2024/08/bg_051.jpg?id=4759) !important;}"][vc_column][ind_custom_heading heading="Informação Técnica" position="center"][vc_column_text css=""]
<div class="table-enterfix-wrapper">
{TABELA_TECNICA}
<p style="margin-top: 12px; font-size: 14px; color: #444; text-align: center;"><sup>(1)</sup> Certificado ISO 17025: baseado na norma VDI/VDE 2634 Parte 3 — erro de apalpamento (PS).
<sup>(2)</sup> Certificado ISO 17025: baseado na norma VDI/VDE 2634 Parte 3 — erro de espaçamento de esferas (SD).
<em>*A Enterfix reserva-se o direito de alterar os parâmetros e imagens conforme a legislação vigente.</em></p>

</div>
[/vc_column_text][vc_empty_space][/vc_column][/vc_row][vc_row full_width="stretch_row" bg_type="image" parallax_style="vcpb-default" css=".vc_custom_1744324989368{padding-top: 40px !important;background-image: url(https://enterfix.com.br/wp-content/uploads/2025/03/sinscan-e2.webp?id=5438) !important;}"][vc_column][vc_row_inner css=".vc_custom_1743284203558{padding-top: 64px !important;padding-bottom: 64px !important;}"][vc_column_inner width="1/4" css=".vc_custom_1744324572317{padding-top: 0px !important;padding-right: 12px !important;padding-bottom: 0px !important;padding-left: 12px !important;background-color: #17191B !important;border-radius: 10px !important;}"][vc_single_image image="5445" img_size="120x120" add_caption="yes" alignment="center" style="vc_box_rounded" css_animation="none" css=".vc_custom_1745108759443{padding-top: 32px !important;padding-right: 32px !important;padding-left: 32px !important;border-radius: 20px !important;border-color: #FFFFFF !important;}"][vc_column_text css=".vc_custom_1744324921787{padding-bottom: 32px !important;}"]
<p style="text-align: center;"><span style="color: #ffffff;">{CARACTERISTICA_1}</span></p>
[/vc_column_text][/vc_column_inner][vc_column_inner width="1/4" css=".vc_custom_1744324586732{padding-right: 12px !important;padding-left: 12px !important;background-color: #17191B !important;border-radius: 10px !important;}"][vc_single_image image="5446" img_size="120x120" alignment="center" style="vc_box_rounded" css_animation="none" css=".vc_custom_1745108769730{padding-top: 32px !important;padding-right: 32px !important;padding-left: 32px !important;}"][vc_column_text css=".vc_custom_1744324930955{padding-bottom: 32px !important;}"]
<p style="text-align: center;"><span style="color: #ffffff;">{CARACTERISTICA_2}</span></p>
[/vc_column_text][/vc_column_inner][vc_column_inner width="1/4" css=".vc_custom_1744324597584{padding-right: 12px !important;padding-left: 12px !important;background-color: #17191B !important;border-radius: 20px !important;}"][vc_single_image image="5447" img_size="120x120" alignment="center" style="vc_box_rounded" css_animation="none" css=".vc_custom_1745108778283{padding-top: 32px !important;}"][vc_column_text css=".vc_custom_1744324937600{padding-bottom: 32px !important;}"]
<p style="text-align: center;"><span style="color: #ffffff;">{CARACTERISTICA_3}</span></p>
[/vc_column_text][/vc_column_inner][vc_column_inner width="1/4" css=".vc_custom_1744324606507{padding-right: 12px !important;padding-left: 12px !important;background-color: #17191B !important;border-radius: 20px !important;}"][vc_single_image image="5444" img_size="120x120" alignment="center" style="vc_box_rounded" css_animation="none" css=".vc_custom_1745108785322{padding-top: 32px !important;}"][vc_column_text css=".vc_custom_1744324944534{padding-bottom: 32px !important;}"]
<p style="text-align: center;"><span style="color: #ffffff;">{CARACTERISTICA_4}</span></p>
[/vc_column_text][/vc_column_inner][/vc_row_inner][vc_empty_space][/vc_column][/vc_row][vc_row full_width="stretch_row" bg_type="bg_color" css=".vc_custom_1743286431423{padding-top: 40px !important;}" bg_color_value="#FFFFFF"][vc_column][ind_custom_heading heading="Softwares Compatíveis" position="center"][/vc_column][/vc_row][vc_row full_width="stretch_row" bg_type="bg_color" css=".vc_custom_1743286423643{padding-top: 40px !important;}" bg_color_value="#FFFFFF"][vc_column width="1/4"][vc_single_image image="5448" img_size="full" css=""][/vc_column][vc_column width="1/4"][vc_single_image image="5449" img_size="full" css=""][/vc_column][vc_column width="1/4"][vc_single_image image="5450" img_size="full" css=""][/vc_column][vc_column width="1/4"][vc_single_image image="5451" img_size="full" css=""][/vc_column][/vc_row][vc_row bg_type="image" bg_override="full" css=".vc_custom_1742774292621{padding-top: 32px !important;background-image: url(https://enterfix.com.br/wp-content/uploads/2024/08/bg_031.jpg?id=4728) !important;}"][vc_column][ind_custom_heading heading="Download do Catálogo" position="center"][vc_column_text css=".vc_custom_1743285288736{padding-top: 16px !important;padding-bottom: 16px !important;}"]
<p style="text-align: center;">Faça o download do catálogo completo do <strong>{PRODUTO_NOME}</strong> e descubra todos os recursos, especificações e diferenciais desta solução de digitalização 3D.</p>
[/vc_column_text][ult_buttons btn_title="DOWNLOAD" btn_link="url:https%3A%2F%2Flp.enterfix.com.br%2Fcatalogo-{PRODUTO_SLUG}|title:Contato" btn_align="ubtn-center" btn_size="ubtn-large" btn_title_color="#FFFFFF" btn_bg_color="#A0BF30" btn_bg_color_hover="#1E73BE" btn_title_color_hover="#FFFFFF" icon="none" icon_size="24" icon_color="#FFFFFF" btn_icon_pos="ubtn-sep-icon-at-left" btn_border_style="solid" btn_border_size="1" btn_radius="10" btn_font_family="font_family:Poppins|font_call:Poppins|variant:700" btn_font_style="font-weight:700;" btn_font_size="desktop:16px;"][/vc_column][/vc_row]

<!-- Tags do Produto -->
{TAGS_PRODUTO}'''
    
    # Tags padrão para diferentes categorias
    tags_por_categoria = {
        'scanners_industriais': [
            'scanner-3d-portatil', 'digitalizacao-3d', 'metrologia-optica', 'controle-qualidade',
            'engenharia-reversa', 'alta-precisao', 'scanner-profissional', 'tecnologia-azul',
            'medicao-3d', 'inspecao-dimensional'
        ],
        'metrologias_3d': [
            'rastreamento-3d', 'sistema-tracking', 'monitoramento-tempo-real', 'precisao-submetrica',
            'metrologia-avancada', 'sistema-6dof', 'medicao-dinamica', 'controle-movimento',
            'calibracao-automatica', 'tracking-profissional'
        ],
        'scanners_fotogrametria': [
            'fotogrametria-3d', 'sistema-multicamera', 'captura-instantanea', 'objetos-grandes',
            'alta-resolucao', 'medicao-rapida', 'sistema-fixo', 'producao-em-massa',
            'automatizado', 'controle-estatistico'
        ],
        'seo_files': [
            'software-3d', 'processamento-nuvem-pontos', 'analise-dimensional', 'relatorios-inspecao',
            'workflow-completo', 'interface-intuitiva', 'exportacao-cad', 'metrologia-software',
            'visualizacao-3d', 'automacao-medicao'
        ]
    }
    
    print("📋 Aguardando aplicação manual do template...")
    print("💡 Use este template para atualizar os produtos:")
    print("=" * 80)
    print(template_base)
    print("=" * 80)
    print("\n🏷️  Tags por categoria:")
    for categoria, tags in tags_por_categoria.items():
        print(f"\n{categoria.upper()}:")
        print(", ".join(tags))

if __name__ == "__main__":
    criar_layout_padrao_scanology()