#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SCRAPER CHOTEST - VERSÃO RÁPIDA
Extrai apenas os links e títulos dos produtos
"""

import requests
from bs4 import BeautifulSoup
import json
from pathlib import Path
from datetime import datetime
import logging

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ChotestScraperRapido:
    """Scraper rápido para chotest.com"""
    
    # Categorias fornecidas pelo usuário
    CATEGORIAS_URLS = {
        'Contour & Roughness': 'http://www.chotest.com/category.aspx?nid=101',
        'Microscopic Surface': 'http://www.chotest.com/category.aspx?nid=104',
        'Displacement Measurement': 'http://www.chotest.com/category.aspx?nid=100',
        'Dimensional Calibrators': 'http://www.chotest.com/category.aspx?nid=110',
        'Flash Measuring Machine': 'http://www.chotest.com/category.aspx?nid=59',
        'Nano 3D Optical Surface': 'http://www.chotest.com/category.aspx?nid=96',
        '2D Profilometer': 'http://www.chotest.com/category.aspx?nid=97',
        'Video Measuring Machines': 'http://www.chotest.com/category.aspx?nid=10',
        'Confocal Microscope': 'http://www.chotest.com/category.aspx?nid=68',
        'Scanning Electron Microscope': 'http://www.chotest.com/category.aspx?nid=9',
    }
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.produtos = []
    
    def extrair_categoria(self, nome_categoria, url):
        """Extrai produtos de uma categoria"""
        logger.info(f'\n{"="*80}')
        logger.info(f'Extracting: {nome_categoria}')
        logger.info(f'URL: {url}')
        logger.info(f'{"="*80}')
        
        try:
            # Tentar HTTP
            resp = self.session.get(url, timeout=15)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Procurar por links de produtos
            links = soup.find_all('a', href=True)
            detail_links = [l for l in links if 'detail.aspx' in l.get('href', '')]
            
            logger.info(f'Encontrados {len(detail_links)} produtos')
            
            for i, link in enumerate(detail_links, 1):
                href = link.get('href')
                titulo = link.get_text(strip=True)
                
                # Corrigir URL se necessário
                if href.startswith('/'):
                    product_url = 'http://www.chotest.com' + href
                else:
                    product_url = href
                
                # Extrair CID
                cid_match = href.split('cid=')[-1] if 'cid=' in href else None
                
                logger.info(f'  [{i}] {titulo[:50]} (cid={cid_match})')
                
                produto = {
                    'titulo': titulo,
                    'categoria': nome_categoria,
                    'url': product_url,
                    'cid': cid_match,
                    'data_coleta': datetime.now().isoformat()
                }
                self.produtos.append(produto)
        
        except Exception as e:
            logger.error(f'Erro ao extrair categoria {nome_categoria}: {e}')
    
    def executar(self):
        """Executa o scraping completo"""
        logger.info('\n' + '='*80)
        logger.info('INICIANDO SCRAPING CHOTEST - VERSÃO RÁPIDA')
        logger.info('='*80)
        
        for categoria, url in self.CATEGORIAS_URLS.items():
            try:
                self.extrair_categoria(categoria, url)
            except KeyboardInterrupt:
                logger.warning('Scraping interrompido pelo usuário')
                break
            except Exception as e:
                logger.error(f'Erro ao processar categoria {categoria}: {e}')
        
        # Salvar resultados
        self.salvar_resultados()
    
    def salvar_resultados(self):
        """Salva resultados em JSON e relatório"""
        logger.info('\n' + '='*80)
        logger.info('SALVANDO RESULTADOS')
        logger.info('='*80)
        
        # Criar diretório
        output_dir = Path('chotest_produtos')
        output_dir.mkdir(exist_ok=True)
        
        # Salvar JSON
        json_file = output_dir / 'produtos.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(self.produtos, f, ensure_ascii=False, indent=2)
        
        logger.info(f'✓ Salvos {len(self.produtos)} produtos em {json_file}')
        
        # Salvar relatório
        self.gerar_relatorio()
    
    def gerar_relatorio(self):
        """Gera relatório de scraping"""
        output_dir = Path('chotest_produtos')
        relatorio_file = output_dir / 'RELATORIO.txt'
        
        # Agrupar por categoria
        por_categoria = {}
        for produto in self.produtos:
            cat = produto['categoria']
            if cat not in por_categoria:
                por_categoria[cat] = []
            por_categoria[cat].append(produto)
        
        with open(relatorio_file, 'w', encoding='utf-8') as f:
            f.write('╔════════════════════════════════════════════════════════════════════╗\n')
            f.write('║  RELATÓRIO DE SCRAPING - CHOTEST.COM                              ║\n')
            f.write('╚════════════════════════════════════════════════════════════════════╝\n\n')
            f.write(f'Data: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}\n')
            f.write(f'Total de Produtos: {len(self.produtos)}\n')
            f.write(f'Total de Categorias: {len(por_categoria)}\n\n')
            
            f.write('='*80 + '\n')
            f.write('RESUMO POR CATEGORIA:\n')
            f.write('='*80 + '\n\n')
            
            for categoria, produtos in sorted(por_categoria.items()):
                f.write(f'{categoria}: {len(produtos)} produtos\n')
                f.write('-'*80 + '\n')
                for i, produto in enumerate(produtos, 1):
                    f.write(f'  {i}. {produto["titulo"]}\n')
                    f.write(f'     URL: {produto["url"]}\n')
                    f.write(f'     CID: {produto["cid"]}\n\n')
        
        logger.info(f'✓ Relatório salvo em {relatorio_file}')

if __name__ == '__main__':
    scraper = ChotestScraperRapido()
    scraper.executar()
