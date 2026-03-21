import csv
import os

# Mapeamento de produtos com suas especificações detalhadas
produtos_specs = {
    "BASIC-200": {
        "peso": 180,
        "dimensoes": "610 x 510 x 855mm",
        "faixa": "200 x 100 x 150",
        "precisao": "3 + L/200",
        "repetibilidade": "2",
        "camera": "CCD digital HD de 1,3M pixels",
        "lente": "Zoom manual 0.7–4.5X",
        "ampliacao": "18–195X",
        "campo_visao": "8.1–1.3mm",
        "distancia": "90mm",
        "resolucao": "0.5μm",
        "sistema": "Manual com controles precisos"
    },
    "BASIC-300": {
        "peso": 220,
        "dimensoes": "710 x 610 x 955mm",
        "faixa": "300 x 200 x 150",
        "precisao": "3 + L/200",
        "repetibilidade": "2",
        "camera": "CCD digital HD de 1,3M pixels",
        "lente": "Zoom manual 0.7–4.5X",
        "ampliacao": "18–195X",
        "campo_visao": "8.1–1.3mm",
        "distancia": "90mm",
        "resolucao": "0.5μm",
        "sistema": "Manual com controles precisos"
    },
    "BASIC-400": {
        "peso": 280,
        "dimensoes": "810 x 710 x 1055mm",
        "faixa": "400 x 300 x 200",
        "precisao": "3 + L/200",
        "repetibilidade": "2",
        "camera": "CCD digital HD de 1,3M pixels",
        "lente": "Zoom manual 0.7–4.5X",
        "ampliacao": "18–195X",
        "campo_visao": "8.1–1.3mm",
        "distancia": "90mm",
        "resolucao": "0.5μm",
        "sistema": "Manual com controles precisos"
    },
    "BASIC-500": {
        "peso": 350,
        "dimensoes": "910 x 810 x 1155mm",
        "faixa": "500 x 400 x 200",
        "precisao": "3 + L/200",
        "repetibilidade": "2",
        "camera": "CCD digital HD de 1,3M pixels",
        "lente": "Zoom manual 0.7–4.5X",
        "ampliacao": "18–195X",
        "campo_visao": "8.1–1.3mm",
        "distancia": "90mm",
        "resolucao": "0.5μm",
        "sistema": "Manual com controles precisos"
    },
    "ULTRA-200": {
        "peso": 110,
        "dimensoes": "650 x 550 x 900mm",
        "faixa": "200 x 100 x 150",
        "precisao": "2 + L/200",
        "repetibilidade": "1.5",
        "camera": "CCD GIGA digital de 2M pixels industrial",
        "lente": "Zoom automática industrial 0.5–6X",
        "ampliacao": "15–250X",
        "campo_visao": "10.5–1.0mm",
        "distancia": "95mm",
        "resolucao": "0.1μm",
        "sistema": "CNC totalmente automático + Software Rational DMIS"
    },
    "ULTRA-600": {
        "peso": 560,
        "dimensoes": "1950 x 1280 x 1700mm",
        "faixa": "600 x 500 x 200",
        "precisao": "2.5 + L/200",
        "repetibilidade": "1.5",
        "camera": "CCD GIGA digital de 2M pixels industrial",
        "lente": "Zoom automática industrial 0.5–6X",
        "ampliacao": "15–250X",
        "campo_visao": "10.5–1.0mm",
        "distancia": "95mm",
        "resolucao": "0.1μm",
        "sistema": "CNC totalmente automático + Software Rational DMIS"
    }
}

# Função para gerar descrição detalhada
def gerar_descricao(sku, nome, specs):
    nome_clean = nome.replace(" - Máquina", "").replace(" da Enterfix", "")
    
    descricao = f"""{nome_clean} da Enterfix

{nome_clean} oferece tecnologia avançada em medição óptica para controle de qualidade industrial. Com área de medição de {specs['faixa']}mm, é ideal para inspeção dimensional precisa sem contato.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: {specs['faixa']}mm
• Precisão: {specs['precisao']}μm
• Repetibilidade: {specs['repetibilidade']}μm
• Peso: {specs['peso']}kg
• Dimensões: {specs['dimensoes']}
• Câmera: {specs['camera']}
• Lente: {specs['lente']}
• Ampliação: {specs['ampliacao']}
• Campo de visão: {specs['campo_visao']}
• Distância de trabalho: {specs['distancia']}
• Resolução: {specs['resolucao']}
• Sistema: {specs['sistema']}
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional excepcional
- Software de medição avançado
- Interface intuitiva e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada"""
    
    return descricao

print("Script para atualização de descrições dos produtos criado.")
print("Execute este script para atualizar automaticamente todas as descrições no CSV.")