#!/usr/bin/env python3
"""
GERADOR HTML - Production
Processa 1 produto por vez com espera de 60 segundos entre cada um.
Evita bloqueio do servidor e permite retomada se interrompido.
"""

import json
import logging
import time
import sys
from pathlib import Path
from datetime import datetime
import requests
from bs4 import BeautifulSoup

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

OUTPUT_DIR = Path("chotest_produtos/html_woocommerce_final")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[
        logging.FileHandler(OUTPUT_DIR / "progress.log", encoding='utf-8'),
        logging.StreamHandler()
    ],
    force=True
)
logger = logging.getLogger()

def extrair_descricao_real(url):
    """Extrai descrição REAL da página do produto"""
    try:
        response = requests.get(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}, 
            timeout=20
        )
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove scripts e styles
        for elem in soup(['script', 'style']):
            elem.decompose()
        
        descricao = []
        
        # Extrai seções (h4 com conteúdo)
        for h4 in soup.find_all('h4'):
            titulo_secao = h4.get_text(strip=True)
            if titulo_secao:
                descricao.append(f"\n[{titulo_secao}]\n")
                
                # Pega parágrafos após o h4
                parent = h4.parent
                if parent:
                    for p in parent.find_all('p', recursive=False):
                        texto = p.get_text(strip=True)
                        if texto and len(texto) > 10:
                            descricao.append(texto + "\n")
        
        resultado = ''.join(descricao)
        if resultado:
            return resultado[:8000]  # Limita a 8000 caracteres
        
        return ""
        
    except Exception as e:
        logger.error(f"Erro ao extrair: {e}")
        return ""

def extrair_imagem(url):
    """Extrai URL da imagem do produto"""
    try:
        response = requests.get(
            url,
            headers={'User-Agent': 'Mozilla/5.0'},
            timeout=15
        )
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        for img in soup.find_all('img', limit=20):
            src = img.get('src', '')
            if src:
                if src.startswith('http'):
                    return src
                elif src.startswith('/'):
                    return f"http://www.chotest.com{src}"
                else:
                    return f"http://www.chotest.com/{src}"
        
        return "http://www.chotest.com/Templates/html/images/wx.png"
    except:
        return "http://www.chotest.com/Templates/html/images/wx.png"

def gerar_html(titulo, descricao, imagem_url, url_original):
    """Gera HTML do produto com descrição REAL"""
    
    # Formata parágrafos
    paragrafos = []
    for linha in descricao.split('\n'):
        if linha.strip():
            paragrafos.append(
                f'<p style="line-height:1.6;margin-bottom:15px;font-size:14px;">'
                f'{linha.strip()}'
                f'</p>'
            )
    
    paragrafos_html = '\n'.join(paragrafos)
    
    html = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{titulo}</title>
</head>
<body style="font-family:Arial,sans-serif;color:#333;background-color:#f5f5f5;">
    <div style="max-width:1200px;margin:0 auto;background:white;padding:40px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        
        <div class="header">
            <h1 style="color:#0066cc;font-size:36px;margin:0 0 10px 0;border-bottom:3px solid #0066cc;padding-bottom:15px;">
                {titulo}
            </h1>
            <p style="color:#666;font-size:12px;">
                <strong>Fonte:</strong> <a href="{url_original}" target="_blank" style="color:#0066cc;text-decoration:none;">{url_original}</a>
            </p>
        </div>

        <div class="intro" style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:40px 0;align-items:start;">
            <div class="text">
                <h2 style="color:#0066cc;font-size:18px;margin-bottom:15px;">Informações</h2>
                <p style="font-size:14px;line-height:1.8;color:#666;">
                    Produto de medição industrial com tecnologia avançada.
                </p>
            </div>
            <div class="image" style="text-align:center;">
                <img src="{imagem_url}" alt="{titulo}" 
                     style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);" />
            </div>
        </div>

        <div class="description" style="background-color:#f9f9f9;padding:30px;border-radius:8px;margin:30px 0;border-left:4px solid #0066cc;">
            <h2 style="color:#0066cc;font-size:20px;margin-top:0;margin-bottom:20px;">Descrição Completa</h2>
            <div style="color:#555;font-size:14px;line-height:1.8;">
                {paragrafos_html}
            </div>
        </div>

        <div class="cta" style="background:linear-gradient(135deg,#0066cc 0%,#004499 100%);color:white;padding:40px;text-align:center;border-radius:8px;">
            <h3 style="margin:0 0 15px 0;font-size:22px;">Interessado neste Produto?</h3>
            <p style="margin:0 0 20px 0;font-size:15px;opacity:0.95;">
                Solicite informações ou agende uma demonstração
            </p>
        </div>

    </div>
