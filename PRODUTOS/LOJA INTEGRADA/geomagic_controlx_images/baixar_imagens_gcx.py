#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para download das imagens do Geomagic Control X
Salva na pasta geomagic_controlx_images/ para posterior upload ao Enterfix
Prefixo das imagens no enterfix: gcx_
"""

import os
import urllib.request
import ssl
import time

# ─── configurações ───────────────────────────────────────────────────────────
PASTA_SAIDA = os.path.dirname(os.path.abspath(__file__))
TIMEOUT     = 30
DELAY       = 1.0  # segundos entre downloads (seja gentil com os servidores)

# Cabeçalho de navegador para evitar bloqueios
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
    "Referer": "https://hexagon.com/",
}

# ─── mapas de download ────────────────────────────────────────────────────────
# Formato: (nome_local, url_origem)
IMAGENS = [
    # ── Hero / banner principal ───────────────────────────────────────────────
    ("gcx_hero_bg.jpg",
     "https://hexagon.com/-/media/project/one-web/master-site/mi/"
     "measurement-and-inspection-software/1geomagic/product-pages/"
     "controlx/controlx-banner.jpg"),

    # ── Produto (caixa de software) ───────────────────────────────────────────
    ("gcx_produto.png",
     "https://rescanm.com.br/wp-content/uploads/2020/03/"
     "geomagic-control-x_new-box.png"),

    # ── Screenshots de interface (Shining3D) ──────────────────────────────────
    ("gcx_interface_quality.png",
     "https://www.shining3d.com/hs-fs/hubfs/"
     "%E6%96%B0%E7%BD%91%E9%A1%B5%E9%85%8D%E5%9B%BE-56.png"
     "?width=1209&height=867"),

    ("gcx_interface_insights.png",
     "https://www.shining3d.com/hs-fs/hubfs/"
     "%E6%96%B0%E7%BD%91%E9%A1%B5%E9%85%8D%E5%9B%BE-58.png"
     "?width=1209&height=867"),

    ("gcx_interface_manufacturing.png",
     "https://www.shining3d.com/hs-fs/hubfs/Website-2024/images/"
     "Software%20Page/Control%20X-Optimize%20Manufacturing%20Processes.png"
     "?width=1209&height=867"),

    # ── Automação (Hexagon) ───────────────────────────────────────────────────
    ("gcx_automation.png",
     "https://hexagon.com/-/media/project/one-web/master-site/mi/"
     "geomagic/proces-scan-data-quickly.png"
     "?h=547&iar=0&w=577"),

    # ── Features / screenshots do produto (magistecnologia.com.br) ───────────
    ("gcx_feat_software_01.png",
     "https://yata-apix-2266b462-917c-4207-b682-e42013fbfa48"
     ".s3-object.locaweb.com.br/78c7bd85db3645d7ba1a128b0ba7cb73.png"),

    ("gcx_feat_software_02.png",
     "https://yata-apix-2266b462-917c-4207-b682-e42013fbfa48"
     ".s3-object.locaweb.com.br/ad5c8a84eebd475f9d0f48064c258749.png"),

    ("gcx_feat_software_03.png",
     "https://yata-apix-2266b462-917c-4207-b682-e42013fbfa48"
     ".s3-object.locaweb.com.br/9e1919b2ae50475084eb0bf5f16510f3.png"),

    ("gcx_feat_software_04.png",
     "https://yata-apix-2266b462-917c-4207-b682-e42013fbfa48"
     ".s3-object.locaweb.com.br/4e51322540ef4e9a83e15a4bc75d8185.png"),

    ("gcx_feat_software_05.png",
     "https://yata-apix-2266b462-917c-4207-b682-e42013fbfa48"
     ".s3-object.locaweb.com.br/51e47d25a5f34f6eae6c8514490aeafc.png"),

    # ── Ícones de spec (Shining3D) ────────────────────────────────────────────
    ("gcx_icon_easy.png",
     "https://www.shining3d.com/hs-fs/hubfs/"
     "%E6%96%B0%E7%BD%91%E9%A1%B5%E9%85%8D%E5%9B%BE-08.png"
     "?width=125&height=125"),

    ("gcx_icon_quick.png",
     "https://www.shining3d.com/hs-fs/hubfs/Website-2024/icons/"
     "W%E7%BD%91%E9%A1%B5%E9%85%8D%E5%9B%BE-05-1.png"
     "?width=125&height=125"),
]

# ─── função de download ───────────────────────────────────────────────────────
def baixar(nome, url):
    caminho = os.path.join(PASTA_SAIDA, nome)
    if os.path.isfile(caminho):
        print(f"  ✔ já existe: {nome}")
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        ctx = ssl.create_default_context()
        with urllib.request.urlopen(req, context=ctx, timeout=TIMEOUT) as resp:
            dados = resp.read()
        if len(dados) < 500:
            print(f"  ✘ arquivo vazio/inválido: {nome} ({len(dados)} bytes)")
            return False
        with open(caminho, "wb") as f:
            f.write(dados)
        print(f"  ✔ baixado: {nome}  ({len(dados):,} bytes)")
        return True
    except Exception as exc:
        print(f"  ✘ ERRO em {nome}: {exc}")
        return False

# ─── execução ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"\n{'='*60}")
    print(f"  Download de imagens — Geomagic Control X")
    print(f"  Destino: {PASTA_SAIDA}")
    print(f"{'='*60}\n")

    ok = 0
    falhas = []
    for nome, url in IMAGENS:
        resultado = baixar(nome, url)
        if resultado:
            ok += 1
        else:
            falhas.append(nome)
        time.sleep(DELAY)

    print(f"\n{'─'*60}")
    print(f"  Resultado: {ok}/{len(IMAGENS)} imagens baixadas com sucesso")
    if falhas:
        print(f"  Falhas: {', '.join(falhas)}")
    print(f"{'─'*60}")
    print(
        "\n  PRÓXIMO PASSO: faça upload de todas as imagens deste\n"
        "  diretório para:\n"
        "  WordPress > Mídia > Adicionar nova\n"
        "  https://enterfix.com.br/wp-content/uploads/2026/03/\n"
    )