</body>
</html>'''
    
    return html

def processar_produtos():
    """Processa cada produto com espera de 60 segundos"""
    
    # Carrega lista de produtos
    produtos_json = Path("chotest_produtos/produtos.json")
    with open(produtos_json, 'r', encoding='utf-8') as f:
        produtos = json.load(f)
    
    logger.info("=" * 70)
    logger.info("GERADOR HTML - 1 PRODUTO POR VEZ (60s de espera entre cada)")
    logger.info(f"Total de produtos: {len(produtos)}")
    logger.info("=" * 70)
    
    processados = 0
    erros = 0
    
    for idx, produto in enumerate(produtos, 1):
        try:
            titulo = produto.get('titulo', f'Produto {idx}')
            url = produto.get('url', '')
            cid = produto.get('cid', idx)
            
            # Verifica se já foi processado
            arquivo_saida = OUTPUT_DIR / f"{idx:03d}_{cid}_final.html"
            if arquivo_saida.exists():
                logger.info(f"[{idx:02d}/54] SKIP - Já processado: {titulo[:45]}")
                processados += 1
                continue
            
            logger.info(f"[{idx:02d}/54] Processando: {titulo[:45]}")
            
            # Extrai descrição REAL
            logger.info(f"         -> Extraindo descrição...")
            descricao = extrair_descricao_real(url)
            
            if not descricao or len(descricao) < 100:
                logger.warning(f"         -> AVISO: Descrição muito curta ({len(descricao)} chars)")
            else:
                logger.info(f"         -> Descrição: {len(descricao)} caracteres")
            
            # Extrai imagem
            logger.info(f"         -> Extraindo imagem...")
            imagem = extrair_imagem(url)
            logger.info(f"         -> Imagem: {imagem[-40:]}")
            
            # Gera HTML
            logger.info(f"         -> Gerando HTML...")
            html = gerar_html(titulo, descricao, imagem, url)
            
            # Salva arquivo
            arquivo_saida.write_text(html, encoding='utf-8')
            logger.info(f"         -> SUCESSO: {arquivo_saida.name} ({len(html)} bytes)")
            
            processados += 1
            
            # Aguarda 60 segundos antes do próximo produto (se não for o último)
            if idx < len(produtos):
                logger.info(f"         -> Aguardando 60 segundos antes do próximo produto...")
                time.sleep(60)
            
        except Exception as e:
            logger.error(f"[{idx:02d}/54] ERRO: {str(e)[:100]}")
            erros += 1
            time.sleep(10)  # Aguarda 10s se houver erro
    
    logger.info("\n" + "=" * 70)
    logger.info(f"RESULTADO FINAL:")
    logger.info(f"  Processados: {processados}/54")
    logger.info(f"  Erros: {erros}")
    logger.info(f"  Sucesso: {processados - erros}")
    logger.info(f"  Taxa: {((processados - erros) / 54 * 100):.1f}%")
    logger.info(f"  Saída: {OUTPUT_DIR}")
    logger.info("=" * 70)

if __name__ == '__main__':
    processar_produtos()
